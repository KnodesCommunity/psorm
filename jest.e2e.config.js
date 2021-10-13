const baseConfig = require( './jest.config' );
module.exports = {
	...baseConfig,
	testMatch: [
		'**/tests/e2e/**/*.[jt]s',
		'!**/tests/e2e/**/__*.[jt]s',
	],
	globals: {
		...baseConfig.globals,
		'ts-jest': {
			...baseConfig.globals['ts-jest'],
			tsconfig: './tsconfig.e2e.json',
		},
	},
};
