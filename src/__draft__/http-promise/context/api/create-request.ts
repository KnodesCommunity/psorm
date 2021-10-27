import { Descriptor, IRequestGenerator, RequestGeneratorRet } from './types';
import { RequestWindowPick, assignUrl } from './utils';

class CreateRequestMiddleware implements IRequestGenerator {
	public constructor( private readonly _win: RequestWindowPick ){}
	/**
	 * @param desc
	 * @param callNext
	 */
	public generate( desc: Descriptor ): RequestGeneratorRet {
		const { Request, URLSearchParams, URL, location } = this._win;
		const { params, url, request } = desc;
		const paramsInstance = new URLSearchParams( params );
		const paramsToString = paramsInstance.toString();
		const urlInstance = assignUrl( { Request, URLSearchParams, URL, location }, { ...url, search: paramsToString ? `?${paramsToString}` : '' } );
		const requestInstance = new Request( urlInstance.toString(), request );
		return { request: requestInstance };
	}
}

export const createRequest = ( win: RequestWindowPick = window ): IRequestGenerator => new CreateRequestMiddleware( win );
