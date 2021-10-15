import { generateIncludeProxy } from './include';

describe( 'generateIncludeProxy', () => {
	it.each( [
		[ 'foo', () => generateIncludeProxy( a => a.foo() ), { foo: true } ],
		[ '{foo,bar}', () => generateIncludeProxy( a => a.foo().bar() ), { foo: true, bar: true } ],
		[ 'foo.bar', () => generateIncludeProxy( a => a.foo( b => b.bar() ) ), { foo: { bar: true }} ],
		[ 'foo.{bar,qux}', () => generateIncludeProxy( a => a.foo( b => b.bar().qux() ) ), { foo: { bar: true, qux: true }} ],
		[ '{foo.{bar,qux},baz}', () => generateIncludeProxy( a => a.foo( b => b.bar().qux() ).baz() ), { foo: { bar: true, qux: true }, baz: true } ],
		[ '{foo.{bar,qux},baz.baaz}', () => generateIncludeProxy( a => a.foo( b => b.bar().qux() ).baz( b => b.baaz() ) ), { foo: { bar: true, qux: true }, baz: { baaz: true }} ],
	] )( 'should generate correct output for %s', ( _label, gen, expected ) => {
		expect( gen() ).toEqual( expected );
	} );
} );
