import { darkTheme, lightTheme, ThemeMode, ThemeState } from '@/types';

const defaultData = {
  changeThemeMode: (_: ThemeMode) => Promise.resolve(),
  availableThemeModes: [],
};

export const aLightThemeState = (): ThemeState => ({
  ...defaultData,
  theme: lightTheme,
  isDark: false,
  themeMode: 'light',
});

export const aDarkThemeState = (): ThemeState => ({
  ...defaultData,
  theme: darkTheme,
  isDark: true,
  themeMode: 'light',
});
