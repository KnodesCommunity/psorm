import { ENumerable } from '../query-components/numerable/types';
import { Override, notImplemented } from '../utils';
import { IQueryContext, PostProcessFn } from './types';

type WithPrevNextCtx<T> = T extends IQueryContext<infer TEntity> ?
	IQueryContext<TEntity, ENumerable.SINGLE, TEntity, true> :
	never;
type WithPrevNext<TCurrent, TPrevNext> = IQueryContext.GetNumeration<TCurrent> extends ENumerable.SINGLE ?
	Override<TCurrent, {output: {current: IQueryContext.GetOutput<TCurrent>; prev: IQueryContext.ToOutput<TPrevNext>; next: IQueryContext.ToOutput<TPrevNext>}}> :
	never;
export const withPrevNext: {
	<TIn>(): PostProcessFn<
		TIn,
		WithPrevNext<TIn, WithPrevNextCtx<TIn>>>;
	<TIn, TOut>(
		transform1: PostProcessFn<WithPrevNextCtx<TIn>, TOut>
	): PostProcessFn<
		TIn,
		WithPrevNext<TIn, TOut>>;
	<TIn, T1, TOut>(
		transform1: PostProcessFn<WithPrevNextCtx<TIn>, T1>,
		transform2: PostProcessFn<T1, TOut>,
	): PostProcessFn<
		TIn,
		WithPrevNext<TIn, TOut>>;
	<TIn, T1, T2, TOut>(
		transform1: PostProcessFn<WithPrevNextCtx<TIn>, T1>,
		transform2: PostProcessFn<T1, T2>,
		transform3: PostProcessFn<T2, TOut>,
	): PostProcessFn<
		TIn,
		WithPrevNext<TIn, TOut>>;
} = notImplemented;
