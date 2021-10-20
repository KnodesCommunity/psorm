import { Class } from 'type-fest';

import { ENumeration } from '../types';

interface INumerableBase<T> {
	entityType: Class<T>;
	numeration: ENumeration;
}
export interface INumerableSingle<T> extends INumerableBase<T> {
	numeration: ENumeration.SINGLE;
}
export interface INumerableMultiple<T> extends INumerableBase<T> {
	numeration: ENumeration.MULTIPLE;
}
export type Numerable<T> = INumerableSingle<T> | INumerableMultiple<T>;
export type NumerableEntity<T extends INumerableBase<any>> = T extends INumerableBase<infer TIn> ? TIn : never
export type NumerableOutputType<T extends INumerableBase<any>> =
	T extends INumerableSingle<infer TEntity> ? TEntity :
	T extends INumerableMultiple<infer TEntity> ? TEntity :
	never;
