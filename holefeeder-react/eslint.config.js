// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
import pluginQuery from '@tanstack/eslint-plugin-query';

module.exports = defineConfig([
  pluginQuery.configs.recommended,
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ['node_modules/*', 'dist/*', '.expo/*'],
  },
]);
