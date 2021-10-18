import { ENumerable } from '../query-components/numerable/types';
import { Override, notImplemented } from '../utils';
import { IQueryContext, QueryOperatorFn } from './types';

export const orFail: <T>() => QueryOperatorFn<
	T,
	IQueryContext.GetNumeration<T> extends ENumerable.SINGLE ?
		Override<T, {nullable: false}> :
		never
> = notImplemented;
