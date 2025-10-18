import { useMemo } from 'react';
import { ViewStyle, TextStyle, ImageStyle, Platform } from 'react-native';
import { GlobalStyles } from '@/constants/global-styles';
import { useTheme } from '@/hooks/theme/use-theme';
import { Theme } from '@/types/theme/theme';
import { getContainerStyle, combineStyles, getColor, getComponentStyle } from '@/utils/style-utils';

type StyleFunction<T> = (theme: Theme, globalStyles: typeof GlobalStyles) => T;

export const useStyles = <T extends Record<string, ViewStyle | TextStyle | ImageStyle>>(stylesFn: StyleFunction<T>): T => {
  const themeState = useTheme();
  const { theme } = themeState;

  return useMemo(() => stylesFn(theme, GlobalStyles), [stylesFn, theme]);
};

export const useViewStyles = () => {
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
      picker: combineStyles(getComponentStyle(theme, 'picker'), {
        backgroundColor: getColor(theme, 'background'),
        borderColor: getColor(theme, 'separator'),
      }),
      pickerItem: combineStyles(getComponentStyle(theme, 'pickerItem'), {
        ...Platform.select({
          web: {
            backgroundColor: getColor(theme, 'background'),
            color: getColor(theme, 'text'),
          },
          default: {},
        }),
      }),
    }),
    [theme]
  );
};
