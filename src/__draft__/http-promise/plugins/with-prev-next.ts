import { ENumeration } from '../../core/types';
import { Override, notImplemented } from '../../core/utils';
import { IQueryContext, QueryOperatorFn } from './types';

type WithPrevNextCtx<T> = T extends IQueryContext<infer TEntity> ?
	IQueryContext<TEntity, ENumeration.SINGLE, TEntity, true> :
	never;
type WithPrevNext<TCurrent, TPrevNext> = IQueryContext.GetNumeration<TCurrent> extends ENumeration.SINGLE ?
	Override<TCurrent, {output: {current: IQueryContext.GetOutput<TCurrent>; prev: IQueryContext.ToOutput<TPrevNext>; next: IQueryContext.ToOutput<TPrevNext>}}> :
	never;
export const withPrevNext: {
	<TIn>(): QueryOperatorFn<
		TIn,
		WithPrevNext<TIn, WithPrevNextCtx<TIn>>>;
	<TIn, TOut>(
		transform1: QueryOperatorFn<WithPrevNextCtx<TIn>, TOut>
	): QueryOperatorFn<
		TIn,
		WithPrevNext<TIn, TOut>>;
	<TIn, T1, TOut>(
		transform1: QueryOperatorFn<WithPrevNextCtx<TIn>, T1>,
		transform2: QueryOperatorFn<T1, TOut>,
	): QueryOperatorFn<
		TIn,
		WithPrevNext<TIn, TOut>>;
	<TIn, T1, T2, TOut>(
		transform1: QueryOperatorFn<WithPrevNextCtx<TIn>, T1>,
		transform2: QueryOperatorFn<T1, T2>,
		transform3: QueryOperatorFn<T2, TOut>,
	): QueryOperatorFn<
		TIn,
		WithPrevNext<TIn, TOut>>;
} = notImplemented;
