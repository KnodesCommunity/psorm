import { JSDOM } from 'jsdom';
import { Class } from 'type-fest';

import { Request } from '../../../../__tests__/helpers/polyfills/window';
import { ENumeration } from '../../core/types';
import { apiRoot } from './api/api-root';
import { createRequest } from './api/create-request';
import { entitiesApi } from './api/entities-api';
import { mapEntityToPath, onlyPluralEndpoint } from './api/entity-to-path-mapper';
import { filterToQs, jsonToProp, optionsToQs } from './api/to-query-string';
import { IRequestGenerator } from './api/types';

class Foo {}
class Bar extends Foo {}
const dom = new JSDOM( '', {
	url: 'https://example.org/',
	referrer: 'https://example.com/',
	contentType: 'text/html',
	includeNodeLocations: true,
	storageQuota: 10000000,
} );
( dom.window as any ).Request = Request;
describe( 'API composition', () => {
	const callGroup = ( entityClass: Class<any>, generator: IRequestGenerator ) => {
		const desc = { context: {
			entityClass,
			filter: { foo: 'bar' },
			options: { skip: 1 },
			nullable: true,
			numeration: ENumeration.SINGLE,
			output: {} as any,
			mappers: [],
		}};
		const { request, postHooks } = generator.generate( desc, () => {throw new Error( 'Fallback' );} )!;
		expect( postHooks ).toHaveLength( 1 );
		const url = new URL( request!.url );
		expect( url.protocol ).toEqual( 'https:' );
		expect( url.host ).toEqual( 'example.com' );
		expect( url.pathname ).toEqual( '/rest/foos' );
		expect( JSON.parse( url.searchParams.get( 'q' ) ?? 'null' ) ).toEqual( desc.context.filter );
		expect( JSON.parse( url.searchParams.get( 'opts' ) ?? 'null' ) ).toEqual( { ...desc.context.options, limit: 1 } );
	};
	describe( 'Direct match', () => {
		it( 'should use correctly shared middlewares', () => {
			const group = entitiesApi( {
				[`${Foo}`]: createRequest( dom.window as any ),
			} ).using(
				apiRoot( 'https://example.com/rest' ),
				mapEntityToPath( onlyPluralEndpoint ),
				filterToQs( jsonToProp( 'q' ) ),
				optionsToQs( jsonToProp( 'opts' ) ) );
			callGroup( Foo, group );
		} );
		it( 'should use correctly endpoint middlewares', () => {
			const group = entitiesApi( {
				[`${Foo}`]: entitiesApi( {}, [
					apiRoot( 'https://example.com/rest' ),
					mapEntityToPath( onlyPluralEndpoint ),
					filterToQs( jsonToProp( 'q' ) ),
					optionsToQs( jsonToProp( 'opts' ) ),
					createRequest( dom.window as any ),
				] ),
			} );
			callGroup( Foo, group );
		} );
	} );
	describe( 'Parent class match', () => {
		it( 'should use correctly shared middlewares', () => {
			const group = entitiesApi( {
				[`${Foo}`]: createRequest( dom.window as any ),
			} ).using(
				apiRoot( 'https://example.com/rest' ),
				mapEntityToPath( onlyPluralEndpoint ),
				filterToQs( jsonToProp( 'q' ) ),
				optionsToQs( jsonToProp( 'opts' ) ) );
			callGroup( Bar, group );
		} );
		it( 'should use correctly endpoint middlewares', () => {
			const group = entitiesApi( {
				[`${Foo}`]: entitiesApi( {}, [
					apiRoot( 'https://example.com/rest' ),
					mapEntityToPath( onlyPluralEndpoint ),
					filterToQs( jsonToProp( 'q' ) ),
					optionsToQs( jsonToProp( 'opts' ) ),
					createRequest( dom.window as any ),
				] ),
			} );
			callGroup( Bar, group );
		} );
	} );
} );
