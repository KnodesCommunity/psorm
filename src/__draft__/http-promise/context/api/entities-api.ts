import { Class } from 'type-fest';

import { getProtoChain, sortByOther } from '../../../core/utils';
import { IQueryContext } from '../../plugins/types';
import { Descriptor, IRequestGenerator, RequestGeneratorNextFn, RequestGeneratorRet } from './types';

class EntitiesApiMiddleware implements IRequestGenerator {
	public constructor( private readonly _entitiesMap: {[key: string]: IRequestGenerator}, private readonly _middlewares: IRequestGenerator[] = [] ) {}

	/**
	 * @param descriptor
	 * @param n
	 */
	public generate( descriptor: Descriptor, n?: RequestGeneratorNextFn ): RequestGeneratorRet {
		const handlers = this._getEntityHandler( descriptor.context );
		const possibleHandlers = [
			...this._middlewares,
			...handlers.map( h => h.generator ),
			...( n ? [ { generate: n } ] : [] ),
		];

		const baseHandler = possibleHandlers
			.reverse()
			.reduce(
				( next, generator ) => desc => generator.generate( desc, next ),
				( () => {
					throw new Error( `No suitable RequestGenerator found for ${descriptor.context?.entityClass?.name}` );
				} ) as RequestGeneratorNextFn );
		return baseHandler( {
			...descriptor,
			context: handlers.length > 0 ?
				{ ...descriptor.context, entityClass: handlers[0].targetEntity } :
				descriptor.context,
		} );
	}
	/**
	 * @param middlewares
	 */
	public using( ...middlewares: IRequestGenerator[] ): EntitiesApiMiddleware {
		return entitiesApi( this._entitiesMap, [ ...middlewares, ...this._middlewares ] );
	}

	/**
	 * @param context
	 */
	private _getEntityHandler( context: IQueryContext ): Array<{targetEntity: Class<any>; generator: IRequestGenerator}> {
		const protoChain = context.entityClass ? getProtoChain( context.entityClass ).map( c => [ c, `${c}` ] as const ) : [];
		return Object.entries( this._entitiesMap ?? {} )
			.filter( ( [ entityClassStr ] ) => protoChain.some( ( [ , protoStr ] ) => protoStr === entityClassStr ) )
			.map( ( [ entityClassStr, generator ] ) => ( {
				entityClassStr,
				generator,
				entityClass: protoChain.find( ( [ , protoStr ] ) => protoStr === entityClassStr )?.[0],
			} ) )
			.filter( ( v ): v is typeof v & {entityClass: Class<any, any[]>} => !!v.entityClass )
			.sort( sortByOther( protoChain.map( ( [ , pcs ] ) => pcs ), ( { entityClassStr } ) => entityClassStr ) )
			.map( ( { generator, entityClass } ) => ( { generator, targetEntity: entityClass } ) );
	}
}
export const entitiesApi = ( entitiesMap: {[key: string]: IRequestGenerator}, middlewares: IRequestGenerator[] = [] ): EntitiesApiMiddleware => new EntitiesApiMiddleware( entitiesMap, middlewares );
