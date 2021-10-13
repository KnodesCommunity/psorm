import { ENumerable } from '../query-components/numerable/types';
import { Override, notImplemented } from '../utils';
import { IQueryContext, PostProcessFn } from './types';

export const withPrevNext: <T>() => IQueryContext.GetNumeration<T> extends ENumerable.SINGLE ?
	PostProcessFn<
		T,
		Override<T, {output: {current: IQueryContext.GetOutput<T>; prev?: IQueryContext.GetEntityType<T>; next?: IQueryContext.GetEntityType<T>}}>
	> : never = notImplemented;
