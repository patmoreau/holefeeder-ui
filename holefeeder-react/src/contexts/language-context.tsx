import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { initI18n, getI18nInstance } from '@/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants';

type Language = 'en' | 'fr';

interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (language: Language) => Promise<void>;
  t: (key: string, options?: any) => string;
  availableLanguages: { code: Language; name: string }[];
  isInitialized: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const availableLanguages = [
  { code: 'en' as Language, name: 'English' },
  { code: 'fr' as Language, name: 'Français' },
];

// Component to handle i18n initialization
function I18nInitializer({ children }: { children: ReactNode }) {
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initI18n();
        setIsI18nReady(true);
      } catch (error) {
        console.error('Error initializing i18n:', error);
        setIsI18nReady(true); // Still mark as ready to avoid blocking the app
      }
    };

    initialize().catch((error) => {
      console.error('Unhandled error in initialize:', error);
    });
  }, []);

  if (!isI18nReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator testID="loading" size="large" color="#007AFF" />
      </View>
    );
  }

  return <>{children}</>;
}

// Internal component that uses useTranslation after i18n is initialized
function LanguageProviderInternal({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isLanguageReady, setIsLanguageReady] = useState(false);

  const changeLanguage = useCallback(
    async (language: Language) => {
      try {
        await i18n.changeLanguage(language);
        setCurrentLanguage(language);
        await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE_KEY, language);
      } catch (error) {
        console.error('Error changing language:', error);
      }
    },
    [i18n]
  );

  // Load saved language and initialize properly
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(
          STORAGE_KEYS.LANGUAGE_KEY
        );
        const languageToUse =
          (savedLanguage as Language) || (i18n.language as Language) || 'en';

        if (savedLanguage && savedLanguage !== i18n.language) {
          await i18n.changeLanguage(savedLanguage);
        }

        setCurrentLanguage(languageToUse);
        setIsLanguageReady(true);
      } catch (error) {
        console.error('Error loading saved language:', error);
        setCurrentLanguage((i18n.language as Language) || 'en');
        setIsLanguageReady(true);
      }
    };

    initializeLanguage();
  }, [i18n, t]);

  const value: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages,
    isInitialized: isLanguageReady,
  };

  if (!isLanguageReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator testID="loading" size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  return (
    <I18nInitializer>
      <LanguageProviderInternal>{children}</LanguageProviderInternal>
    </I18nInitializer>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
