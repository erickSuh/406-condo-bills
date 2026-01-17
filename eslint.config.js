const expoConfig = require('eslint-config-expo/flat');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'jest.config.js',
      'jest.setup.js',
      'tsconfig.json',
      'tsconfig.test.json',
      '.expo',
      'node_modules',
      'coverage',
      'assets',
      '*.json',
      '*config.js',
    ],
  },
]);
