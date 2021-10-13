import { expectTypeOf } from 'expect-type';
import { Class } from 'type-fest';

import { ToMany, ToOne } from '../../relations';
import { include } from './include';
import { IncludeQuery } from './types';

const wrap = <TClass, TPopulation>(
	_entityType: Class<TClass>,
	_include: IncludeQuery<TClass, TPopulation>,
): TPopulation => null as any;


class TestEntitySimple {
	public foo!: string;
}
class TestEntityWithRelation {
	public relation!: ToOne<TestEntitySimple>
	public relations!: ToMany<TestEntitySimple>
}
class TestEntityWithRelationDeep {
	public relation!: ToOne<TestEntityWithRelation>
}

describe( 'include', () => {
	describe( 'Typecheck', () => {
		it( 'should match correct type for single', () => {
			const readQuery1 = wrap( TestEntityWithRelation, include( e => e.relation() ) );
			expectTypeOf( readQuery1 ).toEqualTypeOf<Readonly<{relation: true}>>();
			expectTypeOf( readQuery1 ).not.toBeAny();

			const readQuery2 = wrap( TestEntityWithRelation, include( e => e.relations() ) );
			expectTypeOf( readQuery2 ).toEqualTypeOf<Readonly<{relations: true}>>();
			expectTypeOf( readQuery2 ).not.toBeAny();

			const readQuery3 = wrap( TestEntityWithRelation, include( e => e
				.relations()
				.relation() ) );
			expectTypeOf( readQuery3 ).toEqualTypeOf<Readonly<{relation: true; relations: true}>>();
			expectTypeOf( readQuery3 ).not.toBeAny();
		} );
		it( 'should match correct type for single deep', () => {
			const readQuery1 = wrap( TestEntityWithRelationDeep, include( e => e.relation( r => r.relation() ) ) );
			expectTypeOf( readQuery1 ).toEqualTypeOf<Readonly<{relation: Readonly<{relation: true}>}>>();
			expectTypeOf( readQuery1 ).not.toBeAny();
		} );
	} );
} );
