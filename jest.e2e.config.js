const baseConfig = require( './jest.integration.config' );
module.exports = {
	...baseConfig,
	testMatch: [
		'**/__tests__/e2e/**/*.[jt]s',
		'!**/__tests__/e2e/**/__*.[jt]s',
	],
	globals: {
		...baseConfig.globals,
		'ts-jest': {
			...baseConfig.globals['ts-jest'],
			tsconfig: './tsconfig.e2e.json',
		},
	},
	coverageDirectory: './coverage/e2e',
};
