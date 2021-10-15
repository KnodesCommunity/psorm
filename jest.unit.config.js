const baseConfig = require( './jest.config' );
module.exports = {
	...baseConfig,
	testMatch: [
		'<rootDir>/src/**/*.{spec,test}.[jt]s',
		'!**/__tests__/**/*.[jt]s',
	],
	globals: {
		...baseConfig.globals,
		'ts-jest': {
			...baseConfig.globals['ts-jest'],
			tsconfig: './tsconfig.unit.json',
		},
	},
};
