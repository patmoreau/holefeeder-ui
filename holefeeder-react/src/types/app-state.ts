import { AppSettings } from '@/types/app-settings';
import { darkTheme } from '@/types/theme/dark';
import { lightTheme } from '@/types/theme/light';
import { ThemeMode } from '@/types/theme/theme';
import { UserProfile } from './user-profile';

export const LanguageType = {
  en: 'en',
  fr: 'fr',
} as const;

export type LanguageType = (typeof LanguageType)[keyof typeof LanguageType];

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
