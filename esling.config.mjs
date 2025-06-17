import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // https://eslint.org/docs/latest/rules/
  eslint.configs.recommended,
  // https://typescript-eslint.io/
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    ignores: ['.output', '.nitro']
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,cts,mts}'],
    rules: {
      'indent': ['error', 2],
      'comma-dangle': ['error', 'never'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ]
    }
  }
);