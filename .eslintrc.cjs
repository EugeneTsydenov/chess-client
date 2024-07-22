require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'eslint:recommended', 'prettier', '@feature-sliced', 'plugin:@conarti/feature-sliced/recommended'],
  plugins: ['prettier', 'simple-import-sort'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    "prettier/prettier": "error",
    'max-len': 'off',
    'consistent-return': 'off',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-shadow': 'off',
    'no-param-reassign': 'warn',
    'no-template-curly-in-string': 'off',
    'no-console': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // External packages:
          ['^tsx', '^@?\\w'],
          // Internal packages:
          ['^@(siberiacancode-core/.*|$)'],
          // Alias imports:
          ['^@(([\\/.]?\\w)|assets|test-utils)'],
          // Side effect imports:
          ['^\\u0000'],
          // Parent imports:
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports:
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports:
          ['^.+\\.s?css$']
        ]
      }
    ]
  }
}
