import { IQueryContext, PostProcessFn } from '../../plugins/types';
import { NumeredRelatedMap, RelatedType, Relation } from '../../relations';
import { OpaqueWrap, Override, notImplemented } from '../../utils';

declare const sym: unique symbol;
type IncludeProps<T> = OpaqueWrap<T, typeof sym>
type IncludeChain<T, TBase = unknown> =
	& IncludeProps<Readonly<TBase>>
	& {
		[key in keyof T as T[key] extends Relation<any> ? key : never]:
		<TSub = true>( innerGet?: IncludeProxyCb<RelatedType<T[key]>, IncludeProps<TSub>> ) => IncludeChain<Omit<T, key>, TBase & {[k in key]: TSub}>
	}
export type Included<TProps> = TProps extends IncludeProps<infer TIn> ? Readonly<TIn> : never
type IncludeProxyCb<T, TProps> = ( entity: IncludeChain<T> ) => Readonly<TProps>

export type PopulationRecord = {readonly [key: string]: true | PopulationRecord};

type IncludeEntityProps<T, TPopulation extends PopulationRecord> = Override<
	T,
	{[key in ( keyof TPopulation & keyof T )]: NumeredRelatedMap<
		T[key] extends Relation<any> ? T[key] : never,
		IncludeEntity<
			RelatedType<T[key]>,
			TPopulation[key]>>}>
export type IncludeEntity<T, TPopulation extends PopulationRecord | true> =
	TPopulation extends true ? T : IncludeEntityProps<T, Exclude<TPopulation, true>>;

export const include = <T, TProps>( getter: IncludeProxyCb<IQueryContext.GetOutput<T>, TProps> ): PostProcessFn<
	T,
	Override<T, {output: IncludeEntity<IQueryContext.GetOutput<T>, Included<TProps>>}>
> => notImplemented;
