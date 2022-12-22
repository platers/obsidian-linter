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
    'no-constant-binary-expression': 'error',
    'no-template-curly-in-string': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unreachable-loop': 'error',
    'no-unused-private-class-members': 'error',
    'require-jsdoc': 'off',
    'unicorn/template-indent': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        'argsIgnorePattern': '(^_)|(options)',
      },
    ],
  },
};
