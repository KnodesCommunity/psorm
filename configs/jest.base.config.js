const { resolve } = require( 'path' );

module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleNameMapper: {
		'^~(.*)$': '<rootDir>/src/$1',
	},
	globals: {
		'ts-jest': {
		},
	},
	moduleFileExtensions: [ 'js', 'json', 'ts' ],
	setupFilesAfterEnv: [ 'jest-extended/all', '<rootDir>/__tests__/helpers/custom-matchers/index.ts' ],
	testPathIgnorePatterns: [
		'<rootDir>/node_modules',
		'<rootDir>/__tests__/helpers',
		'<rootDir>/coverage',
	],
	modulePathIgnorePatterns: [ '<rootDir>/coverage' ],
	collectCoverage: false,
	coverageDirectory: '<rootDir>/coverage/unit',
	collectCoverageFrom: [
		'<rootDir>/src/**/*.ts',
		'!<rootDir>/**/node_modules/**',
	],
	rootDir: resolve( __dirname, '..' ),
	moduleDirectories: [ '<rootDir>/node_modules' ],
};
