import { Descriptor, IRequestGenerator, RequestGeneratorNextFn, RequestGeneratorRet } from './types';
import { extractUrl } from './utils';

class ApiRootMiddleware implements IRequestGenerator {
	public constructor( private readonly _url: string | URL ){}
	/**
	 * @param desc
	 * @param callNext
	 */
	public generate( desc: Descriptor, callNext: RequestGeneratorNextFn ): RequestGeneratorRet {
		return callNext( {
			...desc,
			url: {
				...desc.url,
				...extractUrl( new URL( this._url ) ),
			},
		} );
	}
}

export const apiRoot = ( url: string | URL ): IRequestGenerator => new ApiRootMiddleware( url );
