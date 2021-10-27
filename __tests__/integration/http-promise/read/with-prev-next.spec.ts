import { JSDOM } from 'jsdom';

import { from, single } from '../../../../src/__draft__/core';
import { apiRoot } from '../../../../src/__draft__/http-promise/context/api/api-root';
import { createRequest } from '../../../../src/__draft__/http-promise/context/api/create-request';
import { entitiesApi } from '../../../../src/__draft__/http-promise/context/api/entities-api';
import { mapEntityToPath, onlyPluralEndpoint } from '../../../../src/__draft__/http-promise/context/api/entity-to-path-mapper';
import { filterToQs, jsonToProp, optionsToQs } from '../../../../src/__draft__/http-promise/context/api/to-query-string';
import { HttpPromiseContext } from '../../../../src/__draft__/http-promise/context/context';
import { withPrevNextMiddlewareSplitQueries } from '../../../../src/__draft__/http-promise/plugins/with-prev-next/middleware/split-query';
import { withPrevNext } from '../../../../src/__draft__/http-promise/plugins/with-prev-next/query-operator';
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
		withPrevNextMiddlewareSplitQueries(),
		apiRoot( 'http://example.com' ),
		mapEntityToPath( onlyPluralEndpoint ),
		filterToQs( jsonToProp( 'q' ) ),
		optionsToQs( jsonToProp( 'opts' ) ),
	),
	win: dom.window,
} );
describe( 'HTTP promise read with prev/next', () => {
	it( 'should return null if empty array as result', async () => {
		fetch.mockResolvedValue( {
			json: () => Promise.resolve( [] ),
		} as Partial<Response> as Response );
		const resolved = await read(
			single( Foo ),
			from( context ),
			withPrevNext( {} )(),
		);
		expect( resolved ).toEqual( null );
	} );
	it( 'should return null if json is null', async () => {
		fetch.mockResolvedValue( {
			json: () => Promise.resolve( null ),
		} as Partial<Response> as Response );
		const resolved = await read(
			single( Foo ),
			from( context ),
			withPrevNext( {} )(),
		);
		expect( resolved ).toEqual( null );
	} );
	it( 'should return null if no results', async () => {
		const entities = [
			{ hello: 'foo' },
			{ hello: 'bar' },
		];
		fetch.mockResolvedValue( {
			json: () => Promise.resolve( entities ),
		} as Partial<Response> as Response );
		const resolved = await read(
			single( Foo ),
			from( context ),
			withPrevNext( {} )(),
		);
		// expect( resolved ).toEqual( {
		// 	prev: undefined,
		// 	current: expect.any( Foo ),
		// 	next: expect.any( Foo ),
		// } );
		expect( resolved ).toEqual( {
			prev: undefined,
			current: entities[0],
			next: entities[1],
		} );
	} );
} );
