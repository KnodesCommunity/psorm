import { IRequestGenerator } from './types';
import { RequestWindowPick, assignUrl } from './utils';

export const createRequest = ( { Request, URLSearchParams, URL, location }: RequestWindowPick = window ): IRequestGenerator => ( {
	generate: desc => {
		const { params, url, request } = desc;
		const paramsInstance = new URLSearchParams( params );
		const paramsToString = paramsInstance.toString();
		const urlInstance = assignUrl( { Request, URLSearchParams, URL, location }, { ...url, search: paramsToString ? `?${paramsToString}` : '' } );
		const requestInstance = new Request( urlInstance.toString(), request );
		return { request: requestInstance, postHooks: [] };
	},
} );
