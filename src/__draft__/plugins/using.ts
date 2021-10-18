import { notImplemented } from '../utils';
import { QueryOperatorFn } from './types';

export type QueryOperatorsChain<T extends any[] | [void]> = T extends [infer T1, infer T2, ...infer TNext] ?
	[
		QueryOperatorFn<T1, T2>,
		...QueryOperatorsChain<[T2, ...TNext]>
	] : []

export const using: {
	<TIn, TOut>(
		...transforms: QueryOperatorsChain<[TIn, TOut]>
	): QueryOperatorFn<TIn, TOut>;
	<TIn, T1, TOut>(
		...transforms: QueryOperatorsChain<[TIn, T1, TOut]>
	): QueryOperatorFn<TIn, TOut>;
	<TIn, T1, T2, T3, T4, TOut>(
		...transforms: QueryOperatorsChain<[TIn, T1, T2, T3, T4, TOut]>
	): QueryOperatorFn<TIn, TOut>;
} = notImplemented;
