import { OpaqueWrap } from '../core/utils';

export type Relation<T> = ToOne<T> | ToMany<T>;
export type RelatedType<T> = T extends Relation<infer TIn> ? TIn : never;
export type NumeredRelated<T extends Relation<any>> =
	T extends ToOne<infer TIn> ? TIn :
	T extends ToMany<infer TIn> ? TIn[] :
	never;
export type NumeredRelatedMap<T extends Relation<any>, TIn> =
	T extends ToOne<unknown> ? TIn :
	T extends ToMany<unknown> ? TIn[] :
	never;

declare const ToOneSymbol: unique symbol;
export type ToOne<T = unknown> = OpaqueWrap<T, typeof ToOneSymbol>
declare const ToManySymbol: unique symbol;
export type ToMany<T = unknown> = OpaqueWrap<T, typeof ToManySymbol>

export type RelationalFields<T> = {[key in keyof T as T[key] extends Relation<any> ? key : never]: T[key]}
