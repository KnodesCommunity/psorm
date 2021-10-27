export interface IQueryOperatorMeta {
	readonly unused: Array<string | symbol>;

	add( key: string | symbol, config: {needsQueryExecutor?: boolean; shared?: boolean}, value: any ): Readonly<IQueryOperatorMeta>;
}
export interface IQuery
