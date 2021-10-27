const baseConfig = require( './jest.base.config' );
module.exports = {
	...baseConfig,
	testMatch: [
		'<rootDir>/src/**/*.{spec,test}.[jt]s',
		'!<rootDir>/**/__tests__/**/*.[jt]s',
	],
	globals: {
		...baseConfig.globals,
		'ts-jest': {
			...baseConfig.globals['ts-jest'],
			tsconfig: '<rootDir>/configs/tsconfig.unit.json',
		},
	},
};
