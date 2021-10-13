import { ENumerable, Numerable, NumerableEntity, NumerableOutputType } from '../query-components/numerable/types';

export type PostProcessFn<TIn, TOut> = ( arg: TIn ) => TOut;
export type PostProcessFn2<TOut> = <TIn>( arg: TIn ) => TOut;

export interface IQueryContext<
	TEntity = unknown,
	TNumeration extends ENumerable = ENumerable,
	TOutput = unknown,
	TNullable = unknown> {
	readonly entityType: TEntity;
	readonly numeration: TNumeration;
	readonly nullable: TNullable;
	readonly output: TOutput;
}
export namespace IQueryContext {
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
		TNum extends ENumerable.SINGLE ?
			TNul extends true ?
				TOut | null :
				TNul extends false ? TOut :
				never :
			TNum extends ENumerable.MULTIPLE ?
				TOut[] :
				never :
		never;
}
