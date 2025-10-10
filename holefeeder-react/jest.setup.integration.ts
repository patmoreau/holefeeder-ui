// Integration test setup - common mocks and configurations
import 'react-native-gesture-handler/jestSetup';

import generated from '@react-native-async-storage/async-storage/jest/async-storage-mock';
// import Reanimated from 'react-native-reanimated/mock';

jest.mock('expo/src/winter/ImportMetaRegistry', () => ({
  ImportMetaRegistry: {
    get url() {
      return null;
    },
  },
}));

// Mock structuredClone global function
global.structuredClone = jest.fn((obj) => JSON.parse(JSON.stringify(obj)));

// Mock react-native-reanimated
// jest.mock('react-native-reanimated', () => {
//   Reanimated.default.call = () => {};
//   return Reanimated;
// });

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => generated);

// Mock expo-localization
jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => [
    {
      languageCode: 'en',
      languageTag: 'en-US',
      regionCode: 'US',
      languageRegionCode: 'en-US',
      currencyCode: 'USD',
      currencySymbol: '$',
      langageCurrencyCode: 'USD',
      langageCurrencySymbol: '$',
      decimalSeparator: '.',
      digitGroupingSeparator: ',',
      textDirection: 'ltr',
      measurementSystem: 'metric',
      temperatureUnit: 'celsius',
    },
  ]),
}));

// Mock expo modules that might cause issues in integration tests
jest.mock('expo-constants', () => ({
  default: {
    deviceId: 'test-device-id',
    manifest: {},
  },
}));

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn(),
  preventAutoHideAsync: jest.fn(),
}));

// Mock haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
}));

// Mock navigation state
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      dispatch: jest.fn(),
    }),
  };
});

// Global test timeout for integration tests (they might take longer)
jest.setTimeout(10000);

// Suppress console warnings during tests unless debugging
if (!process.env.DEBUG_TESTS) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('componentWillReceiveProps')) {
      return;
    }
    originalWarn(...args);
  };
}
