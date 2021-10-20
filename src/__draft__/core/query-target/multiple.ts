import { Class } from 'type-fest';

import { ENumeration } from '../types';
import { INumerableMultiple } from './types';

export const multiple = <T>( entityType: Class<T> ): INumerableMultiple<T> => ( {
	entityType,
	numeration: ENumeration.MULTIPLE,
} );
