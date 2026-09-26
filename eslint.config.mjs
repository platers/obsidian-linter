import js from '@eslint/js';
import { defineConfig } from "eslint/config";
import tsparser from '@typescript-eslint/parser';
import obsidianmd from 'eslint-plugin-obsidianmd';
import obsidianLinterPlugin from 'eslint-plugin-obsidian-linter';
import unicorn from 'eslint-plugin-unicorn';
import jestPlugin from 'eslint-plugin-jest';
import tsPlugin from '@typescript-eslint/eslint-plugin'
import globals from 'globals';

const typescriptLanguageOptions = {
    parser: tsparser,
    ecmaVersion: 2021,
    parserOptions: {
        projectService: true,
        extraFileExtensions: [".json"],
    },
    globals: {
        ...globals.es2020,
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
    },
};

const commonRules = {
  camelcase: 'off',

  'no-constant-binary-expression': 'error',
  'no-template-curly-in-string': 'error',
  'no-unmodified-loop-condition': 'error',
  'no-unreachable-loop': 'error',
  'no-unused-private-class-members': 'error',

  'require-jsdoc': 'off',

  'unicorn/template-indent': 'error',

  'no-unused-vars': 'off',

  '@typescript-eslint/no-floating-promises': 'error',

  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '(^_)|(options)',
      varsIgnorePattern: '^_',
    },
  ],

  '@typescript-eslint/no-deprecated': 'warn',

  'obsidian-linter/no-duplicate-ignore-types': 'error',
};
// eslint rules that should be different from the source rules
const nonSrcRules = {
  'obsidianmd/no-nodejs-modules': 'off', // fs and other node libraries are pefectly fine in non-plugin code
  'obsidianmd/rule-custom-message': 'off', // this should not be enabled for tests as console logs are valid for my uses
  'obsidianmd/commands/no-plugin-name-in-command-name': 'off', // this shouldn't affect the integration tests
  "import/no-extraneous-dependencies": ["warn", { "devDependencies": true }], // check for dev dependencies for tests
}
const commonDisabledRules = {
  '@typescript-eslint/no-restricted-imports': 'off', // moment is going to be used for UTs and integration tests, but even as a dev import it triggers this rule
  'obsidianmd/object-assign': 'off', // I will determine when to actual use object assign
  'depend/ban-dependencies': 'off', // I am only importing moment for the UTs and integration tests as needed. So there is no need to have this enabled as it will just say there is an issue when there isn't
  'obsidianmd/ui/sentence-case': 'off', // this shouldn't affect the integration tests and it is not used in the scanner, so I am turning it off
  'obsidianmd/editor-drop-paste': 'off', // while this should be handled, it seems to be erroneously flagging a place where I do have this handled, so I am disabling it
}

export default defineConfig([
    {
      ignores: [
        'docs.js',
        'main.js',
        'translation-helper.js',
        'eslint.config.mjs',
        'esbuild.config.mjs',
        'babel.config.js',
        'postcss.config.js',
        'eslint-rules/**',
        'test-vault'
      ],
    },
    js.configs.recommended,
    ...obsidianmd.configs.recommended,
    {
      files: ['package.json'],
      languageOptions: typescriptLanguageOptions,
      plugins: {
          unicorn,
      },
      rules:  {
        ...commonDisabledRules,
      },
    },
    {
      files: ['src/**/*.ts'],
      languageOptions: typescriptLanguageOptions,
      plugins: {
          'obsidian-linter': obsidianLinterPlugin,
          unicorn,
          '@typescript-eslint': tsPlugin
      },
      rules:  {
        ...commonRules,
        ...commonDisabledRules,
      },
    },
    {
      files: ['__integration__/**/*.ts', '__tests__/**/*.ts', '__mocks__/**/*.ts'],
      languageOptions: typescriptLanguageOptions,
      plugins: {
          'obsidian-linter': obsidianLinterPlugin,
          unicorn,
          '@typescript-eslint': tsPlugin,
          jest: jestPlugin
      },
      rules:  {
        ...commonRules,
        ...nonSrcRules,
        ...commonDisabledRules,
      },
    },
    {
      files: ['jest.config.ts', 'scripts/js/*.ts'],
      languageOptions: typescriptLanguageOptions,
      plugins: {
          'obsidian-linter': obsidianLinterPlugin,
          unicorn,
          '@typescript-eslint': tsPlugin
      },
      rules:  {
        ...commonRules,
        ...nonSrcRules,
        ...commonDisabledRules,
      },
    },
]);
