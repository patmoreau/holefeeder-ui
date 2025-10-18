import { ThemeMode } from '@/types/theme/theme';

export interface AppSettings {
  notifications: boolean;
  autoSave: boolean;
  themeMode: ThemeMode;
  language: string;
}

export const initialSettings: AppSettings = {
  notifications: true,
  autoSave: true,
  themeMode: 'system',
  language: 'en',
};
