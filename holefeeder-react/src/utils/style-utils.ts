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
