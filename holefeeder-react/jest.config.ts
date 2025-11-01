import { Config } from 'jest';

/** @jest-config-loader esbuild-register */
const config: Config = {
  preset: 'jest-expo',
  testMatch: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
  testRegex: [],
  testPathIgnorePatterns: ['/node_modules/', '.*/__tests__/.*', '/src/__tests__/mocks/'],
  transformIgnorePatterns: [
    // eslint-disable-next-line max-len
    'node_modules/(?!((.pnpm/)?(@?react-native|@react-native-community|@react-navigation|expo|@expo|react-native-safe-area-context|react-native-screens|react-native-gesture-handler|react-native-reanimated|react-native-svg|react-native-vector-icons|@faker-js)))',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
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
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  silent: false,
};

export default config;
