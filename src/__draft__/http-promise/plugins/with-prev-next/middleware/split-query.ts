import { ENumeration } from '../../../../core/types';
import { isNil } from '../../../../core/utils';
import { Descriptor, IRequestGenerator, RequestGeneratorNextFn, RequestGeneratorRet } from '../../../context/api/types';
import { HttpPromiseContext } from '../../../context/context';
import { PrevNextOutput } from '../query-operator';

class WithPrevNextMiddlewareSplitQueries implements IRequestGenerator {
	/**
	 * @param desc
	 * @param callNext
	 */
	public generate( desc: Descriptor, callNext: RequestGeneratorNextFn ): RequestGeneratorRet {
        return {} as any
		// const prevNextMeta = prevNextMetaStore( desc.context ).get();
		// if( prevNextMeta ){
		// 	const ctx = desc.context.context as HttpPromiseContext;
		// 	const baseSkip = desc.context.options?.skip ?? 0;
		// 	const { postHooks, request } = callNext( {
		// 		context: {
		// 			...desc.context,
		// 			options: baseSkip ?
		// 				{ limit: 3, skip: baseSkip - 1 } :
		// 				{ limit: 2, skip: 0 },
		// 			numeration: ENumeration.MULTIPLE,
		// 		},
		// 		request: desc.request,
		// 	} );
		// 	return {
		// 		request,
		// 		postHooks: [
		// 			async ( results: unknown ) => {
		// 				if( isNil( results ) ){
		// 					return null;
		// 				} else if( !Array.isArray( results ) ){
		// 					throw new TypeError( 'Not an array' );
		// 				}
		// 				const [ prev, current, next ] = baseSkip ? results : [ undefined, ...results ];
		// 				if( !current ){
		// 					return null;
		// 				}
		// 				return { current, next: next ?? undefined, prev: prev ?? undefined } as PrevNextOutput<unknown, unknown>;
		// 			},
		// 			...postHooks ?? [],
		// 		],
		// 	};
		// } else {
		// 	return callNext( desc );
		// }
	}
}
export const withPrevNextMiddlewareSplitQueries = (): IRequestGenerator => new WithPrevNextMiddlewareSplitQueries();
