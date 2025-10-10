// src/hooks/use-styles.ts
import { useMemo } from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { GlobalStyles } from '@/constants/global-styles';
import { useTheme } from '@/hooks/use-theme';
import { Theme } from '@/types/theme';
import { getContainerStyle, combineStyles, getColor } from '@/utils/style-utils';

type StyleFunction<T> = (theme: Theme, globalStyles: typeof GlobalStyles) => T;

export const useStyles = <T extends Record<string, ViewStyle | TextStyle>>(stylesFn: StyleFunction<T>): T => {
  const themeState = useTheme();

  return useMemo(() => stylesFn(themeState.theme, GlobalStyles), [stylesFn, themeState.theme]);
};

// Helper functions for common patterns
export const useContainerStyles = () => {
  const themeState = useTheme();
  const { theme } = themeState;

  return useMemo(
    () => ({
      primary: combineStyles(getContainerStyle(theme, 'page'), {
        backgroundColor: getColor(theme, 'systemBackground'),
        ...GlobalStyles.flex1,
      }),
      card: combineStyles(getContainerStyle(theme, 'card'), {
        backgroundColor: getColor(theme, 'secondarySystemBackground'),
        ...GlobalStyles.p16,
      }),
      centered: combineStyles(getContainerStyle(theme, 'center'), {
        backgroundColor: getColor(theme, 'systemBackground'),
        ...GlobalStyles.center,
        ...GlobalStyles.flex1,
      }),
      host: combineStyles(getContainerStyle(theme, 'section'), {
        width: '80%',
        maxWidth: 300,
        ...GlobalStyles.column,
      }),
    }),
    [theme]
  );
};

export const useTextStyles = () => {
  const themeState = useTheme();
  const { theme } = themeState;

  return useMemo(
    () => ({
      heading: combineStyles(theme.typography.title1, {
        color: getColor(theme, 'label'),
        ...GlobalStyles.textCenter,
      }),
      subtitle: combineStyles(theme.typography.subheadline, {
        color: getColor(theme, 'secondaryLabel'),
        ...GlobalStyles.textCenter,
      }),
      body: combineStyles(theme.typography.body, {
        color: getColor(theme, 'label'),
      }),
    }),
    [theme]
  );
};
