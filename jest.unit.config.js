const baseConfig = require( './jest.config' );
module.exports = {
	...baseConfig,
	testMatch: [
		'<rootDir>/src/**/*.{spec,test}.[jt]s',
		'!**/__tests__/**/*.[jt]s',
	],
};
