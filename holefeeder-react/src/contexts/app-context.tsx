import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, AppState, UserProfile } from '@/types';
import { useAuth } from '@/hooks/use-auth';
import { STORAGE_KEYS } from '@/constants';

export const AppContext = createContext<AppState | null>(null);

export const initialProfile: UserProfile = {
  name: '',
  username: '',
  email: '',
  avatar: 'person.fill',
};

export const initialSettings: AppSettings = {
  notifications: true,
  autoSave: true,
  theme: 'auto',
  language: 'en',
};

// Functions to handle AsyncStorage persistence
const loadSettingsFromStorage = async (): Promise<AppSettings> => {
  try {
    const storedSettings = await AsyncStorage.getItem(
      STORAGE_KEYS.APP_SETTINGS
    );

    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      // Merge with initial settings to ensure all properties exist
      return { ...initialSettings, ...parsedSettings };
    }
  } catch (error) {
    console.error('Failed to load settings from storage:', error);
  }
  return initialSettings;
};

const saveSettingsToStorage = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.APP_SETTINGS,
      JSON.stringify(settings)
    );
  } catch (error) {
    console.error('Failed to save settings to storage:', error);
  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  // Load settings from AsyncStorage on component mount
  useEffect(() => {
    const loadSettings = async () => {
      const loadedSettings = await loadSettingsFromStorage();
      setSettings(loadedSettings);
      setIsSettingsLoaded(true);
    };
    loadSettings();
  }, []);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || `${user.givenName} ${user.familyName}` || '',
        username: user.sub || '',
        email: user.email || '',
        avatar: user.picture || 'person.fill',
      });
    } else {
      setProfile(initialProfile);
    }
  }, [user]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const updateSettings = async (updates: Partial<AppSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    await saveSettingsToStorage(newSettings);
  };

  const value: AppState = {
    profile,
    updateProfile,
    settings,
    updateSettings,
    isSettingsLoaded,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppState {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppProvider');
  }
  return context;
}
