import { Class } from 'type-fest';

import { ENumerable, INumerableMultiple } from './types';

export const multiple = <T>( entityType: Class<T> ): INumerableMultiple<T> => ( {
	entityType,
	numeration: ENumerable.MULTIPLE,
} );
