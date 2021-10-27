// import { ENumeration } from '../../../../core/types';
// import { prevNextMetaStore } from '../query-operator';
// import { withPrevNextMiddlewareSplitQueries } from './split-query';

// describe( 'WithPrevNextMiddlewareSplitQueries', () => {
// 	describe( 'Simple usage', () => {
// 		it( 'should actually request a paginated data (first entry)', async () => {
// 			const middleware = withPrevNextMiddlewareSplitQueries();
// 			const mockHttpContext = {};
// 			const queryContext = { context: mockHttpContext, meta: new Map() };
// 			prevNextMetaStore( queryContext as any ).set( {} );
// 			const nextRet = { request: {}, postHooks: [] };
// 			const next = jest.fn().mockReturnValue( nextRet );
// 			const out = middleware.generate( { context: queryContext as any }, next );
// 			expect( out ).toBeTruthy();
// 			expect( next ).toHaveBeenCalledTimes( 1 );
// 			expect( next ).toHaveBeenCalledWith( {
// 				context: {
// 					...queryContext,
// 					numeration: ENumeration.MULTIPLE,
// 					options: {
// 						limit: 2,
// 						skip: 0,
// 					},
// 				},
// 			} );
// 			expect( out.postHooks ).toHaveLength( 1 );
// 			const entities = [ { $id: 1 }, { $id: 2 } ] as const;
// 			await expect( ( out.postHooks![0] as any )( entities ) ).resolves.toEqual( {
// 				prev: undefined,
// 				current: entities[0],
// 				next: entities[1],
// 			} );
// 		} );
// 		it( 'should actually request a paginated data (non first entry)', async () => {
// 			const middleware = withPrevNextMiddlewareSplitQueries();
// 			const mockHttpContext = {};
// 			const queryContext = { context: mockHttpContext, options: { skip: 2 }, meta: new Map() };
// 			prevNextMetaStore( queryContext as any ).set( {} );
// 			const nextRet = { request: {}, postHooks: [] };
// 			const next = jest.fn().mockReturnValue( nextRet );
// 			const out = middleware.generate( { context: queryContext as any }, next );
// 			expect( out ).toBeTruthy();
// 			expect( next ).toHaveBeenCalledTimes( 1 );
// 			expect( next ).toHaveBeenCalledWith( {
// 				context: {
// 					...queryContext,
// 					numeration: ENumeration.MULTIPLE,
// 					options: {
// 						limit: 3,
// 						skip: 1,
// 					},
// 				},
// 			} );
// 			expect( out.postHooks ).toHaveLength( 1 );
// 			const entities = [ { $id: 1 }, { $id: 2 } ] as const;
// 			await expect( ( out.postHooks![0] as any )( entities ) ).resolves.toEqual( {
// 				prev: entities[0],
// 				current: entities[1],
// 				next: undefined,
// 			} );
// 		} );
// 	} );
// } );
