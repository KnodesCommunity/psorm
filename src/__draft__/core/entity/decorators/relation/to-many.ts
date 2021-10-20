import { Class } from 'type-fest';

import { ENumeration } from '../../../types';
import { ConstrainedPropDecorator, OpaqueWrap, decorateUsingMetaStore } from '../../../utils';
import { relationsMetaStore } from './shared';

export const ToMany = <T>( type: () => Class<T> ): ConstrainedPropDecorator<ToMany<T>> =>
	decorateUsingMetaStore( relationsMetaStore, ( store, prop ) => {
		if( store.has( prop ) ){
			throw new Error();
		}
		store.set( prop, { type, numeration: ENumeration.MULTIPLE } );
		return store;
	} );

declare const ToManySymbol: unique symbol;
export type ToMany<T = unknown> = OpaqueWrap<T, typeof ToManySymbol>
