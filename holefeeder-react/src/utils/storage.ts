import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants';
import { AppSettings, initialSettings } from '@/types';

const loadSettings = async (): Promise<AppSettings> => {
  try {
    const storedSettings = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);

    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      return { ...initialSettings, ...parsedSettings };
    }
  } catch (error) {
    console.error('Failed to load settings from storage:', error);
  }
  return initialSettings;
};

const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings to storage:', error);
  }
};

export const Storage = () => {
  return {
    loadSettings,
    saveSettings,
  };
};
