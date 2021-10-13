import { Context, TargetContext } from './types';

export const from = <T extends Context>(context: T): TargetContext<T> => ({
	context
})