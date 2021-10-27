const baseConfig = require( './jest.base.config' );
module.exports = {
	...baseConfig,
	testMatch: [
		'<rootDir>/**/__tests__/integration/**/*.spec.[jt]s',
		'!<rootDir>/**/__tests__/integration/**/__*.[jt]s',
	],
	globals: {
		...baseConfig.globals,
		'ts-jest': {
			...baseConfig.globals['ts-jest'],
			tsconfig: '<rootDir>/configs/tsconfig.integration.json',
		},
	},
	testPathIgnorePatterns: [
		...baseConfig.testPathIgnorePatterns,
		'<rootDir>/src/.*\\.spec.ts',
	],
	coverageDirectory: '<rootDir>/coverage/integration',
	collectCoverageFrom: [
		...baseConfig.collectCoverageFrom,
		'!<rootDir>/src/**/*.spec.ts',
	],
};
