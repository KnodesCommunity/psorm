// type TemplateStrignsArrayOf<T extends ReadonlyArray<string>> = TemplateStringsArray & T & {raw: T};
// export const read = <T>(
//     strings: TemplateStrignsArrayOf<readonly ['single ', ' from ', ' where ']>,
//     entity: Type<T>,
//     context: unknown,
//     query: any
// ): Promise<T | null> => Promise.resolve(null);

import { Numerable } from '../core/query-target/types';
import { IQueryContext } from './plugins/types';
import { QueryOperatorsChain } from './plugins/using';
import { TargetContext } from './query-components/source/types';

export const read: {
	<TNumeration extends Numerable<any>>(
		output: TNumeration,
		targetContext: TargetContext<any>,
	): Promise<IQueryContext.ToOutput<IQueryContext.FromNumeration<TNumeration>>>;
	<TNumeration extends Numerable<any>, TOut>(
		output: TNumeration,
		targetContext: TargetContext<any>,
		...transforms: QueryOperatorsChain<[IQueryContext.FromNumeration<TNumeration>, TOut]>
	): Promise<IQueryContext.ToOutput<TOut>>;
	<TNumeration extends Numerable<any>, T1, TOut>(
		output: TNumeration,
		targetContext: TargetContext<any>,
		...transforms: QueryOperatorsChain<[IQueryContext.FromNumeration<TNumeration>, T1, TOut]>
	): Promise<IQueryContext.ToOutput<TOut>>;
	<TNumeration extends Numerable<any>, T1, T2, TOut>(
		output: TNumeration,
		targetContext: TargetContext<any>,
		...transforms: QueryOperatorsChain<[IQueryContext.FromNumeration<TNumeration>, T1, T2, TOut]>
	): Promise<IQueryContext.ToOutput<TOut>>;
} = ( ..._args: any[] ) => Promise.resolve( null as any );
