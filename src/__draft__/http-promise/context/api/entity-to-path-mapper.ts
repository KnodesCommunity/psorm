import { Class, PartialDeep } from 'type-fest';

import { ENumeration } from '../../../core/types';

import { Override } from '../../../core/utils';
import { IQueryContext } from '../../plugins/types';

import { Descriptor, IRequestGenerator, RequestGeneratorNextFn, RequestGeneratorRet } from './types';

export const onlyPluralEndpoint: EntityToPath = ( desc: Descriptor ) => {
	const name = desc.context.entityClass.name.toLowerCase();
	const common = {
		pathSegments: [ `${name.replace( /y$/, 'ie' )}s` ] as const,
	};
	if( desc.context.numeration === ENumeration.MULTIPLE ){
		return common;
	} else {
		return {
			...common,
			context: {
				numeration: ENumeration.MULTIPLE,
				options: {
					...desc.context.options,
					limit: 1,
				},
			},
			postHook: [
				data => {
					if( Array.isArray( data ) ) {
						if( data.length > 1 ) {
							throw new TypeError( 'Too many items returned, expected nil, [] or exactly one item.' );
						} else {
							return data[0] ?? null;
						}
					} else {
						return null;
					}
				},
			],
		};
	}
};
const joinPathSegments = ( ...segments: string[] ) => segments.join( '/' ).replace( /\/{2,}/g, '/' );

type EntityToPath = ( desc: Descriptor ) => {
	readonly pathSegments: readonly [string, ...string[]];
	readonly postHook?: readonly RequestGeneratorRet.PostHook[];
	readonly context?: Readonly<Override<PartialDeep<Omit<IQueryContext, 'mappers'>>, {readonly entityClass?: Class<unknown>}>>;
};
class EntityToPathMapperMiddleware implements IRequestGenerator {
	public constructor( private readonly _entityPathMapper: EntityToPath ){}
	/**
	 * @param desc
	 * @param callNext
	 */
	public generate( desc: Descriptor, callNext: RequestGeneratorNextFn ): RequestGeneratorRet {
		const { context: mappedContext, pathSegments, postHook: mappedPostHook } = this._entityPathMapper( desc );
		const nextRet = callNext( {
			...desc,
			context: {
				...desc.context,
				...mappedContext,
				options: mappedContext?.options ?? desc.context.options,
				filter: mappedContext?.filter ?? desc.context.filter,
			},
			url: {
				...desc.url,
				pathname: joinPathSegments( desc.url?.pathname ?? '', ...pathSegments ),
			},
		} );
		return {
			...nextRet,
			postHooks: [
				...mappedPostHook ?? [],
				...nextRet.postHooks ?? [],
			],
		};
	}
}
export const mapEntityToPath = ( entityPathMapper: EntityToPath ): IRequestGenerator => new EntityToPathMapperMiddleware( entityPathMapper );
