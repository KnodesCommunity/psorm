import { Class } from 'type-fest';

import { ENumeration } from '../../../types';
import { ConstrainedPropDecorator, OpaqueWrap, decorateUsingMetaStore } from '../../../utils';
import { relationsMetaStore } from './shared';

export const ToOne = <T>( type: () => Class<T> ): ConstrainedPropDecorator<ToOne<T>> =>
	decorateUsingMetaStore( relationsMetaStore, ( store, prop ) => {
		if( store.has( prop ) ){
			throw new Error();
		}
		store.set( prop, { type, numeration: ENumeration.SINGLE } );
		return store;
	} );

declare const ToOneSymbol: unique symbol;
export type ToOne<T = unknown> = OpaqueWrap<T, typeof ToOneSymbol>
