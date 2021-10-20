import { ApiGroup } from './group';
import { Descriptor } from './types';

class Foo {}
class Bar extends Foo {}

const mockNext = () => jest.fn( ( ctx: any, n: ( a: any ) => any ) => n( ctx ) );
describe( 'ApiGroup', () => {
	describe( 'Entity matching', () => {
		it( 'should match entity', () => {
			const generator = mockNext();
			const group = new ApiGroup( {
				[`${Foo}`]: { generate: generator },
			} );
			const descriptor: Descriptor = { context: { entityClass: Foo }} as Descriptor as any;
			expect( () => group.generate( descriptor ) ).toThrowNonStandardMessage();
			expect( generator ).toHaveBeenCalledTimes( 1 );
			expect( generator ).toHaveBeenCalledWith( descriptor, expect.any( Function ) );
		} );
		it( 'should match entity with inheritance', () => {
			const generator = mockNext();
			const group = new ApiGroup( {
				[`${Foo}`]: { generate: generator },
			} );
			const descriptor: Descriptor = { context: { entityClass: Bar }} as Descriptor as any;
			expect( () => group.generate( descriptor ) ).toThrowNonStandardMessage();
			expect( generator ).toHaveBeenCalledTimes( 1 );
			expect( generator ).toHaveBeenCalledWith( { ...descriptor, context: { ...descriptor.context, entityClass: Foo }}, expect.any( Function ) );
		} );
		it( 'should match entity before inheritance (order 1)', () => {
			const generators = [ mockNext(), mockNext() ] as const;
			const group = new ApiGroup( {
				[`${Foo}`]: { generate: generators[1] },
				[`${Bar}`]: { generate: generators[0] },
			} );
			const descriptor: Descriptor = { context: { entityClass: Bar }} as Descriptor as any;
			expect( () => group.generate( descriptor ) ).toThrowNonStandardMessage();
			expect( generators[0] ).toHaveBeenCalledTimes( 1 );
			expect( generators[0] ).toHaveBeenCalledWith( descriptor, expect.any( Function ) );
			expect( generators[1] ).toHaveBeenCalledTimes( 1 );
			expect( generators[1] ).toHaveBeenCalledWith( descriptor, expect.any( Function ) );
			expect( generators[0] ).toHaveBeenCalledBefore( generators[1] );
		} );
		it( 'should match entity before inheritance (order -1)', () => {
			const generators = [ mockNext(), mockNext() ] as const;
			const group = new ApiGroup( {
				[`${Bar}`]: { generate: generators[0] },
				[`${Foo}`]: { generate: generators[1] },
			} );
			const descriptor: Descriptor = { context: { entityClass: Bar }} as Descriptor as any;
			expect( () => group.generate( descriptor ) ).toThrowNonStandardMessage();
			expect( generators[0] ).toHaveBeenCalledTimes( 1 );
			expect( generators[0] ).toHaveBeenCalledWith( descriptor, expect.any( Function ) );
			expect( generators[1] ).toHaveBeenCalledTimes( 1 );
			expect( generators[1] ).toHaveBeenCalledWith( descriptor, expect.any( Function ) );
			expect( generators[0] ).toHaveBeenCalledBefore( generators[1] );
		} );
	} );
	it( 'should call each extensions in sequence', () => {
		const fns = [ mockNext(), mockNext(), mockNext() ] as const;
		const group = new ApiGroup().using( ...fns.map( f => ( { generate: f } ) ) );
		const descriptor: Descriptor = { context: {}} as any;
		expect( () => group.generate( descriptor ) ).toThrowNonStandardMessage();
		expect( fns[0] ).toHaveBeenCalledTimes( 1 );
		expect( fns[0] ).toHaveBeenCalledWith( descriptor, expect.any( Function ) );
		expect( fns[1] ).toHaveBeenCalledTimes( 1 );
		expect( fns[1] ).toHaveBeenCalledWith( descriptor, expect.any( Function ) );
		expect( fns[2] ).toHaveBeenCalledTimes( 1 );
		expect( fns[2] ).toHaveBeenCalledWith( descriptor, expect.any( Function ) );
		expect( fns[0] ).toHaveBeenCalledBefore( fns[1] );
		expect( fns[1] ).toHaveBeenCalledBefore( fns[2] );
	} );
	it( 'should call entity handler after extensions', () => {
		const fns = [ mockNext(), mockNext() ] as const;
		const group = new ApiGroup( {
			[`${Foo}`]: { generate: fns[0] },
		} ).using( { generate: fns[1] } );
		const descriptor: Descriptor = { context: { entityClass: Foo }} as Descriptor as any;
		expect( () => group.generate( descriptor ) ).toThrowNonStandardMessage();
		expect( fns[0] ).toHaveBeenCalledTimes( 1 );
		expect( fns[0] ).toHaveBeenCalledWith( descriptor, expect.any( Function ) );
		expect( fns[1] ).toHaveBeenCalledTimes( 1 );
		expect( fns[1] ).toHaveBeenCalledWith( descriptor, expect.any( Function ) );
		expect( fns[1] ).toHaveBeenCalledBefore( fns[0] );
	} );
	it( 'should throw if no match', () => {
		const fns = [ mockNext(), mockNext() ] as const;
		const group = new ApiGroup( {
			[`${Foo}`]: { generate: fns[0] },
		} ).using( { generate: fns[1] } );
		const descriptor: Descriptor = { context: { entityClass: Foo }} as Descriptor as any;
		expect( () => group.generate( descriptor ) ).toThrowWithMessage( Error, `No suitable RequestGenerator found for ${descriptor.context.entityClass.name}` );
	} );
} );
