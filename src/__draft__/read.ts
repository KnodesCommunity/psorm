// type TemplateStrignsArrayOf<T extends ReadonlyArray<string>> = TemplateStringsArray & T & {raw: T};
// export const read = <T>(
//     strings: TemplateStrignsArrayOf<readonly ['single ', ' from ', ' where ']>,
//     entity: Type<T>,
//     context: unknown,
//     query: any
// ): Promise<T | null> => Promise.resolve(null);

import { IQueryContext, PostProcessFn } from './plugins/types';
import { Numerable } from './query-components/numerable/types';
import { TargetContext } from './query-components/source/types';

export const read: {
	<TNumeration extends Numerable<any>>(
		output: TNumeration,
		targetContext: TargetContext<any>,
	): Promise<IQueryContext.ToOutput<IQueryContext.FromNumeration<TNumeration>>>;
	<TNumeration extends Numerable<any>, TProcess1>(
		output: TNumeration,
		targetContext: TargetContext<any>,
		transform1: PostProcessFn<IQueryContext.FromNumeration<TNumeration>, TProcess1>,
	): Promise<IQueryContext.ToOutput<TProcess1>>;
	<TNumeration extends Numerable<any>, T1, TOut>(
		output: TNumeration,
		targetContext: TargetContext<any>,
		transform1: PostProcessFn<IQueryContext.FromNumeration<TNumeration>, T1>,
		transform2: PostProcessFn<T1, TOut>,
	): Promise<IQueryContext.ToOutput<TOut>>;
	<TNumeration extends Numerable<any>, T1, T2, TOut>(
		output: TNumeration,
		targetContext: TargetContext<any>,
		transform1: PostProcessFn<IQueryContext.FromNumeration<TNumeration>, T1>,
		transform2: PostProcessFn<T1, T2>,
		transform3: PostProcessFn<T2, TOut>,
	): Promise<IQueryContext.ToOutput<TOut>>;
} = ( ...args: any[] ) => Promise.resolve( null as any );
