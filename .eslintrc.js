module.exports = {
	env: { node: true, browser: true },
	extends: '@scitizen/eslint-config/ts',
	parserOptions: {
		project: 'tsconfig.eslint.json',
	},
};
