import { expectTypeOf } from 'expect-type';

import { AutoCurry, AutoCurryMultiArgs, autoCurry, getProtoChain } from './utils';

class Foo {}
class Bar extends Foo {}

describe( 'getProtoChain', () => {
	it( 'should return class itself', () => {
		expect( getProtoChain( Foo ) ).toEqual( [ Foo ] );
	} );
	it( 'should return class itself them the parent', () => {
		expect( getProtoChain( Bar ) ).toEqual( [ Bar, Foo ] );
	} );
} );

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
			const fn = jest.fn( ( _a: string, _b: number, _c: boolean) => ret );
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
			const fn = jest.fn( ( _a: string, _b: number, _c: boolean) => ret );
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
			const fn = jest.fn( ( _a: string, _b: number, _c: boolean) => ret );
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
	} );
} );
