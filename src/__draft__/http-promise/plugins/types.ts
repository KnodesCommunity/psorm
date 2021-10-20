import { Class } from 'type-fest';

import { Numerable, NumerableEntity, NumerableOutputType } from '../../core/query-target/types';
import { ENumeration } from '../../core/types';

export type QueryOperatorFn<TIn, TOut> = ( arg: TIn ) => TOut;

declare const entityTypeSym: unique symbol;
export interface IQueryContext<
	TEntity = unknown,
	TNumeration extends ENumeration = ENumeration,
	TOutput = unknown,
	TNullable = unknown> {
	readonly [entityTypeSym]?: TEntity;
	readonly entityClass: Class<TEntity>;
	readonly numeration: TNumeration;
	readonly nullable: TNullable;
	readonly output: TOutput;
	readonly filter?: IQueryContext.Filter;
	readonly options?: IQueryContext.Options;
}
export namespace IQueryContext {
	export type Filter = unknown;
	export type Options = {limit?: number; skip?: number};

	export type FromNumeration<T extends Numerable<any>> = IQueryContext<
		NumerableEntity<T>,
		T['numeration'],
		NumerableOutputType<T>,
		true>;

	export type GetEntityType<T> = T extends IQueryContext<infer TEntity> ? TEntity : never;
	export type GetNumeration<T> = T extends IQueryContext<any, infer TNum> ? TNum : never;
	export type GetOutput<T> = T extends IQueryContext<any, any, infer TOut> ? TOut : never;
	export type GetNullable<T> = T extends IQueryContext<any, any, any, infer TNullable> ? TNullable : never;

	export type ToOutput<T> = T extends IQueryContext<any, infer TNum, infer TOut, infer TNul> ?
		TNum extends ENumeration.SINGLE ?
			TNul extends true ?
				TOut | null :
				TNul extends false ? TOut :
				never :
			TNum extends ENumeration.MULTIPLE ?
				TOut[] :
				never :
		never;
}
