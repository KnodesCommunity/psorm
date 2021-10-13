import { Class } from 'type-fest';

import { ENumerable, INumerableSingle } from './types';

export const single = <T>( entityClass: Class<T> ): INumerableSingle<T> => ( {
	entity: entityClass,
	numeration: ENumerable.SINGLE,
} );
