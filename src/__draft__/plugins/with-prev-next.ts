import { ENumerable } from '../query-components/numerable/types';
import { notImplemented } from '../utils';
import { IQueryContext, PostProcessFn } from './types';

export const withPrevNext: <T>() => PostProcessFn<
	T,
	T extends IQueryContext<infer TEntity, ENumerable.SINGLE, infer TOut, infer TNul> ?
		IQueryContext<
			TEntity,
			ENumerable.SINGLE,
			{current: TOut; prev?: TEntity; next?: TEntity},
			TNul> :
		never> = notImplemented;
