import { matcherHint, printReceived } from 'jest-matcher-utils';
import { Class } from 'type-fest';

const standardMatchers: Array<{type: Class<any>; regex: RegExp; message: ( e: any, ...regexMatches: string[] ) => string}> = [
	{ type: TypeError, regex: /Cannot read property '.*?' of (null|undefined)/, message: ( e, type ) => `which is called by an unexpected ${type} value` },
];

expect.extend( {
	toThrowNonStandardMessage: ( fn: () => any ) => {
		try {
			fn();
			return {
				pass: false,
				message: () =>
					`${matcherHint( '.not.toThrowNonStandardMessage', 'received', '' )
					}\n\n` +
			'Expected function to throw an error but it didn\'t',
			};
		} catch( e: any ){
			const stdMatch = standardMatchers.map( m => {
				if( e instanceof m.type ) {
					const match = e.message.match( m.regex );
					if( match ){
						const message = m.message( e, ...match.slice( 1 ) );
						return {
							pass: false,
							message: () =>
								`${`${matcherHint( '.toThrowNonStandardMessage', 'received', '' )}

Expected function to throw a non standard message, but received:
  ${printReceived( e )}`}${message ? `\n${message}` : ''}
${e.stack.split( '\n' ).slice( 1 ).join( '\n' )}`,
						};
					}
				}
			} ).filter( v => !!v )[0];
			if( stdMatch ) {
				return stdMatch;
			}
			return {
				pass: true,
				message: () =>
					`${matcherHint( '.toThrowNonStandardMessage', 'received', '' )
					}\n\n` +
			'Expected function to throw a non standard message, but received:\n' +
			`  ${printReceived( e )}`,
			};
		}
	},
} );
