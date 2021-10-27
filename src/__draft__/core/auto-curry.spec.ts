import { expectTypeOf } from 'expect-type';

import { AutoCurry, AutoCurryMultiArgs, autoCurry } from './auto-curry';

class Foo {}

describe( 'autoCurry', () => {
	describe( 'Typecheck', () => {
		describe( 'Raw types', () => {
			it( 'should match correct raw types (AutoCurryMultiArgs)', () => {
				expectTypeOf<AutoCurryMultiArgs<[string], [], Foo>>().toEqualTypeOf<( arg: string ) => Foo>();
				expectTypeOf<AutoCurryMultiArgs<[string, number], [], Foo>>()
					.toEqualTypeOf<
					& ( ( arg1: string ) => ( arg2: number ) => Foo )
					& ( ( arg1: string, arg2: number ) => Foo )>();
				expectTypeOf<AutoCurryMultiArgs<[string, number, boolean], [], Foo>>()
					.toEqualTypeOf<
					& ( ( arg1: string ) => (
						& ( ( arg2: number ) => ( arg3: boolean ) => Foo )
						& ( ( arg2: number, arg3: boolean ) => Foo ) ) )
					& ( ( arg1: string, arg2: number ) => ( arg3: boolean ) => Foo )
					& ( ( arg1: string, arg2: number, arg3: boolean ) => Foo )>();
			} );
			it( 'should match correct raw types (AutoCurry)', () => {
				expectTypeOf<AutoCurry<[string], Foo>>().toEqualTypeOf<( arg: string ) => Foo>();
				expectTypeOf<AutoCurry<[string, number], Foo>>()
					.toEqualTypeOf<
					& ( ( arg1: string ) => ( arg2: number ) => Foo )
					& ( ( arg1: string, arg2: number ) => Foo )>();
				expectTypeOf<AutoCurry<[string, number, boolean], Foo>>()
					.toEqualTypeOf<
						& ( ( arg1: string ) => (
							& ( ( arg2: number ) => ( arg3: boolean ) => Foo )
							& ( ( arg2: number, arg3: boolean ) => Foo ) ) )
						& ( ( arg1: string, arg2: number ) => ( arg3: boolean ) => Foo )
						& ( ( arg1: string, arg2: number, arg3: boolean ) => Foo )>();
			} );
		} );
		describe( 'Function', () => {
			const foo = autoCurry( ( _a: string, _b: number, _c: boolean ): Foo => new Foo() );
			it( 'should allow direct call', () => {
				expectTypeOf( foo ).toMatchTypeOf<( a: string, b: number, c: boolean ) => Foo>();
			} );
			it( 'should allow subsequent one-by-one bind calls', () => {
				expectTypeOf( foo ).toMatchTypeOf<( a: string ) => ( b: number ) => ( c: boolean ) => Foo>();
			} );
			it( 'should allow subsequent bind calls', () => {
				expectTypeOf( foo ).toMatchTypeOf<( a: string ) => ( b: number, c: boolean ) => Foo>();
				expectTypeOf( foo ).toMatchTypeOf<( a: string, b: number ) => ( c: boolean ) => Foo>();
			} );
			describe( 'Rest', () => {
				const bar = autoCurry( ( _a: string, _b: number, ..._c: boolean[] ): Foo => new Foo(), true, 2 );
				it( 'should allow direct call', () => {
					// FIXME: Untestable this way
					// expectTypeOf( bar ).not.toMatchTypeOf<( a: string, b: number ) => Foo>();
					expectTypeOf( bar ).toMatchTypeOf<( a: string, b: number, c: boolean ) => Foo>();
					expectTypeOf( bar ).toMatchTypeOf<( a: string, b: number, c: boolean, d: boolean ) => Foo>();
				} );
				it( 'should allow subsequent one-by-one bind calls', () => {
					// FIXME: Untestable this way
					// expectTypeOf( bar ).not.toMatchTypeOf<( a: string ) => ( b: number ) => () => Foo>();
					expectTypeOf( bar ).toMatchTypeOf<( a: string ) => ( b: number ) => () => Foo>();
					expectTypeOf( bar ).toMatchTypeOf<( a: string ) => ( b: number ) => ( c: boolean ) => Foo>();
					expectTypeOf( bar ).toMatchTypeOf<( a: string ) => ( b: number ) => ( c: boolean, d: boolean ) => Foo>();
				} );
				it( 'should allow subsequent bind calls', () => {
					expectTypeOf( bar ).toMatchTypeOf<( a: string ) => ( b: number, c: boolean ) => Foo>();
					expectTypeOf( bar ).toMatchTypeOf<( a: string ) => ( b: number, c: boolean, d: boolean ) => Foo>();
					expectTypeOf( bar ).toMatchTypeOf<( a: string, b: number ) => ( c: boolean ) => Foo>();
					expectTypeOf( bar ).toMatchTypeOf<( a: string, b: number ) => ( c: boolean, d: boolean ) => Foo>();
				} );
			} );
		} );
	} );
	describe( 'Behavior', () => {
		it( 'should call directly if full (2 args, 2)', () => {
			const ret = new Foo();
			const fn = jest.fn( ( _a: string, _b: number ) => ret );
			const curried = autoCurry( fn );
			expect( fn ).not.toHaveBeenCalled();
			const call1 = curried( 'foo', 42 );
			expect( call1 ).toBe( ret );
			expect( fn ).toHaveBeenCalledTimes( 1 );
			expect( fn ).toHaveBeenCalledWith( 'foo', 42 );
		} );
		it( 'should not call until full (2 args, 1 1)', () => {
			const ret = new Foo();
			const fn = jest.fn( ( _a: string, _b: number ) => ret );
			const curried = autoCurry( fn );
			expect( fn ).not.toHaveBeenCalled();
			const call1 = curried( 'foo' );
			expect( call1 ).toBeFunction();
			expect( fn ).not.toHaveBeenCalled();
			const call2 = call1( 42 );
			expect( call2 ).toBe( ret );
			expect( fn ).toHaveBeenCalledTimes( 1 );
			expect( fn ).toHaveBeenCalledWith( 'foo', 42 );
		} );
		it( 'should not call until full (3 args, 1 1 1)', () => {
			const ret = new Foo();
			const fn = jest.fn( ( _a: string, _b: number, _c: boolean ) => ret );
			const curried = autoCurry( fn );
			expect( fn ).not.toHaveBeenCalled();
			const call1 = curried( 'foo' );
			expect( call1 ).toBeFunction();
			expect( fn ).not.toHaveBeenCalled();
			const call2 = call1( 2 );
			expect( call2 ).toBeFunction();
			expect( fn ).not.toHaveBeenCalled();
			const call3 = call2( true );
			expect( call3 ).toBe( ret );
			expect( fn ).toHaveBeenCalledTimes( 1 );
			expect( fn ).toHaveBeenCalledWith( 'foo', 2, true );
		} );
		it( 'should not call until full (3 args, 2 1)', () => {
			const ret = new Foo();
			const fn = jest.fn( ( _a: string, _b: number, _c: boolean ) => ret );
			const curried = autoCurry( fn );
			expect( fn ).not.toHaveBeenCalled();
			const call1 = curried( 'foo', 42 );
			expect( call1 ).toBeFunction();
			expect( fn ).not.toHaveBeenCalled();
			const call2 = call1( true );
			expect( call2 ).toBe( ret );
			expect( fn ).toHaveBeenCalledTimes( 1 );
			expect( fn ).toHaveBeenCalledWith( 'foo', 42, true );
		} );
		it( 'should not call until full (3 args, 1 2)', () => {
			const ret = new Foo();
			const fn = jest.fn( ( _a: string, _b: number, _c: boolean ) => ret );
			const curried = autoCurry( fn );
			expect( fn ).not.toHaveBeenCalled();
			const call1 = curried( 'foo' );
			expect( call1 ).toBeFunction();
			expect( fn ).not.toHaveBeenCalled();
			const call2 = call1( 42, true );
			expect( call2 ).toBe( ret );
			expect( fn ).toHaveBeenCalledTimes( 1 );
			expect( fn ).toHaveBeenCalledWith( 'foo', 42, true );
		} );
		describe( 'Rest parameter support', () => {
			it( 'should call with rest args when there are 2', () => {
				const ret = new Foo();
				const fn = jest.fn( ( _a: string, _b: number, ..._c: boolean[] ) => ret );
				const curried = autoCurry( fn, true, 2 );
				expect( fn ).not.toHaveBeenCalled();
				const call1 = curried( 'foo' );
				expect( call1 ).toBeFunction();
				expect( fn ).not.toHaveBeenCalled();
				const call2 = call1( 2 );
				expect( call2 ).toBeFunction();
				expect( fn ).not.toHaveBeenCalled();
				const call3 = call2( true, false );
				expect( call3 ).toBe( ret );
				expect( fn ).toHaveBeenCalledTimes( 1 );
				expect( fn ).toHaveBeenCalledWith( 'foo', 2, true, false );
			} );
			it( 'should call with rest args when there are 1', () => {
				const ret = new Foo();
				const fn = jest.fn( ( _a: string, _b: number, ..._c: boolean[] ) => ret );
				const curried = autoCurry( fn, true, 2 );
				expect( fn ).not.toHaveBeenCalled();
				const call1 = curried( 'foo' );
				expect( call1 ).toBeFunction();
				expect( fn ).not.toHaveBeenCalled();
				const call2 = call1( 2 );
				expect( call2 ).toBeFunction();
				expect( fn ).not.toHaveBeenCalled();
				const call3 = call2( true );
				expect( call3 ).toBe( ret );
				expect( fn ).toHaveBeenCalledTimes( 1 );
				expect( fn ).toHaveBeenCalledWith( 'foo', 2, true );
			} );
			it( 'should call with rest args when there are 0', () => {
				const ret = new Foo();
				const fn = jest.fn( ( _a: string, _b: number, ..._c: boolean[] ) => ret );
				const curried = autoCurry( fn, true, 2 );
				expect( fn ).not.toHaveBeenCalled();
				const call1 = curried( 'foo' );
				expect( call1 ).toBeFunction();
				expect( fn ).not.toHaveBeenCalled();
				const call2 = call1( 2 );
				expect( call2 ).toBeFunction();
				expect( fn ).not.toHaveBeenCalled();
				const call3 = call2();
				expect( call3 ).toBe( ret );
				expect( fn ).toHaveBeenCalledTimes( 1 );
				expect( fn ).toHaveBeenCalledWith( 'foo', 2 );
			} );
			it( 'should still allow full call with rest args', () => {
				const ret = new Foo();
				const fn = jest.fn( ( _a: string, _b: number, ..._c: boolean[] ) => ret );
				const curried = autoCurry( fn, true, 2 );
				expect( fn ).not.toHaveBeenCalled();
				const call1 = curried( 'foo', 2, false );
				expect( call1 ).toBe( ret );
				expect( fn ).toHaveBeenCalledTimes( 1 );
				expect( fn ).toHaveBeenCalledWith( 'foo', 2, false );
			} );
		} );
	} );
} );
