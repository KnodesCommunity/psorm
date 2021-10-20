import { Class } from 'type-fest';

import { notImplemented } from '../../../core/utils';

import { IRequestGenerator } from './types';

const pluralizeClassName = ( cls: Class<any> ) => {
	const name = cls.name.toLowerCase();
	return `${name.replace( /y$/, 'ie' )}s`;
};
export const entityToPathOnlyPlural = (): IRequestGenerator => ( {
	generate: ( desc, next ) => {
		const nextRet = next( {
			...desc,
			context: {
				...desc.context,
				options: {
					...desc.context.options,
					limit: 1,
				},
			},
			url: {
				...desc.url,
				pathname: `${desc.url?.pathname ?? ''}/${pluralizeClassName( desc.context.entityClass )}`.replace( /\/{2,}/g, '/' ),
			},
		} );
		if( !nextRet ){
			return nextRet;
		} else {
			return {
				...nextRet,
				postHooks: [
					...nextRet.postHooks,
					notImplemented,
				],
			};
		}
	},
} );
