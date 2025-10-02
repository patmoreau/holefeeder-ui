import { UserProfile } from './user-profile';
import { AppSettings } from '@/types/app-settings';
import { lightTheme, darkTheme, ThemeMode } from '@/types';

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
  changeLanguage: (language: LanguageType) => Promise<void>;
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
