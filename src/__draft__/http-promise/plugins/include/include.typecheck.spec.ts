import { expectTypeOf } from 'expect-type';
import { Class } from 'type-fest';

import { ENumeration } from '../../../core/types';
import { Override } from '../../../core/utils';
import { ToMany, ToOne } from '../../relations';
import { IQueryContext, QueryOperatorFn } from '../types';
import { IncludeEntity, IncludeRecord, include } from './include';

const wrapGetIncludes = <TClass, TPopulation extends true | IncludeRecord>(
	_entityType: Class<TClass>,
	_include: QueryOperatorFn<IQueryContext<TClass, ENumeration, TClass, false>, IQueryContext<TClass, ENumeration, IncludeEntity<TClass, TPopulation>, false>>,
): TPopulation => null as any;

const wrapGetIncluded = <TClass, TPopulated>(
	_entityType: Class<TClass>,
	_include: QueryOperatorFn<IQueryContext<TClass, ENumeration, TClass, false>, IQueryContext<TClass, ENumeration, TPopulated, false>>,
): TPopulated => null as any;


class TestEntitySimple {
	public foo!: string;
}
class TestEntityWithRelation {
	public relation!: ToOne<TestEntitySimple>
	public relations!: ToMany<TestEntitySimple>
}
class TestEntityWithRelationDeep {
	public relation!: ToOne<TestEntityWithRelation>
	public relations!: ToMany<TestEntityWithRelation>
}

describe( 'include', () => {
	describe( 'Typecheck', () => {
		describe( 'Includes', () => {
			it( 'should match correct type for ToOne', () => {
				const readQuery1 = wrapGetIncludes( TestEntityWithRelation, include( e => e.relation() ) );
				expectTypeOf( readQuery1 ).toEqualTypeOf<Readonly<{relation: true}>>();
				expectTypeOf( readQuery1 ).not.toBeAny();

				const readQuery2 = wrapGetIncludes( TestEntityWithRelation, include( e => e.relations() ) );
				expectTypeOf( readQuery2 ).toEqualTypeOf<Readonly<{relations: true}>>();
				expectTypeOf( readQuery2 ).not.toBeAny();

				const readQuery3 = wrapGetIncludes( TestEntityWithRelation, include( e => e
					.relations()
					.relation() ) );
				expectTypeOf( readQuery3 ).toEqualTypeOf<Readonly<{relation: true; relations: true}>>();
				expectTypeOf( readQuery3 ).not.toBeAny();
			} );
			it( 'should match correct type for ToOne deep', () => {
				const readQuery1 = wrapGetIncludes( TestEntityWithRelationDeep, include( e => e.relation( r => r.relation() ) ) );
				expectTypeOf( readQuery1 ).toEqualTypeOf<Readonly<{relation: Readonly<{relation: true}>}>>();
				expectTypeOf( readQuery1 ).not.toBeAny();
			} );
		} );
		describe( 'Included', () => {
			it( 'should match correct type for single', () => {
				const readQuery1 = wrapGetIncluded( TestEntityWithRelation, include( e => e.relation() ) );
				expectTypeOf( readQuery1 ).toEqualTypeOf<Override<TestEntityWithRelation, {relation: TestEntitySimple}>>();
				expectTypeOf( readQuery1 ).not.toBeAny();

				const readQuery2 = wrapGetIncluded( TestEntityWithRelation, include( e => e.relations() ) );
				expectTypeOf( readQuery2 ).toEqualTypeOf<Override<TestEntityWithRelation, {relations: TestEntitySimple[]}>>();
				expectTypeOf( readQuery2 ).not.toBeAny();

				const readQuery3 = wrapGetIncluded( TestEntityWithRelation, include( e => e
					.relations()
					.relation() ) );
				expectTypeOf( readQuery3 ).toEqualTypeOf<Override<TestEntityWithRelation, {relation: TestEntitySimple; relations: TestEntitySimple[]}>>();
				expectTypeOf( readQuery3 ).not.toBeAny();
			} );
			it( 'should match correct type for single deep', () => {
				const readQuery1 = wrapGetIncluded( TestEntityWithRelationDeep, include( e => e.relation( r => r.relation() ) ) );
				expectTypeOf( readQuery1 ).toEqualTypeOf<Override<TestEntityWithRelationDeep, {relation: Override<TestEntityWithRelation, {relation: TestEntitySimple}>}>>();
				expectTypeOf( readQuery1 ).not.toBeAny();

				const readQuery2 = wrapGetIncluded( TestEntityWithRelationDeep, include( e => e.relations( r => r.relations() ) ) );
				expectTypeOf( readQuery2 ).toEqualTypeOf<Override<TestEntityWithRelationDeep, {relations: Array<Override<TestEntityWithRelation, {relations: TestEntitySimple[]}>>}>>();
				expectTypeOf( readQuery2 ).not.toBeAny();
			} );
		} );
	} );
} );
