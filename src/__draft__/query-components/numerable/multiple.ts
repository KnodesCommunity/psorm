import { Class } from 'type-fest';

import { ENumerable, INumerableMultiple } from './types';

export const multiple = <T>( entityClass: Class<T> ): INumerableMultiple<T> => ( {
	entity: entityClass,
	numeration: ENumerable.MULTIPLE,
} );
