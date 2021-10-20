import { ENumeration } from '../../core/types';
import { Override, notImplemented } from '../../core/utils';
import { IQueryContext, QueryOperatorFn } from './types';

export const orFail: <T>() => QueryOperatorFn<
	T,
	IQueryContext.GetNumeration<T> extends ENumeration.SINGLE ?
		Override<T, {nullable: false}> :
		never
> = notImplemented;
