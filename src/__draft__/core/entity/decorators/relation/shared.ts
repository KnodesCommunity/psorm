import { Class } from 'type-fest';

import { ENumeration } from '../../../types';
import { metaStoreFactory } from '../../../utils';

const RELATIONS = Symbol( 'relations' );
export const relationsMetaStore = metaStoreFactory(
	RELATIONS,
	() => new Map<string | symbol, {type: () => Class<any>; numeration: ENumeration}>() );
