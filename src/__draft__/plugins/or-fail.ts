import { ENumerable } from '../query-components/numerable/types';
import { notImplemented } from '../utils';
import { IQueryContext, PostProcessFn } from './types';

export const orFail: <T>() => PostProcessFn<
	T,
	T extends IQueryContext<infer TEntity, ENumerable.SINGLE, infer TOut> ?
		IQueryContext<
			TEntity,
			ENumerable.SINGLE,
			TOut,
			false> :
		never> = notImplemented;
