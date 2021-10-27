module.exports = {
	projects: [ 'unit', 'integration', 'e2e' ].map( t => ( {
		...require( `./jest.${t}.config.js` ),
		displayName: t,
	} ) ),
};
