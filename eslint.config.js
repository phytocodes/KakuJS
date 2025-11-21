import globals from 'globals';
import eslintJs from '@eslint/js';

export default [
	eslintJs.configs.recommended,

	{
		files: ['**/*.js'],
		languageOptions: {
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2021,
			},
		},
		rules: {},
	},
];
