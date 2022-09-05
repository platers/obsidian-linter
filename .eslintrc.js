module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'jest/globals': true,
  },
  'extends': [
    'eslint:recommended',
    'google',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'plugins': [
    '@typescript-eslint',
    'jest',
    'unicorn',
  ],
  'rules': {
    'camelcase': 'off',
    'max-len': 'off',
    'require-jsdoc': 'off',
    'unicorn/template-indent': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};
