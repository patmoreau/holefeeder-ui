import expoConfig from 'eslint-config-expo/flat.js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';

// Reuse the exact plugin instance expo registered to avoid "Cannot redefine plugin" errors
// (ESLint flat config throws when the same key is registered with different object instances)
const importPlugin = expoConfig.find((c) => c?.plugins?.import)?.plugins?.import;

export default defineConfig([
  { ignores: ['node_modules/*', 'dist/*', '.expo/*'] },
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    plugins: { import: importPlugin },
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
