import { Theme, lightTheme } from '@/src/types';
import { ViewStyle, TextStyle } from 'react-native';

// Type for Theme Context
export interface ThemeContextType {
  theme: Theme;
  themeMode: 'light' | 'dark' | 'system';
  isDark: boolean;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
}

// Deep merge utility for nested objects
const deepMerge = (target: any, source: any): any => {
  const result = { ...target };
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
};

export class ThemeBuilder {
  private readonly value: Theme;

  constructor(overrides: Partial<Theme> = {}) {
    // Use lightTheme as the base and deep merge overrides
    this.value = deepMerge(lightTheme, overrides);
  }

  // Convenient methods for common customizations
  withColors(colors: Partial<Theme['colors']>) {
    return new ThemeBuilder({
      ...this.value,
      colors: { ...this.value.colors, ...colors },
    });
  }

  withSpacing(spacing: Partial<Theme['spacing']>) {
    return new ThemeBuilder({
      ...this.value,
      spacing: { ...this.value.spacing, ...spacing },
    });
  }

  withTypography(typography: Partial<Theme['typography']>) {
    return new ThemeBuilder({
      ...this.value,
      typography: { ...this.value.typography, ...typography },
    });
  }

  withButtonStyles(buttons: Partial<Theme['styles']['buttons']>) {
    return new ThemeBuilder({
      ...this.value,
      styles: {
        ...this.value.styles,
        buttons: { ...this.value.styles.buttons, ...buttons },
      },
    });
  }

  withContainerStyles(containers: Partial<Theme['styles']['containers']>) {
    return new ThemeBuilder({
      ...this.value,
      styles: {
        ...this.value.styles,
        containers: { ...this.value.styles.containers, ...containers },
      },
    });
  }

  withTextStyles(text: Partial<Theme['styles']['text']>) {
    return new ThemeBuilder({
      ...this.value,
      styles: {
        ...this.value.styles,
        text: { ...this.value.styles.text, ...text },
      },
    });
  }

  build(): Theme {
    return this.value;
  }
}

export const aTheme = (overrides: Partial<Theme> = {}) =>
  new ThemeBuilder(overrides);

export class ThemeContextTypeBuilder {
  private readonly value: ThemeContextType;

  constructor(overrides: Partial<ThemeContextType> = {}) {
    this.value = {
      theme: aTheme().build(),
      themeMode: 'light',
      isDark: false,
      setThemeMode: jest.fn(),
      toggleTheme: jest.fn(),
      ...overrides,
    };
  }

  withTheme(theme: Theme) {
    return new ThemeContextTypeBuilder({
      ...this.value,
      theme,
    });
  }

  withDarkMode() {
    return new ThemeContextTypeBuilder({
      ...this.value,
      themeMode: 'dark',
      isDark: true,
    });
  }

  withLightMode() {
    return new ThemeContextTypeBuilder({
      ...this.value,
      themeMode: 'light',
      isDark: false,
    });
  }

  withSystemMode() {
    return new ThemeContextTypeBuilder({
      ...this.value,
      themeMode: 'system',
    });
  }

  build(): ThemeContextType {
    return this.value;
  }
}

export const aThemeContext = (overrides: Partial<ThemeContextType> = {}) =>
  new ThemeContextTypeBuilder(overrides);

// Convenient preset builders for common test scenarios
export const aLightThemeContext = () =>
  new ThemeContextTypeBuilder().withLightMode();

export const aDarkThemeContext = () =>
  new ThemeContextTypeBuilder().withDarkMode();

export const aSystemThemeContext = () =>
  new ThemeContextTypeBuilder().withSystemMode();

// Common theme variations for testing
export const aTestTheme = () =>
  aTheme().withColors({
    primary: '#TEST_PRIMARY',
    secondary: '#TEST_SECONDARY',
  });

export const aMinimalTheme = () =>
  aTheme().withColors({
    primary: '#000000',
    systemBackground: '#FFFFFF',
    label: '#000000',
  });
