import {Opaque} from 'type-fest';
export type Context = Opaque<unknown>
export interface TargetContext<T extends Context> {
    context: T
}