import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Theme } from '@/types/theme/theme';

type Style = ViewStyle | TextStyle | ImageStyle;

export const createStyles = <T extends Record<string, Style>>(stylesFn: (theme: Theme) => T) => stylesFn;

export const getColor = (theme: Theme, color: keyof Theme['colors']): string => theme.colors[color];

export const combineStyles = <T extends Style>(themeStyle: T, customStyle?: Partial<T>): T => ({ ...themeStyle, ...customStyle }) as T;

export const getContainerStyle = (theme: Theme, variant: keyof Theme['styles']['containers']): ViewStyle => theme.styles.containers[variant];

export const getComponentStyle = (theme: Theme, variant: keyof Theme['styles']['components']): TextStyle => theme.styles.components[variant];
