import { UserProfile } from './user-profile';
import { AppSettings } from '@/types/app-settings';

export interface AppState {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  isSettingsLoaded: boolean;
}
