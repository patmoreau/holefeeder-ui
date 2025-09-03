import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants';

// Import translation files
import en from './locales/en-CA/translations.json';
import fr from './locales/fr-CA/translations.json';

const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
};

let isInitialized = false;

export const initI18n = async (): Promise<void> => {
  if (isInitialized) {
    return;
  }

  try {
    // Try to get saved language preference
    let savedLanguage: string | null = await AsyncStorage.getItem(
      STORAGE_KEYS.LANGUAGE_KEY
    );

    // If no saved language, use device locale or fallback to English
    if (!savedLanguage) {
      const deviceLanguage = Localization.getLocales()[0].languageCode ?? '';
      const supportedLanguages = ['en', 'fr'];
      savedLanguage = supportedLanguages.includes(deviceLanguage)
        ? deviceLanguage
        : 'en';
    }

    await i18n.use(initReactI18next).init({
      resources,
      lng: savedLanguage,
      fallbackLng: {
        'en-*': ['en'],
        'fr-*': ['fr', 'en'],
        default: ['en'],
      },

      interpolation: {
        escapeValue: false, // React already escapes values
      },

      compatibilityJSON: 'v4', // Using v4 format as expected by react-i18next
    });

    isInitialized = true;
  } catch (error) {
    console.error('Error initializing i18n:', error);
    // Fallback initialization without saved language
    await i18n.use(initReactI18next).init({
      resources,
      lng: 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      compatibilityJSON: 'v4',
    });
    isInitialized = true;
  }
};

export const getI18nInstance = () => {
  if (!isInitialized) {
    console.warn('i18n not initialized yet. Call initI18n() first.');
  }
  return i18n;
};

export default i18n;
