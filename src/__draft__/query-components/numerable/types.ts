import {Class} from 'type-fest';

export const enum ENumerable {
    SINGLE,
    MULTIPLE
}
interface INumerableBase<T> {
    entity: Class<T>
    numeration: ENumerable
}
export interface INumerableSingle<T> extends INumerableBase<T> {
    numeration: ENumerable.SINGLE
}
export interface INumerableMultiple<T> extends INumerableBase<T> {
    numeration: ENumerable.SINGLE
}
export type Numerable<T> = INumerableSingle<T> | INumerableMultiple<T>;
export type NumerableEntity<T extends INumerableBase<any>> = T extends INumerableBase<infer TIn> ? TIn : never
export type NumerableOutputType<T extends INumerableBase<any>> =
    T extends INumerableSingle<infer TEntity> ? TEntity | null :
    T extends INumerableMultiple<infer TEntity> ? TEntity :
    never;