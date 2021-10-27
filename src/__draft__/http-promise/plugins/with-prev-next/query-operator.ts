import { autoCurry } from '../../../core/auto-curry';
import { ENumeration } from '../../../core/types';
import { Override, isNil, notImplemented } from '../../../core/utils';
import { IQueryContext, QueryOperatorFn } from '../types';
import { QueryOperatorsChain } from '../using';

type WithPrevNextCtx<T> = T extends IQueryContext<infer TEntity> ?
	IQueryContext<TEntity, ENumeration.SINGLE, TEntity, true> :
	never;
type WithPrevNext<TCurrent, TPrevNext> = IQueryContext.GetNumeration<TCurrent> extends ENumeration.SINGLE ?
	Override<
		TCurrent,
		{output: PrevNextOutput<IQueryContext.GetOutput<TCurrent>, IQueryContext.ToOutput<TPrevNext>>}> :
	never;
export type PrevNextOutput<TCurrent, TPrevNext> = {current: TCurrent; prev: TPrevNext; next: TPrevNext}
export interface IPrevNextMeta {
	transforms: ReadonlyArray<QueryOperatorFn<IQueryContext.Any, IQueryContext.Any>>;
}
type PrevNextOperatorChain<T> = T extends [infer TIn, ...infer TMid] ?
	QueryOperatorsChain<[WithPrevNextCtx<TIn>, ...TMid]> :
	never;
export const withPrevNext: {
	( middleware: unknown ): {
		<TIn>(): QueryOperatorFn<TIn, WithPrevNext<TIn, WithPrevNextCtx<TIn>>>;
		<TIn, TOut>(
			...transform: PrevNextOperatorChain<[TIn, TOut]>
		): QueryOperatorFn<TIn, WithPrevNext<TIn, TOut>>;
		<TIn, T1, TOut>(
			...transform: PrevNextOperatorChain<[TIn, T1, TOut]>
		): QueryOperatorFn<TIn, WithPrevNext<TIn, TOut>>;
		<TIn, T1, T2, TOut>(
			...transform: PrevNextOperatorChain<[TIn, T1, T2, TOut]>
		): QueryOperatorFn<TIn, WithPrevNext<TIn, TOut>>;
		(
			...transform: Array<QueryOperatorFn<IQueryContext.Any, IQueryContext.Any>>
		): QueryOperatorFn<IQueryContext.Any, WithPrevNext<IQueryContext.Any, IQueryContext.Any>>;
	};
	<TIn, TOut>(
		middleware: unknown,
		...transform: PrevNextOperatorChain<[TIn, TOut]>
	): QueryOperatorFn<TIn, WithPrevNext<TIn, TOut>>;
	<TIn, T1, TOut>(
		middleware: unknown,
		...transform: PrevNextOperatorChain<[TIn, T1, TOut]>
	): QueryOperatorFn<TIn, WithPrevNext<TIn, TOut>>;
	<TIn, T1, T2, TOut>(
		middleware: unknown,
		...transform: PrevNextOperatorChain<[TIn, T1, T2, TOut]>
	): QueryOperatorFn<TIn, WithPrevNext<TIn, TOut>>;
	(
		middleware: unknown,
		...transform: Array<QueryOperatorFn<IQueryContext.Any, IQueryContext.Any>>
	): QueryOperatorFn<IQueryContext.Any, WithPrevNext<IQueryContext.Any, IQueryContext.Any>>;
} = autoCurry( (
	middleware: unknown,
	...transforms: Array<QueryOperatorFn<IQueryContext.Any, IQueryContext.Any>>
): QueryOperatorFn<IQueryContext.Any, WithPrevNext<IQueryContext.Any, IQueryContext.Any>> => {
	if( transforms.length > 0 ){
		notImplemented();
	}
	return ctx => {
		const baseSkip = ctx.options?.skip ?? 0;
		return {
			...ctx,
			options: {
				...ctx.options,
				...( baseSkip ?
					{ limit: 3, skip: baseSkip - 1 } :
					{ limit: 2, skip: 0 } ),
			},
			numeration: ENumeration.MULTIPLE,
			mappers: [
				...ctx.mappers,
				async ( results: unknown ) => {
					if( isNil( results ) ){
						return null;
					} else if( !Array.isArray( results ) ){
						throw new TypeError( 'Not an array' );
					}
					const [ prev, current, next ] = baseSkip ? results : [ undefined, ...results ];
					if( !current ){
						return null;
					}
					return { current, next: next ?? undefined, prev: prev ?? undefined } as PrevNextOutput<unknown, unknown>;
				},
			],
		};
	};
}, true ) as any; // FIXME

