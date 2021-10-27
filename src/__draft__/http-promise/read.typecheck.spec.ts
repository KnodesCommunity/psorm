import { expectTypeOf } from 'expect-type';
import { PromiseValue } from 'type-fest';

import { from, multiple, single } from '../core';
import { Override } from '../core/utils';
import { HttpPromiseContext } from './context/context';
import { include } from './plugins/include/include';
import { orFail } from './plugins/or-fail';
import { withPrevNext } from './plugins/with-prev-next/query-operator';
import { read } from './read';
import { ToMany, ToOne } from './relations';

class SimpleEntity {
	public foo!: string;
}
class RelationalEntity {
	public relation!: ToOne<SimpleEntity>
	public relations!: ToMany<SimpleEntity>
	public bar!: string;
}
class DeepRelationalEntity {
	public relation!: ToOne<RelationalEntity>
	public relation2!: ToOne<SimpleEntity>
	public relation3!: ToMany<RelationalEntity>
	public baz!: string;
}

const context = Object.assign( Object.create( HttpPromiseContext.prototype ), { dispatchDescriptor: jest.fn() } );
const fakePrevNextMiddleware = {};

describe( 'read', () => {
	describe( 'Typecheck', () => {
		describe( 'Simple query', () => {
			it( 'should match correct type for single', () => {
				const readQuery1 = read(
					single( SimpleEntity ),
					from( context ) );
				expectTypeOf( readQuery1 ).toEqualTypeOf<Promise<SimpleEntity | null>>();
				expectTypeOf( readQuery1 ).not.toBeAny();
				expectTypeOf( readQuery1 ).not.toEqualTypeOf<Promise<RelationalEntity | null>>();
			} );
			it( 'should match correct type for multiple', () => {
				const readQuery1 = read(
					multiple( SimpleEntity ),
					from( context ) );
				expectTypeOf( readQuery1 ).toEqualTypeOf<Promise<SimpleEntity[]>>();
				expectTypeOf( readQuery1 ).not.toBeAny();
				expectTypeOf( readQuery1 ).not.toEqualTypeOf<Promise<RelationalEntity | null>>();
			} );
		} );
		describe( 'Include query', () => {
			describe( 'Single', () => {
				it( 'should match correct type for single', () => {
					const readQuery1 = read(
						single( RelationalEntity ),
						from( context ),
						include( e => e.relation() ) );
					expectTypeOf( readQuery1 ).toEqualTypeOf<Promise<Override<RelationalEntity, {relation: SimpleEntity}> | null>>();
					expectTypeOf( readQuery1 ).not.toBeAny();
					type Result1 = Exclude<PromiseValue<typeof readQuery1>, null>;
					expectTypeOf<Result1['relation']>().toEqualTypeOf<SimpleEntity>();
					expectTypeOf<Result1['relations']>().not.toEqualTypeOf<SimpleEntity[]>();
					expectTypeOf<Result1>().not.toEqualTypeOf<SimpleEntity>();

					const readQuery2 = read(
						single( RelationalEntity ),
						from( context ),
						include( e => e.relations() ) );
					expectTypeOf( readQuery2 ).toEqualTypeOf<Promise<Override<RelationalEntity, {relations: SimpleEntity[]}> | null>>();
					expectTypeOf( readQuery2 ).not.toBeAny();
					type Result2 = Exclude<PromiseValue<typeof readQuery2>, null>;
					expectTypeOf<Result2['relation']>().not.toEqualTypeOf<SimpleEntity>();
					expectTypeOf<Result2['relations']>().toEqualTypeOf<SimpleEntity[]>();
					expectTypeOf<Result2>().not.toEqualTypeOf<SimpleEntity>();

					const readQuery3 = read(
						single( RelationalEntity ),
						from( context ),
						include( e => e
							.relations()
							.relation() ) );
					expectTypeOf( readQuery3 ).toEqualTypeOf<Promise<Override<RelationalEntity, {relation: SimpleEntity; relations: SimpleEntity[]}> | null>>();
					expectTypeOf( readQuery3 ).not.toBeAny();
					type Result3 = Exclude<PromiseValue<typeof readQuery3>, null>;
					expectTypeOf<Result3['relation']>().toEqualTypeOf<SimpleEntity>();
					expectTypeOf<Result3['relations']>().toEqualTypeOf<SimpleEntity[]>();
					expectTypeOf<Result3>().not.toEqualTypeOf<SimpleEntity>();
				} );
				it( 'should match correct type for single deep', () => {
					const readQuery1 = read(
						single( DeepRelationalEntity ),
						from( context ),
						include( e => e.relation( r => r.relation() ) ) );
					expectTypeOf( readQuery1 ).toEqualTypeOf<Promise<Override<DeepRelationalEntity, {relation: Override<RelationalEntity, {relation: SimpleEntity}>}> | null>>();
					expectTypeOf( readQuery1 ).not.toBeAny();
					type Result = Exclude<PromiseValue<typeof readQuery1>, null>;
					expectTypeOf<Result['relation']['relation']>().toEqualTypeOf<SimpleEntity>();
					expectTypeOf<Result['relation']['relations']>().not.toEqualTypeOf<SimpleEntity[]>();
					expectTypeOf<Result>().not.toEqualTypeOf<SimpleEntity>();
					expectTypeOf<Result>().not.toEqualTypeOf<RelationalEntity>();
				} );
				it( 'should match correct type for complex deep', () => {
					const readQuery1 = read(
						single( DeepRelationalEntity ),
						from( context ),
						include( e => e
							.relation( r => r
								.relation()
								.relations() )
							.relation2() ) );
					expectTypeOf( readQuery1 ).toEqualTypeOf<Promise<Override<DeepRelationalEntity, {relation: Override<RelationalEntity, {relation: SimpleEntity}>}> | null>>();
					expectTypeOf( readQuery1 ).not.toBeAny();
					type Result = Exclude<PromiseValue<typeof readQuery1>, null>;
					expectTypeOf<Result['relation']['relation']>().toEqualTypeOf<SimpleEntity>();
					expectTypeOf<Result['relation']['relations']>().toEqualTypeOf<SimpleEntity[]>();
					expectTypeOf<Result['relation2']>().toEqualTypeOf<SimpleEntity>();
					expectTypeOf<Result>().not.toEqualTypeOf<SimpleEntity>();
					expectTypeOf<Result>().not.toEqualTypeOf<RelationalEntity>();
				} );
			} );
		} );
		describe( 'Plugins', () => {
			describe( 'withPrevNext', () => {
				describe( 'single', () => {
					it( 'simple', () => {
						const readQuery = read( single( SimpleEntity ), from( context ), withPrevNext( fakePrevNextMiddleware )() );
						expectTypeOf( readQuery ).toEqualTypeOf<Promise<{current: SimpleEntity; prev: SimpleEntity | null; next: SimpleEntity | null} | null>>();
						expectTypeOf( readQuery ).not.toBeAny();
					} );
					it( 'With population from main query', () => {
						const readQuery = read(
							single( RelationalEntity ),
							from( context ),
							include( e => e.relation() ),
							withPrevNext( fakePrevNextMiddleware )() );
						expectTypeOf( readQuery ).toEqualTypeOf<Promise<{
							current: Override<RelationalEntity, {relation: SimpleEntity}>;
							prev: RelationalEntity | null;
							next: RelationalEntity | null;
						} | null>>();
						expectTypeOf( readQuery ).not.toEqualTypeOf<Promise<{current: RelationalEntity; prev?: RelationalEntity; next?: RelationalEntity} | null>>();
						expectTypeOf( readQuery ).not.toBeAny();
					} );
					it( 'With transforms from withPrevNext', () => {
						const readQuery = read(
							single( RelationalEntity ),
							from( context ),
							withPrevNext(
								{},
								include( e => e.relation() ),
								orFail(),
							) );
						expectTypeOf( readQuery ).toEqualTypeOf<Promise<{
							current: RelationalEntity;
							prev: Override<RelationalEntity, {relation: SimpleEntity}>;
							next: Override<RelationalEntity, {relation: SimpleEntity}>;
						} | null>>();
						expectTypeOf( readQuery ).not.toEqualTypeOf<Promise<{current: RelationalEntity; prev: RelationalEntity | null; next: RelationalEntity | null} | null>>();
						expectTypeOf( readQuery ).not.toBeAny();
					} );
				} );
				describe( 'multiple', () => {
					it( 'should not be allowed', () => {
						const readQuery = read( multiple( SimpleEntity ), from( context ), withPrevNext( fakePrevNextMiddleware ) );
						expectTypeOf( readQuery ).toEqualTypeOf<Promise<never>>();
						expectTypeOf( readQuery ).not.toBeAny();
					} );
				} );
			} );
			describe( 'orFail', () => {
				describe( 'single', () => {
					it( 'simple', () => {
						const readQuery = read( single( SimpleEntity ), from( context ), orFail() );
						expectTypeOf( readQuery ).toEqualTypeOf<Promise<SimpleEntity>>();
						expectTypeOf( readQuery ).not.toBeAny();
					} );
				} );
				describe( 'multiple', () => {
					it( 'should not be allowed', () => {
						const readQuery = read( multiple( SimpleEntity ), from( context ), orFail() );
						expectTypeOf( readQuery ).toEqualTypeOf<Promise<never>>();
						expectTypeOf( readQuery ).not.toBeAny();
					} );
				} );
			} );
			describe( 'withPrevNext & orFail', () => {
				describe( 'single', () => {
					it( 'simple', () => {
						const readQuery1 = read( single( SimpleEntity ), from( context ), withPrevNext( fakePrevNextMiddleware )(), orFail() );
						expectTypeOf( readQuery1 ).toEqualTypeOf<Promise<{current: SimpleEntity; prev: SimpleEntity | null; next: SimpleEntity | null}>>();
						expectTypeOf( readQuery1 ).not.toBeAny();

						const readQuery2 = read( single( SimpleEntity ), from( context ), orFail(), withPrevNext( fakePrevNextMiddleware )() );
						expectTypeOf( readQuery2 ).toEqualTypeOf<Promise<{current: SimpleEntity; prev: SimpleEntity | null; next: SimpleEntity | null}>>();
						expectTypeOf( readQuery2 ).not.toBeAny();
					} );
				} );
			} );
		} );
	} );
} );
