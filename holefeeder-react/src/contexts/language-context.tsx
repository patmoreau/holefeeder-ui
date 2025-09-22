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
import { initI18n } from '@/i18n';
import { useAppContext } from '@/contexts/app-context';

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

// Internal component that uses useTranslation after i18n is initialized
function LanguageProviderInternal({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation();
  const { updateSettings } = useAppContext();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const changeLanguage = useCallback(
    async (language: Language) => {
      try {
        await i18n.changeLanguage(language);
        setCurrentLanguage(language);
        await updateSettings({ language });
      } catch (error) {
        console.error('Error changing language:', error);
      }
    },
    [i18n, updateSettings]
  );

  // Sync current language with i18n state
  useEffect(() => {
    const currentLang = (i18n.language as Language) || 'en';
    setCurrentLanguage(currentLang);
  }, [i18n.language]);

  const value: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages,
    isInitialized: true,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { settings, isSettingsLoaded } = useAppContext();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      // Only initialize once settings are loaded from storage
      if (!isSettingsLoaded) return;

      try {
        await initI18n(settings.language);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing language:', error);
        setIsInitialized(true);
      }
    };

    initialize();
  }, [settings.language, isSettingsLoaded]);

  if (!isSettingsLoaded || !isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator testID="loading" size="large" color="#007AFF" />
      </View>
    );
  }

  return <LanguageProviderInternal>{children}</LanguageProviderInternal>;
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
