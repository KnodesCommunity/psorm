const baseConfig = require( './jest.config' );
module.exports = {
	...baseConfig,
	testMatch: [
		'**/tests/integration/**/*.[jt]s',
		'!**/tests/integration/**/__*.[jt]s',
	],
	globals: {
		...baseConfig.globals,
		'ts-jest': {
			...baseConfig.globals['ts-jest'],
			tsconfig: './tsconfig.integration.json',
		},
	},
};
