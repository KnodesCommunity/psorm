import { Class } from 'type-fest';

import { ENumeration } from '../../../types';
import { classMetaStoreFactory } from '../../../utils';

const RELATIONS = Symbol( 'relations' );
export const relationsMetaStore = classMetaStoreFactory(
	RELATIONS,
	() => new Map<string | symbol, {type: () => Class<any>; numeration: ENumeration}>() );
