import { UserProfile } from './user-profile';
import { AppSettings } from '@/types/app-settings';
import { ThemeMode } from '@/types/theme';

export interface ThemeState {
  theme: typeof lightTheme | typeof darkTheme;
  isDark: boolean;
  changeThemeMode: (theme: ThemeMode) => Promise<void>;
  availableThemeModes: { code: ThemeMode; langId: string }[];
  themeMode: ThemeMode;
}

export interface LanguageState {
  currentLanguage: Language;
  changeLanguage: (language: Language) => Promise<void>;
  t: (key: string, options?: any) => string;
  availableLanguages: { code: Language; name: string }[];
}

export interface AppState extends ThemeState, LanguageState {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  isSettingsLoaded: boolean;
}
