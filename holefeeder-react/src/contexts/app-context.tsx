import * as SystemUI from 'expo-system-ui';
import i18n, { changeLanguage } from 'i18next';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Appearance, StyleSheet, View } from 'react-native';
import { useAuth } from '@/hooks/use-auth';
import { initI18n } from '@/i18n';
import { AppSettings, AppState, darkTheme, initialSettings, LanguageType, lightTheme, ThemeMode, UserProfile } from '@/types';
import { Storage } from '@/utils';

export const AppContext = createContext<AppState | null>(null);

const availableThemeModes = [
  { code: 'system' as ThemeMode, langId: 'system' },
  { code: 'light' as ThemeMode, langId: 'light' },
  { code: 'dark' as ThemeMode, langId: 'dark' },
];

const availableLanguages = [
  { code: 'en' as LanguageType, name: 'English' },
  { code: 'fr' as LanguageType, name: 'Français' },
];

export const initialProfile: UserProfile = {
  name: '',
  username: '',
  email: '',
  avatar: 'person.fill',
};

function AppProviderContent({ children, loadedSettings }: { children: ReactNode; loadedSettings: AppSettings }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [settings, setSettings] = useState<AppSettings>(loadedSettings);
  const [systemColorScheme, setSystemColorScheme] = useState(Appearance.getColorScheme());
  const [currentLanguage, setCurrentLanguage] = useState<LanguageType>((i18n.language as LanguageType) || 'en');

  // Listen for system appearance changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });
    return () => subscription?.remove();
  }, []);

  // Update profile when a user changes
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

  const getCurrentTheme = useCallback(() => {
    if (settings.themeMode === 'system') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return settings.themeMode === 'dark' ? darkTheme : lightTheme;
  }, [settings.themeMode, systemColorScheme]);

  // Update system UI when theme changes
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(getCurrentTheme().colors.systemBackground).then((_) => {});
  }, [settings.themeMode, systemColorScheme, getCurrentTheme]);

  const updateSettings = useCallback(
    async (updates: Partial<AppSettings>) => {
      const newSettings = { ...settings, ...updates };
      setSettings(newSettings);
      await Storage().saveSettings(newSettings);
    },
    [settings]
  );

  const changeThemeMode = useCallback(
    async (themeMode: ThemeMode) => {
      try {
        Appearance.setColorScheme(themeMode === 'system' ? undefined : themeMode);
        await updateSettings({ themeMode });
      } catch (error) {
        console.error('Error changing theme:', error);
      }
    },
    [updateSettings]
  );

  const setUserLanguage = useCallback(
    async (language: LanguageType) => {
      try {
        await changeLanguage(language);
        setCurrentLanguage(language);
        await updateSettings({ language });
      } catch (error) {
        console.error('Error changing language:', error);
      }
    },
    [updateSettings]
  );

  const value: AppState = {
    // Original app state
    profile,
    updateProfile: (updates: Partial<UserProfile>) => {
      setProfile((prev) => ({ ...prev, ...updates }));
    },
    settings,
    updateSettings,
    isSettingsLoaded: true,

    // Theme
    theme: getCurrentTheme(),
    isDark: getCurrentTheme() === darkTheme,
    changeThemeMode,
    availableThemeModes,
    themeMode: settings.themeMode,

    // Language
    currentLanguage,
    setUserLanguage,
    t,
    availableLanguages,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadedSettings, setLoadedSettings] = useState<AppSettings>(initialSettings);

  // Initialize everything at once
  useEffect(() => {
    const initialize = async () => {
      try {
        // Load settings
        const loadedSettings = await Storage().loadSettings();

        // Initialize i18n
        await initI18n(loadedSettings.language);

        // Set theme
        Appearance.setColorScheme(loadedSettings.themeMode === 'system' ? undefined : loadedSettings.themeMode);

        setLoadedSettings(loadedSettings);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsInitialized(true);
      }
    };

    initialize().then((_) => {});
  }, []);

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator testID="loading" size="large" color="#007AFF" />
      </View>
    );
  }

  return <AppProviderContent loadedSettings={loadedSettings}>{children}</AppProviderContent>;
}

export function useAppContext(): AppState {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppProvider');
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
