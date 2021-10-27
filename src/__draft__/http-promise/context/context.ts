import { IQueryContext } from '../plugins/types';
import { Descriptor, IRequestGenerator } from './api/types';
import { exhaustApiMatching } from './api/utils';

export class HttpPromiseContext {
	private readonly _api: IRequestGenerator;
	private readonly _window: Pick<typeof window, 'fetch'>;
	public constructor( { api, win }: {
		api: IRequestGenerator;
		win?: Pick<typeof window, 'fetch'>;
	} ) {
		this._api = api;
		this._window = win ?? window;
	}

	/**
	 * @param query
	 */
	public async runQuery( query: IQueryContext ): Promise<unknown> {
		return this.dispatchDescriptor( { context: query } );
	}
	/**
	 * @param query
	 * @param desc
	 */
	public async dispatchDescriptor( desc: Descriptor ): Promise<unknown> {
		const { postHooks, request } = this._api.generate( desc, exhaustApiMatching( desc ) );
		const output = await this._window.fetch( request );
		const json = await output.json();
		return ( ( postHooks ?? [] ).concat( desc.context.mappers ) ).reduce( ( acc, hook ) => hook( acc ), json );
	}
}
