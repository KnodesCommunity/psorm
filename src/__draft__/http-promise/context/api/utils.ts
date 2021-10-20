import { Descriptor } from './types';

export type RequestWindowPick = {URL: typeof window.URL; Request: typeof window.Request; URLSearchParams: typeof window.URLSearchParams; location: typeof window.location};
export const assignUrl = ( { URL, location }: RequestWindowPick, pseudoUrl: Partial<URL> ): URL => Object.entries( pseudoUrl )
	.reduce( ( url, [ prop, val ] ) => {
		url[prop] = val;
		return url;
	}, new URL( location as any ) as any );
export const extractUrl = ( url: URL ): Descriptor.Url => {
	const { hash, host, hostname, href, password, pathname, port, protocol, username } = url;
	return { hash, host, hostname, href, password, pathname, port, protocol, username };
};
