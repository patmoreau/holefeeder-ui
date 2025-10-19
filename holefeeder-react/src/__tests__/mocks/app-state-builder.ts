import { aLightThemeState, aUserProfile } from '@/__tests__';
import { aLanguageState } from '@/__tests__/mocks/language-state-builder';
import { AppState, LanguageType } from '@/types/app-state';
import { ThemeMode } from '@/types/theme/theme';

const defaultAppState = (): AppState => ({
  profile: aUserProfile(),
  updateProfile: () => {},
  settings: {
    notifications: true,
    autoSave: true,
    themeMode: 'light' as ThemeMode,
    language: 'en' as LanguageType,
  },
  updateSettings: () => Promise.resolve(),
  isSettingsLoaded: true,
  ...aLightThemeState(),
  ...aLanguageState(),
});

export const anAppState = (data: Partial<AppState> = {}): AppState => ({ ...defaultAppState(), ...data });
