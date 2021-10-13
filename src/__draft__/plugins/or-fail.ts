import { ENumerable } from '../query-components/numerable/types';
import { Override, notImplemented } from '../utils';
import { IQueryContext, PostProcessFn } from './types';

export const orFail: <T>() => PostProcessFn<
	T,
	IQueryContext.GetNumeration<T> extends ENumerable.SINGLE ?
		Override<T, {nullable: false}> :
		never
> = notImplemented;
