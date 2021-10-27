const baseConfig = require( './jest.integration.config' );
module.exports = {
	...baseConfig,
	testMatch: [
		'<rootDir>**/__tests__/e2e/**/*.spec.[jt]s',
		'!<rootDir>**/__tests__/e2e/**/__*.[jt]s',
	],
	globals: {
		...baseConfig.globals,
		'ts-jest': {
			...baseConfig.globals['ts-jest'],
			tsconfig: '<rootDir>/configs/tsconfig.e2e.json',
		},
	},
	coverageDirectory: '<rootDir>/coverage/e2e',
};
