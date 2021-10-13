import { expectTypeOf } from 'expect-type';
import { PromiseValue } from 'type-fest';

import { orFail } from './plugins/or-fail';
import { withPrevNext } from './plugins/with-prev-next';

import { include } from './query-components/include/include';
import { multiple } from './query-components/numerable/multiple';
import { single } from './query-components/numerable/single';
import { from } from './query-components/source/from';
import { Context } from './query-components/source/types';
import { read } from './read';
import { ToMany, ToOne } from './relations';

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

const context = {} as Context;

describe( 'read', () => {
	describe( 'Typecheck', () => {
		describe( 'Simple query', () => {
			it( 'should match correct type for single', () => {
				const readQuery1 = read(
					single( TestEntitySimple ),
					from( context ) );
				expectTypeOf( readQuery1 ).toEqualTypeOf<Promise<TestEntitySimple | null>>();
				expectTypeOf( readQuery1 ).not.toBeAny();
			} );
			it( 'should match correct type for multiple', () => {
				const readQuery1 = read(
					multiple( TestEntitySimple ),
					from( context ) );
				expectTypeOf( readQuery1 ).toEqualTypeOf<Promise<TestEntitySimple[]>>();
				expectTypeOf( readQuery1 ).not.toBeAny();
			} );
		} );
		describe( 'Include query', () => {
			describe( 'Single', () => {
				it( 'should match correct type for single', () => {
					const readQuery1 = read(
						single( TestEntityWithRelation ),
						from( context ),
						include( e => e.relation() ) );
					expectTypeOf( readQuery1 ).toEqualTypeOf<Promise<( TestEntityWithRelation & {relation: TestEntitySimple} ) | null>>();
					expectTypeOf( readQuery1 ).not.toBeAny();
					type Result1 = Exclude<PromiseValue<typeof readQuery1>, null>;
					expectTypeOf<Result1['relation']>().toEqualTypeOf<TestEntitySimple>();
					expectTypeOf<Result1['relations']>().not.toEqualTypeOf<TestEntitySimple[]>();

					const readQuery2 = read(
						single( TestEntityWithRelation ),
						from( context ),
						include( e => e.relations() ) );
					expectTypeOf( readQuery2 ).toEqualTypeOf<Promise<( TestEntityWithRelation & {relations: TestEntitySimple[]} ) | null>>();
					expectTypeOf( readQuery2 ).not.toBeAny();
					type Result2 = Exclude<PromiseValue<typeof readQuery2>, null>;
					expectTypeOf<Result2['relation']>().not.toEqualTypeOf<TestEntitySimple>();
					expectTypeOf<Result2['relations']>().toEqualTypeOf<TestEntitySimple[]>();

					const readQuery3 = read(
						single( TestEntityWithRelation ),
						from( context ),
						include( e => e
							.relations()
							.relation() ) );
					expectTypeOf( readQuery3 ).toEqualTypeOf<Promise<( TestEntityWithRelation & {relation: TestEntitySimple; relations: TestEntitySimple[]} ) | null>>();
					expectTypeOf( readQuery3 ).not.toBeAny();
					type Result3 = Exclude<PromiseValue<typeof readQuery3>, null>;
					expectTypeOf<Result3['relation']>().toEqualTypeOf<TestEntitySimple>();
					expectTypeOf<Result3['relations']>().toEqualTypeOf<TestEntitySimple[]>();
				} );
				it( 'should match correct type for single deep', () => {
					const readQuery1 = read(
						single( TestEntityWithRelationDeep ),
						from( context ),
						include( e => e.relation( r => r.relation() ) ) );
					expectTypeOf( readQuery1 ).toEqualTypeOf<Promise<( TestEntityWithRelationDeep & {relation: TestEntityWithRelation & {relation: TestEntitySimple}} ) | null>>();
					expectTypeOf( readQuery1 ).not.toBeAny();
					type Result = Exclude<PromiseValue<typeof readQuery1>, null>;
					expectTypeOf<Result['relation']['relation']>().toEqualTypeOf<TestEntitySimple>();
					expectTypeOf<Result['relation']['relations']>().not.toEqualTypeOf<TestEntitySimple[]>();
				} );
			} );
		} );
		describe( 'Plugins', () => {
			describe( 'withPrevNext', () => {
				describe( 'single', () => {
					it( 'simple', () => {
						const readQuery = read( single( TestEntitySimple ), from( context ), withPrevNext() );
						expectTypeOf( readQuery ).toEqualTypeOf<Promise<{current: TestEntitySimple; prev?: TestEntitySimple; next?: TestEntitySimple} | null>>();
						expectTypeOf( readQuery ).not.toBeAny();
					} );
					it.todo( 'With population from main query' );
					it.todo( 'With population from withPrevNext' );
				} );
			} );
			describe( 'multiple', () => {
				it( 'should not be allowed', () => {
					const readQuery = read( multiple( TestEntitySimple ), from( context ), withPrevNext() );
					expectTypeOf( readQuery ).toEqualTypeOf<Promise<never>>();
					expectTypeOf( readQuery ).not.toBeAny();
				} );
			} );
			describe( 'orFail', () => {
				describe( 'single', () => {
					it( 'simple', () => {
						const readQuery = read( single( TestEntitySimple ), from( context ), orFail() );
						expectTypeOf( readQuery ).toEqualTypeOf<Promise<TestEntitySimple>>();
						expectTypeOf( readQuery ).not.toBeAny();
					} );
				} );
			} );
			describe( 'multiple', () => {
				it( 'should not be allowed', () => {
					const readQuery = read( multiple( TestEntitySimple ), from( context ), orFail() );
					expectTypeOf( readQuery ).toEqualTypeOf<Promise<never>>();
					expectTypeOf( readQuery ).not.toBeAny();
				} );
			} );
			describe( 'withPrevNext & orFail', () => {
				it( 'simple', () => {
					const readQuery1 = read( single( TestEntitySimple ), from( context ), withPrevNext(), orFail() );
					expectTypeOf( readQuery1 ).toEqualTypeOf<Promise<{current: TestEntitySimple; prev?: TestEntitySimple; next?: TestEntitySimple}>>();
					expectTypeOf( readQuery1 ).not.toBeAny();

					const readQuery2 = read( single( TestEntitySimple ), from( context ), orFail(), withPrevNext() );
					expectTypeOf( readQuery2 ).toEqualTypeOf<Promise<{current: TestEntitySimple; prev?: TestEntitySimple; next?: TestEntitySimple}>>();
					expectTypeOf( readQuery2 ).not.toBeAny();
				} );
			} );
		} );
	} );
} );
