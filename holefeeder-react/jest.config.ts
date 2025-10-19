/** @jest-config-loader esbuild-register */
import type { Config } from 'jest';

const config: Config = {
  projects: [
    {
      displayName: 'unit',
      preset: 'jest-expo',
      testMatch: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
      testPathIgnorePatterns: ['/node_modules/', '.*/__tests__/.*\\.integration\\.(test|spec)\\.(js|jsx|ts|tsx)$'],
      transformIgnorePatterns: [
        // eslint-disable-next-line max-len
        'node_modules/(?!((.pnpm/)?(@?react-native|@react-native-community|@react-navigation|expo|@expo|react-native-safe-area-context|react-native-screens|react-native-gesture-handler|react-native-reanimated|react-native-svg|react-native-vector-icons|@faker-js)))',
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
      coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/', '\\.test\\.', '\\.spec\\.', '\\.integration\\.'],
      coverageDirectory: 'coverage/unit',
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
    },
    {
      displayName: 'integration',
      preset: 'jest-expo',
      testMatch: ['**/__tests__/**/*.integration.{test,spec}.{js,jsx,ts,tsx}'],
      testPathIgnorePatterns: ['/node_modules/', '.*/__tests__/.*(?<!integration)\\.(test|spec)\\.(js|jsx|ts|tsx)$'],
      transformIgnorePatterns: [
        // eslint-disable-next-line max-len
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
      coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/', '\\.test\\.', '\\.spec\\.', '\\.integration\\.'],
      coverageDirectory: 'coverage/integration',
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
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
