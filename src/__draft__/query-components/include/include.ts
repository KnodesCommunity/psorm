import { RelatedType, Relation } from '../../relations';
import { notImplemented } from '../../utils';
import { IncludeQuery } from './types';

declare const sym: unique symbol;
type OpaqueWrap<T, TSym extends symbol> = {[key in TSym]: T};
type IncludeProps<T> = OpaqueWrap<T, typeof sym>
type IncludeChain<T, TBase = unknown> =
	& IncludeProps<Readonly<TBase>>
	& {
		[key in keyof T as T[key] extends Relation<any> ? key : never]:
		<TSub = true>( innerGet?: IncludeProxyCb<RelatedType<T[key]>, IncludeProps<TSub>> ) => IncludeChain<Omit<T, key>, TBase & {[k in key]: TSub}>
	}
type Included<TProps> = TProps extends IncludeProps<infer TIn> ? Readonly<TIn> : never
type IncludeProxyCb<T, TProps> = ( entity: IncludeChain<T> ) => Readonly<TProps>
export const include = <T, TProps>( getter: IncludeProxyCb<T, TProps> ): IncludeQuery<T, Included<TProps>> => notImplemented;
