import { expectTypeOf } from 'expect-type';

import { ToOne } from './relations';
import { Override } from './utils';

describe( 'Relations', () => {
	describe( 'Typecheck', () => {
		it( 'should not match populated & non populated types', () => {
			class Relational {
				public foo!: ToOne<Relational>;
			}
			expectTypeOf<Relational>().not.toMatchTypeOf<Override<Relational, {foo: Relational}>>();
			expectTypeOf<Relational>().not.toEqualTypeOf<Override<Relational, {foo: Relational}>>();
			expectTypeOf<Override<Relational, {foo: Relational}>>().not.toMatchTypeOf<Relational>();
			expectTypeOf<Override<Relational, {foo: Relational}>>().not.toEqualTypeOf<Relational>();
		} );
	} );
} );
