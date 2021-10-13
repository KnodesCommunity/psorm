import { Override } from '__draft__/utils';
import { expectTypeOf } from 'expect-type';
import { Class } from 'type-fest';

import { IQueryContext, PostProcessFn } from '../../plugins/types';
import { ToMany, ToOne } from '../../relations';
import { ENumerable } from '../numerable/types';
import { IncludeEntity, PopulationRecord, include } from './include';

const wrapGetPopulation = <TClass, TPopulation extends true | PopulationRecord>(
	_entityType: Class<TClass>,
	_include: PostProcessFn<IQueryContext<TClass, ENumerable, TClass, false>, IQueryContext<TClass, ENumerable, IncludeEntity<TClass, TPopulation>, false>>,
): TPopulation => null as any;

const wrapGetPopulated = <TClass, TPopulated>(
	_entityType: Class<TClass>,
	_include: PostProcessFn<IQueryContext<TClass, ENumerable, TClass, false>, IQueryContext<TClass, ENumerable, TPopulated, false>>,
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
		describe( 'Population', () => {
			it( 'should match correct type for ToOne', () => {
				const readQuery1 = wrapGetPopulation( TestEntityWithRelation, include( e => e.relation() ) );
				expectTypeOf( readQuery1 ).toEqualTypeOf<Readonly<{relation: true}>>();
				expectTypeOf( readQuery1 ).not.toBeAny();

				const readQuery2 = wrapGetPopulation( TestEntityWithRelation, include( e => e.relations() ) );
				expectTypeOf( readQuery2 ).toEqualTypeOf<Readonly<{relations: true}>>();
				expectTypeOf( readQuery2 ).not.toBeAny();

				const readQuery3 = wrapGetPopulation( TestEntityWithRelation, include( e => e
					.relations()
					.relation() ) );
				expectTypeOf( readQuery3 ).toEqualTypeOf<Readonly<{relation: true; relations: true}>>();
				expectTypeOf( readQuery3 ).not.toBeAny();
			} );
			it( 'should match correct type for ToOne deep', () => {
				const readQuery1 = wrapGetPopulation( TestEntityWithRelationDeep, include( e => e.relation( r => r.relation() ) ) );
				expectTypeOf( readQuery1 ).toEqualTypeOf<Readonly<{relation: Readonly<{relation: true}>}>>();
				expectTypeOf( readQuery1 ).not.toBeAny();
			} );
		} );
		describe( 'Populated', () => {
			it( 'should match correct type for single', () => {
				const readQuery1 = wrapGetPopulated( TestEntityWithRelation, include( e => e.relation() ) );
				expectTypeOf( readQuery1 ).toEqualTypeOf<Override<TestEntityWithRelation, {relation: TestEntitySimple}>>();
				expectTypeOf( readQuery1 ).not.toBeAny();

				const readQuery2 = wrapGetPopulated( TestEntityWithRelation, include( e => e.relations() ) );
				expectTypeOf( readQuery2 ).toEqualTypeOf<Override<TestEntityWithRelation, {relations: TestEntitySimple[]}>>();
				expectTypeOf( readQuery2 ).not.toBeAny();

				const readQuery3 = wrapGetPopulated( TestEntityWithRelation, include( e => e
					.relations()
					.relation() ) );
				expectTypeOf( readQuery3 ).toEqualTypeOf<Override<TestEntityWithRelation, {relation: TestEntitySimple; relations: TestEntitySimple[]}>>();
				expectTypeOf( readQuery3 ).not.toBeAny();
			} );
			it( 'should match correct type for single deep', () => {
				const readQuery1 = wrapGetPopulated( TestEntityWithRelationDeep, include( e => e.relation( r => r.relation() ) ) );
				expectTypeOf( readQuery1 ).toEqualTypeOf<Override<TestEntityWithRelationDeep, {relation: Override<TestEntityWithRelation, {relation: TestEntitySimple}>}>>();
				expectTypeOf( readQuery1 ).not.toBeAny();

				const readQuery2 = wrapGetPopulated( TestEntityWithRelationDeep, include( e => e.relations( r => r.relations() ) ) );
				expectTypeOf( readQuery2 ).toEqualTypeOf<Override<TestEntityWithRelationDeep, {relations: Array<Override<TestEntityWithRelation, {relations: TestEntitySimple[]}>>}>>();
				expectTypeOf( readQuery2 ).not.toBeAny();
			} );
		} );
	} );
} );
