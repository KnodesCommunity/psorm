import { Opaque } from 'type-fest';

import { IQueryContext, PostProcessFn } from '../../plugins/types';
import { NumeredRelatedMap, RelatedType, Relation } from '../../relations';
import { OpaqueWrap, Override, notImplemented } from '../../utils';

declare const DEFAULTSym: unique symbol;
type DEFAULT = Opaque<Record<string, any>, typeof DEFAULTSym>;
const includedPropsSym = Symbol( 'included props' );
type IncludeProps<T> = OpaqueWrap<T, typeof includedPropsSym>
type IncludeChain<T, TBase = unknown> =
	& IncludeProps<Readonly<TBase>>
	& (
		T extends DEFAULT ?
			{
				[key: string]: <TSub = true>( innerGet?: IncludeProxyCb<DEFAULT, IncludeProps<TSub>> ) =>
				IncludeChain<T, TBase & {[k: string]: TSub}>;
			} :
			{
				[key in keyof T as T[key] extends Relation<any> ? key : never]: <TSub = true>( innerGet?: IncludeProxyCb<RelatedType<T[key]>, IncludeProps<TSub>> ) =>
				IncludeChain<Omit<T, key>, TBase & {[k in key]: TSub}>;
			} );
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

export const include = <T, TProps>( _getter: IncludeProxyCb<IQueryContext.GetOutput<T>, TProps> ): PostProcessFn<
	T,
	Override<T, {output: IncludeEntity<IQueryContext.GetOutput<T>, Included<TProps>>}>
> => notImplemented;

export const generateIncludeProxy = <T = DEFAULT, TProps = any>( getter: IncludeProxyCb<T, TProps> ): TProps => {
	const propsObj: any = { [includedPropsSym]: {}};
	const proxy = new Proxy( propsObj, { get: ( _target: any, prop ) => {
		if( typeof prop === 'string' ) {
			return ( innerFn?: IncludeProxyCb<any, any> ) => {
				propsObj[includedPropsSym][prop] = innerFn ? generateIncludeProxy( innerFn ) : true;
				return proxy;
			};
		} else if( prop === includedPropsSym ){
			return propsObj[includedPropsSym];
		} else {
			throw new Error( 'Not handled' );
		}
	} } );
	return ( getter( proxy ) as any )[includedPropsSym];
};
