import { lightTheme, darkTheme, ThemeMode } from '@/types';
import { AppSettings } from '@/types/app-settings';
import { UserProfile } from './user-profile';

export type LanguageType = 'en' | 'fr';

export interface ThemeState {
  theme: typeof lightTheme | typeof darkTheme;
  isDark: boolean;
  changeThemeMode: (theme: ThemeMode) => Promise<void>;
  availableThemeModes: { code: ThemeMode; langId: string }[];
  themeMode: ThemeMode;
}

export interface LanguageState {
  currentLanguage: LanguageType;
  setUserLanguage: (language: LanguageType) => Promise<void>;
  t: (key: string, options?: any) => string;
  availableLanguages: { code: LanguageType; name: string }[];
}

export interface AppState extends ThemeState, LanguageState {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  isSettingsLoaded: boolean;
}
