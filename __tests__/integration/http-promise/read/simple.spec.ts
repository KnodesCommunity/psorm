import { JSDOM } from 'jsdom';

import { from, single } from '../../../../src/__draft__/core';
import { apiRoot } from '../../../../src/__draft__/http-promise/context/api/api-root';
import { createRequest } from '../../../../src/__draft__/http-promise/context/api/create-request';
import { entitiesApi } from '../../../../src/__draft__/http-promise/context/api/entities-api';
import { mapEntityToPath, onlyPluralEndpoint } from '../../../../src/__draft__/http-promise/context/api/entity-to-path-mapper';
import { filterToQs, jsonToProp, optionsToQs } from '../../../../src/__draft__/http-promise/context/api/to-query-string';
import { assignUrl } from '../../../../src/__draft__/http-promise/context/api/utils';
import { HttpPromiseContext } from '../../../../src/__draft__/http-promise/context/context';
import { read } from '../../../../src/__draft__/http-promise/read';
import { Request } from '../../../helpers/polyfills/window';

class Foo {
	public hello!: string;
}
const dom = new JSDOM( '', {
	url: 'https://example.org/',
	referrer: 'https://example.com/',
	contentType: 'text/html',
	includeNodeLocations: true,
	storageQuota: 10000000,
} );
( dom.window as any ).Request = Request;
const fetch = jest.fn<ReturnType<typeof window.fetch>, Parameters<typeof window.fetch>>();
( dom.window as any ).fetch = fetch;

const context = new HttpPromiseContext( {
	api: entitiesApi( {
		[`${Foo}`]: createRequest( dom.window as any ),
	} ).using(
		apiRoot( 'http://example.com' ),
		mapEntityToPath( onlyPluralEndpoint ),
		filterToQs( jsonToProp( 'q' ) ),
		optionsToQs( jsonToProp( 'opts' ) ),
	),
	win: dom.window,
} );

beforeEach( jest.clearAllMocks );
describe( 'HTTP promise read simple', () => {
	describe( 'Query single', () => {
		const expectedUrl = assignUrl( dom.window as any, {
			hostname: 'example.com',
			protocol: 'http:',
			search: `?${new URLSearchParams( { opts: JSON.stringify( { limit: 1 } ) } ).toString()}`,
			pathname: '/foos',
		} );
		it( 'should call plural endpoint and return null if zero out', async () => {
			fetch.mockResolvedValue( {
				json: () => Promise.resolve( [] ),
			} as Partial<Response> as Response );
			const resolved = await read(
				single( Foo ),
				from( context ),
			);
			expect( resolved ).toEqual( null );
			expect( fetch ).toHaveBeenCalledTimes( 1 );
			expect( fetch ).toHaveBeenCalledWith( expect.objectContaining( {
				url: expectedUrl.toString(),
				method: 'GET',
			} ) );
		} );
		it( 'should call plural endpoint and return null if null out', async () => {
			fetch.mockResolvedValue( {
				json: () => Promise.resolve( null ),
			} as Partial<Response> as Response );
			const resolved = await read(
				single( Foo ),
				from( context ),
			);
			expect( resolved ).toEqual( null );
			expect( fetch ).toHaveBeenCalledTimes( 1 );
			expect( fetch ).toHaveBeenCalledWith( expect.objectContaining( {
				url: expectedUrl.toString(),
				method: 'GET',
			} ) );
		} );
		it( 'should call plural endpoint and return the first item if single out', async () => {
			const entities = [ { hello: 'world' } ] as const;
			fetch.mockResolvedValue( {
				json: () => Promise.resolve( entities ),
			} as Partial<Response> as Response );
			const resolved = await read(
				single( Foo ),
				from( context ),
			);
			expect( resolved ).toEqual( entities[0] );
			expect( fetch ).toHaveBeenCalledTimes( 1 );
			expect( fetch ).toHaveBeenCalledWith( expect.objectContaining( {
				url: expectedUrl.toString(),
				method: 'GET',
			} ) );
		} );
		it( 'should call plural endpoint and throw error if multiple out', async () => {
			const entities = [ { hello: 'world' }, { hello: 'bar' } ] as const;
			fetch.mockResolvedValue( {
				json: () => Promise.resolve( entities ),
			} as Partial<Response> as Response );
			await expect( read(
				single( Foo ),
				from( context ),
			) ).rejects.toThrowWithMessage( TypeError, /^Too many items returned/ );
			expect( fetch ).toHaveBeenCalledTimes( 1 );
			expect( fetch ).toHaveBeenCalledWith( expect.objectContaining( {
				url: expectedUrl.toString(),
				method: 'GET',
			} ) );
		} );
	} );
} );
