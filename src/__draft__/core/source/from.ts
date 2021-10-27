import { TargetContext } from './types';

export const from = <T>( context: T ): TargetContext<T> => ( {
	context,
} );
