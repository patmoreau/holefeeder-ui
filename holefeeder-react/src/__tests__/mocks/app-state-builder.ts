import { aUserProfile } from '@/__tests__';
import { AppState, LanguageType } from '@/types/app-state';
import { lightTheme } from '@/types/theme/light';
import { ThemeMode } from '@/types/theme/theme';

const defaultAppState = (): AppState => ({
  profile: aUserProfile(),
  updateProfile: () => {},
  settings: {
    notifications: true,
    autoSave: true,
    themeMode: 'system' as ThemeMode,
    language: 'en' as LanguageType,
  },
  updateSettings: () => Promise.resolve(),
  isSettingsLoaded: true,
  theme: lightTheme,
  isDark: false,
  changeThemeMode: (_) => Promise.resolve(),
  availableThemeModes: [{ code: 'system', langId: 'systemId' }],
  themeMode: 'system',
  currentLanguage: 'en',
  setUserLanguage: (_) => Promise.resolve(),
  t: (_, __?) => '',
  availableLanguages: [{ code: 'en', name: 'en_CA' }],
});

export const anAppState = (data: Partial<AppState> = {}): AppState => ({ ...defaultAppState(), ...data });
