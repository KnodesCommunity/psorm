import { Class } from 'type-fest';

import { ENumerable, INumerableSingle } from './types';

export const single = <T>( entityType: Class<T> ): INumerableSingle<T> => ( {
	entityType,
	numeration: ENumerable.SINGLE,
} );
