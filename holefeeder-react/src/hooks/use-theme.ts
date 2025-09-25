import { useAppContext } from '@/contexts';
import { ThemeState } from '@/types';

export function useTheme(): ThemeState {
  const context = useAppContext();
  return {
    theme: context.theme,
    isDark: context.isDark,
    changeThemeMode: context.changeThemeMode,
    availableThemeModes: context.availableThemeModes,
    themeMode: context.settings.themeMode,
  };
}
