import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';
import pluginImport from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  { ignores: ['node_modules/*', 'dist/*', '.expo/*'] },
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    plugins: { import: pluginImport },
    settings: {
      react: {
        version: '19.2.0', // ← add this, matches your package.json
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      '@typescript-eslint/no-redeclare': 'off',
      'max-len': ['error', { code: 255 }],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'never',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
]);
