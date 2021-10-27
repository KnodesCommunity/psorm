import { getProtoChain } from './utils';

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
