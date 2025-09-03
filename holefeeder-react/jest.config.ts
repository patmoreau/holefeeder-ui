/** @jest-config-loader esbuild-register */
import type { Config } from 'jest';

const config: Config = {
  projects: [
    {
      displayName: 'unit',
      preset: 'jest-expo',
      testMatch: ['**/__tests__/**/*.unit.{test,spec}.{js,jsx,ts,tsx}'],
      testPathIgnorePatterns: [
        '/node_modules/',
        '.*\\.integration\\.(test|spec)\\.(js|jsx|ts|tsx)$',
      ],
      transformIgnorePatterns: [
        'node_modules/(?!((.pnpm/)?(@?react-native|@react-native-community|@react-navigation|expo|@expo|react-native-safe-area-context|react-native-screens|react-native-gesture-handler|react-native-reanimated|react-native-svg|react-native-vector-icons)))',
      ],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.unit.ts'],
      collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/__tests__/**',
        '!src/**/*.{test,spec}.{js,jsx,ts,tsx}',
        '!src/app/_layout.tsx',
        '!src/app/+not-found.tsx',
        '!src/**/*.d.ts',
        '!**/node_modules/**',
      ],
      coveragePathIgnorePatterns: [
        '/node_modules/',
        '/__tests__/',
        '\\.test\\.',
        '\\.spec\\.',
        '\\.integration\\.',
      ],
      coverageDirectory: 'coverage/unit',
    },
    {
      displayName: 'integration',
      preset: 'jest-expo',
      testMatch: ['**/__tests__/**/*.integration.{test,spec}.{js,jsx,ts,tsx}'],
      testPathIgnorePatterns: [
        '/node_modules/',
        '.*\\.unit\\.(test|spec)\\.(js|jsx|ts|tsx)$',
      ],
      transformIgnorePatterns: [
        'node_modules/(?!((.pnpm/)?(@?react-native|@react-native-community|@react-navigation|expo|@expo|react-native-safe-area-context|react-native-screens|react-native-gesture-handler|react-native-reanimated|react-native-svg|react-native-vector-icons)))',
      ],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.integration.ts'],
      collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/__tests__/**',
        '!src/**/*.{test,spec}.{js,jsx,ts,tsx}',
        '!src/app/_layout.tsx',
        '!src/app/+not-found.tsx',
        '!src/**/*.d.ts',
        '!**/node_modules/**',
      ],
      coveragePathIgnorePatterns: [
        '/node_modules/',
        '/__tests__/',
        '\\.test\\.',
        '\\.spec\\.',
        '\\.integration\\.',
      ],
      coverageDirectory: 'coverage/integration',
    },
  ],
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

export default config;
