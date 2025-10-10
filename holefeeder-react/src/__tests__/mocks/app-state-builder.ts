import { aUserProfile } from '@/__tests__';
import { AppState, LanguageType, lightTheme, ThemeMode } from '@/types';

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
  changeLanguage: (_) => Promise.resolve(),
  t: (_, __?) => '',
  availableLanguages: [{ code: 'en', name: 'en_CA' }],
});

export const anAppState = (data: Partial<AppState> = {}): AppState => ({ ...defaultAppState(), ...data });
