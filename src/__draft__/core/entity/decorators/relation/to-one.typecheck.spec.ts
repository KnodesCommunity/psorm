import { ToOne } from './to-one';

class Hello {}

describe( 'ToOne', () => {
	describe( 'Typecheck', () => {
		it( 'should not allow non "ToOne" type', () => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			class Foo {
				// @ts-expect-error -- Test
				@ToOne( () => Hello ) public theHello!: Hello;
			}
		} );
		it( 'should allow "ToOne" type', () => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			class Foo {
				@ToOne( () => Hello ) public theHello!: ToOne<Hello>;
			}
		} );
	} );
} );
