// https://docs.expo.dev/guides/using-eslint/
import pluginQuery from '@tanstack/eslint-plugin-query';
import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';
import pluginImport from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  ...pluginQuery.configs['flat/recommended'],
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ['node_modules/*', 'dist/*', '.expo/*'],
  },
  pluginImport.flatConfigs.recommended,
  {
    rules: {
      'max-len': ['error', { code: 255 }],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
]);
