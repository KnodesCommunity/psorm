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
	setupFilesAfterEnv: [ 'jest-extended/all', './__tests__/helpers/custom-matchers/index.ts' ],
	testPathIgnorePatterns: [
		'node_modules',
		'__tests__/helpers',
		'coverage',
	],
	modulePathIgnorePatterns: [ '<rootDir>/coverage' ],
	collectCoverage: false,
	coverageDirectory: './coverage/unit',
	collectCoverageFrom: [
		'src/**/*.ts',
		'!**/node_modules/**',
	],
};
