const baseConfig = require( './jest.config' );
module.exports = {
	...baseConfig,
	testMatch: [
		'**/__tests__/integration/**/*.[jt]s',
		'!**/__tests__/integration/**/__*.[jt]s',
	],
	globals: {
		...baseConfig.globals,
		'ts-jest': {
			...baseConfig.globals['ts-jest'],
			tsconfig: './tsconfig.integration.json',
		},
	},
	testPathIgnorePatterns: [
		...baseConfig.testPathIgnorePatterns,
		'src/.*\\.spec.ts',
	],
	coverageDirectory: './coverage/integration',
	collectCoverageFrom: [
		...baseConfig.collectCoverageFrom,
		'!src/**/*.spec.ts',
	],
};
