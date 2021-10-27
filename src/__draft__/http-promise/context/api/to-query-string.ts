import { AutoCurry, autoCurry } from '../../../core/auto-curry';
import { tap } from '../../../core/utils';
import { IQueryContext } from '../../plugins/types';
import { Descriptor, IRequestGenerator } from './types';

export type QueryStringSerializer<T> = ( params: URLSearchParams, componment: T ) => URLSearchParams;

export type ToQs<T> = ( ( ( ...args: never[] ) => any ) & AutoCurry<[QueryStringSerializer<T>], IRequestGenerator> );
export const toQs = autoCurry( ( getter: ( descriptor: Descriptor ) => any, querySerializer: QueryStringSerializer<any> ): IRequestGenerator => ( {
	generate: ( desc, next ) => next( {
		...desc,
		params: querySerializer( new URLSearchParams( desc.params ), getter( desc ) ),
	} ),
} ) );

export const jsonToProp = <T = any>( prop: string ): QueryStringSerializer<T> =>
	tap( ( params, query ) => query ? params.set( prop, JSON.stringify( query ) ) : undefined );


export type FilterSerializer = ( params: URLSearchParams, query: IQueryContext.Filter ) => URLSearchParams;
export const filterToQs = toQs( d => d.context.filter ) as ToQs<IQueryContext.Filter>;
export type OptionsSerializer = ( params: URLSearchParams, query: IQueryContext.Options ) => URLSearchParams;
export const optionsToQs = toQs( d => {
	const { options: { limit, skip } = { limit: undefined, skip: 0 }} = d.context;
	return {
		limit,
		skip: typeof skip === 'number' && skip >= 1 ? skip : undefined,
	};
} ) as ToQs<IQueryContext.Options>;
