import { Class } from 'type-fest';

import { ENumeration } from '../types';
import { INumerableSingle } from './types';

export const single = <T>( entityType: Class<T> ): INumerableSingle<T> => ( {
	entityType,
	numeration: ENumeration.SINGLE,
} );
