import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Theme } from '@/types/theme';

type Style = ViewStyle | TextStyle | ImageStyle;

export const createStyles = <T extends Record<string, Style>>(
  stylesFn: (theme: Theme) => T
) => stylesFn;

// Helper functions
export const getSpacing = (
  theme: Theme,
  size: keyof Theme['spacing']
): number => {
  return theme.spacing[size];
};

export const getColor = (
  theme: Theme,
  color: keyof Theme['colors']
): string => {
  return theme.colors[color];
};

// Helper for combining theme styles with custom styles
export const combineStyles = <T extends Style>(
  themeStyle: T,
  customStyle?: Partial<T>
): T => {
  return { ...themeStyle, ...customStyle } as T;
};

// Helper to get predefined theme styles
export const getThemeStyle = (
  theme: Theme,
  styleCategory: keyof Theme['styles'],
  variant: string
): Style => {
  const categoryStyles = theme.styles[styleCategory] as Record<string, Style>;
  return categoryStyles[variant] || {};
};

// Convenience helpers for common style categories
export const getButtonStyle = (
  theme: Theme,
  variant: keyof Theme['styles']['buttons']
): ViewStyle => {
  return theme.styles.buttons[variant];
};

export const getContainerStyle = (
  theme: Theme,
  variant: keyof Theme['styles']['containers']
): ViewStyle => {
  return theme.styles.containers[variant];
};

export const getTextStyle = (
  theme: Theme,
  variant: keyof Theme['styles']['text']
): TextStyle => {
  return theme.styles.text[variant];
};

export const getLayoutStyle = (
  theme: Theme,
  variant: keyof Theme['styles']['layouts']
): ViewStyle => {
  return theme.styles.layouts[variant];
};

// Theme-aware shadow utility
export const getThemedShadow = (
  theme: Theme,
  size: keyof Theme['shadows']
): ViewStyle => {
  return {
    ...theme.shadows[size],
    shadowColor: getColor(theme, 'label'),
  };
};

// Responsive spacing utility
export const getResponsiveSpacing = (
  theme: Theme,
  baseSize: keyof Theme['spacing'],
  multiplier: number = 1
): number => {
  return theme.spacing[baseSize] * multiplier;
};

// Typography helper with theme colors
export const getThemedTypography = (
  theme: Theme,
  variant: keyof Theme['typography'],
  colorKey?: keyof Theme['colors']
): TextStyle => {
  return {
    ...theme.typography[variant],
    ...(colorKey && { color: getColor(theme, colorKey) }),
  };
};
