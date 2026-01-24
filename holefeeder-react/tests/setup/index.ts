import './globals';
import './result-matcher';

// If you have one-off test helpers or expect extensions, import them here too:
// import '@testing-library/jest-native/extend-expect';

jest.mock('module');

jest.mock('expo-crypto', () => ({
  randomUUID: () => require('crypto').randomUUID(),
}));
