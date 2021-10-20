import { IRequestGenerator } from './types';
import { extractUrl } from './utils';

export const apiRoot = ( url: string | URL ): IRequestGenerator => ( {
	generate: ( desc, next ) => next( {
		...desc,
		url: {
			...desc.url,
			...extractUrl( new URL( url ) ),
		},
	} ),
} );
