import type { ColorSchemeName } from 'react-native';

// Mock types for your hooks
export const mockUseColorScheme = jest.fn<ColorSchemeName, []>();

// Mock navigation types
export const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
  setOptions: jest.fn(),
  isFocused: jest.fn(() => true),
} as const;

export const mockRoute = {
  params: {},
  name: 'TestScreen' as const,
  key: 'test-key',
  path: undefined,
};

// Font loading mock with proper return type
export const mockUseFonts = jest.fn<
  [boolean, Error | null],
  [Record<string, any>]
>();
