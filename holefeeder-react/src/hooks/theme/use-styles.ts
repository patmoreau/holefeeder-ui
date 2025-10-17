import { useMemo } from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { GlobalStyles } from '@/constants/global-styles';
import { useTheme } from '@/hooks/theme/use-theme';
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
        backgroundColor: getColor(theme, 'background'),
      }),
      centered: combineStyles(getContainerStyle(theme, 'center'), {
        backgroundColor: getColor(theme, 'background'),
      }),
      host: combineStyles(getContainerStyle(theme, 'section'), {
        width: '80%',
        maxWidth: 300,
        ...{ flexDirection: 'column' },
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
      heading: combineStyles(theme.typography.title, {
        color: getColor(theme, 'text'),
        ...GlobalStyles.textCenter,
      }),
      subtitle: combineStyles(theme.typography.subtitle, {
        color: getColor(theme, 'secondaryText'),
        ...GlobalStyles.textCenter,
      }),
      body: combineStyles(theme.typography.body, {
        color: getColor(theme, 'text'),
      }),
      link: combineStyles(theme.typography.body, {
        color: getColor(theme, 'link'),
      }),
    }),
    [theme]
  );
};
