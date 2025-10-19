import { ThemeState } from '@/types/app-state';
import { darkTheme } from '@/types/theme/dark';
import { lightTheme } from '@/types/theme/light';
import { ThemeMode } from '@/types/theme/theme';

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
