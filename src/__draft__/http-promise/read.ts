// type TemplateStrignsArrayOf<T extends ReadonlyArray<string>> = TemplateStringsArray & T & {raw: T};
// export const read = <T>(
//     strings: TemplateStrignsArrayOf<readonly ['single ', ' from ', ' where ']>,
//     entity: Type<T>,
//     context: unknown,
//     query: any
// ): Promise<T | null> => Promise.resolve(null);

import { Numerable, TargetContext } from '../core';
import { HttpPromiseContext } from './context/context';
import { IQueryContext, QueryOperatorFn } from './plugins/types';
import { QueryOperatorsChain } from './plugins/using';

export const read: {
	<TNumeration extends Numerable<any>>(
		output: TNumeration,
		targetContext: TargetContext<HttpPromiseContext>,
	): Promise<IQueryContext.ToOutput<IQueryContext.FromNumeration<TNumeration>>>;
	<TNumeration extends Numerable<any>, TOut>(
		output: TNumeration,
		targetContext: TargetContext<HttpPromiseContext>,
		...transforms: QueryOperatorsChain<[IQueryContext.FromNumeration<TNumeration>, TOut]>
	): Promise<IQueryContext.ToOutput<TOut>>;
	<TNumeration extends Numerable<any>, T1, TOut>(
		output: TNumeration,
		targetContext: TargetContext<HttpPromiseContext>,
		...transforms: QueryOperatorsChain<[IQueryContext.FromNumeration<TNumeration>, T1, TOut]>
	): Promise<IQueryContext.ToOutput<TOut>>;
	<TNumeration extends Numerable<any>, T1, T2, TOut>(
		output: TNumeration,
		targetContext: TargetContext<HttpPromiseContext>,
		...transforms: QueryOperatorsChain<[IQueryContext.FromNumeration<TNumeration>, T1, T2, TOut]>
	): Promise<IQueryContext.ToOutput<TOut>>;
	<TContext extends IQueryContext>(
		queryContext: TContext,
	): Promise<IQueryContext.ToOutput<TContext>>;
} = ( ...args:
| [output: Numerable<any>, targetContext: TargetContext<HttpPromiseContext>, ...transforms: Array<QueryOperatorFn<IQueryContext.Any, IQueryContext.Any>>]
| [queryContext: IQueryContext]
) => {
	const queryCtx = validateContext( buildContext( ...args ) );
	return queryCtx.context
		.dispatchDescriptor( {
			context: queryCtx,
			request: {
				method: 'GET',
			},
		} ) as Promise<any>;
};

const validateContext = ( ctx: IQueryContext ): IQueryContext & TargetContext<HttpPromiseContext> => {
	if( !( ctx.context instanceof HttpPromiseContext ) ){
		throw new TypeError( 'Invalid context' );
	}
	return ctx as any;
};

const buildContext = ( ...args:
| [output: Numerable<any>, targetContext: TargetContext<HttpPromiseContext>, ...transforms: Array<QueryOperatorFn<IQueryContext.Any, IQueryContext.Any>>]
| [queryContext: IQueryContext.Any]
): IQueryContext => {
	if( args.length === 1 ) {
		const [ queryContext ] = args as [queryContext: IQueryContext.Any];
		return queryContext;
	} else if( args.length >= 2 ) {
		const [ output, targetContext, ...transforms ] = args as
			[output: Numerable<any>, targetContext: TargetContext<HttpPromiseContext>, ...transforms: Array<QueryOperatorFn<IQueryContext.Any, IQueryContext.Any>>];
		return transforms
			.reduce(
				( ctx, t ) => t( ctx ),
				{ ...output, ...targetContext, entityClass: output.entityType, nullable: true, output: {} as any, mappers: [] } as IQueryContext );
	} else {
		throw new Error( 'Invalid read command' );
	}
};
