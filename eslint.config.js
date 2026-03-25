"use strict";

const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

/** @type {import("eslint").Linter.Config[]} */
module.exports = [
	{
		ignores: ["build/**", "node_modules/**", "tstl-plugins/**"],
	},
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: "module",
			},
		},
		plugins: {
			"@typescript-eslint": tsPlugin,
		},
		rules: {
			semi: ["error", "always"],
		},
	},
];
