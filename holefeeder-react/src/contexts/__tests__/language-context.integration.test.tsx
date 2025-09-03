/* eslint-disable */
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage');
jest.mock('expo-localization');
jest.mock('@/i18n', () => ({
  initI18n: jest.fn(),
  getI18nInstance: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockLocalization = Localization as jest.Mocked<typeof Localization>;

// Import the mocked i18n functions
import { initI18n, getI18nInstance } from '@/i18n';
const mockInitI18n = initI18n as jest.MockedFunction<typeof initI18n>;
const mockGetI18nInstance = getI18nInstance as jest.MockedFunction<typeof getI18nInstance>;

import { LanguageProvider, useLanguage } from '../language-context';

// Create a test i18n instance
const createTestI18n = (initialLanguage = 'en') => {
  const testI18n = i18n.createInstance();
  testI18n.use(initReactI18next).init({
    lng: initialLanguage,
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          welcome: 'Welcome',
          hello: 'Hello {{name}}',
          goodbye: 'Goodbye',
        },
      },
      fr: {
        translation: {
          welcome: 'Bienvenue',
          hello: 'Bonjour {{name}}',
          goodbye: 'Au revoir',
        },
      },
    },
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  });
  return testI18n;
};

// Helper function to create complete Locale mock objects
const createLocaleMock = (languageCode: string): Localization.Locale => ({
  languageCode,
  languageTag: languageCode === 'en' ? 'en-US' : 'fr-FR',
  languageScriptCode: languageCode === 'en' ? 'Latn' : 'Latn',
  regionCode: languageCode === 'en' ? 'US' : 'FR',
  languageRegionCode: languageCode === 'en' ? 'en-US' : 'fr-FR',
  currencyCode: languageCode === 'en' ? 'USD' : 'EUR',
  currencySymbol: languageCode === 'en' ? '$' : '€',
  languageCurrencyCode: languageCode === 'en' ? 'USD' : 'EUR',
  languageCurrencySymbol: languageCode === 'en' ? '$' : '€',
  decimalSeparator: languageCode === 'en' ? '.' : ',',
  digitGroupingSeparator: languageCode === 'en' ? ',' : ' ',
  textDirection: 'ltr' as const,
  measurementSystem: 'metric' as const,
  temperatureUnit: 'celsius' as const,
});

// Test component that uses the LanguageContext
const TestComponent: React.FC = () => {
  const {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages,
    isInitialized,
  } = useLanguage();

  if (!isInitialized) {
    return <Text testID="loading">Loading...</Text>;
  }

  return (
    <>
      <Text testID="current-language">{currentLanguage}</Text>
      <Text testID="welcome-text">{t('welcome')}</Text>
      <Text testID="hello-text">{t('hello', { name: 'John' })}</Text>
      <Text testID="goodbye-text">{t('goodbye')}</Text>
      <Text testID="available-languages">{availableLanguages.length}</Text>
      <Text testID="change-to-french" onPress={() => changeLanguage('fr')}>
        Change to French
      </Text>
      <Text testID="change-to-english" onPress={() => changeLanguage('en')}>
        Change to English
      </Text>
    </>
  );
};

// Test wrapper that provides i18n context
const TestWrapper: React.FC<{ children: React.ReactNode; testI18n: any }> = ({
  children,
  testI18n,
}) => <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>;

describe('LanguageContext Integration Tests', () => {
  let testI18n: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create fresh i18n instance for each test
    testI18n = createTestI18n();

    // Mock the i18n module functions to use our test instance
    mockInitI18n.mockResolvedValue(undefined);
    mockGetI18nInstance.mockReturnValue(testI18n);

    // Default mock implementations
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue();

    // Set default locale mock - can be overridden per test
    mockLocalization.getLocales.mockReturnValue([createLocaleMock('en')]);
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('should initialize with device locale when no saved language exists', async () => {
    mockLocalization.getLocales.mockReturnValue([createLocaleMock('fr')]);

    // Create a test i18n instance that starts with French to match device locale
    const frenchTestI18n = createTestI18n('fr');

    // Update the mock to return our French-initialized instance
    mockGetI18nInstance.mockReturnValue(frenchTestI18n);

    render(
      <TestWrapper testI18n={frenchTestI18n}>
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      </TestWrapper>
    );

    // Wait for initialization
    await waitFor(() => {
      expect(screen.getByTestId('current-language')).toBeTruthy();
    }, { timeout: 5000 });

    // Should use French from device locale
    expect(screen.getByTestId('current-language')).toHaveTextContent('fr');
    expect(screen.getByTestId('welcome-text')).toHaveTextContent('Bienvenue');
    expect(screen.getByTestId('hello-text')).toHaveTextContent('Bonjour John');
  });

  it('should initialize with saved language preference', async () => {
    mockAsyncStorage.getItem.mockResolvedValue('fr');

    // Create a test i18n instance that starts with French to match saved preference
    const frenchTestI18n = createTestI18n('fr');
    mockGetI18nInstance.mockReturnValue(frenchTestI18n);

    render(
      <TestWrapper testI18n={frenchTestI18n}>
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-language')).toBeTruthy();
    });

    expect(screen.getByTestId('current-language')).toHaveTextContent('fr');
    expect(screen.getByTestId('welcome-text')).toHaveTextContent('Bienvenue');
    expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('@app_language');
  });

  it('should fallback to English for unsupported device locale', async () => {
    mockLocalization.getLocales.mockReturnValue([createLocaleMock('es')]);

    render(
      <TestWrapper testI18n={testI18n}>
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-language')).toBeTruthy();
    });

    expect(screen.getByTestId('current-language')).toHaveTextContent('en');
    expect(screen.getByTestId('welcome-text')).toHaveTextContent('Welcome');
  });

  it('should change language and persist the choice', async () => {
    render(
      <TestWrapper testI18n={testI18n}>
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-language')).toBeTruthy();
    });

    // Initially English
    expect(screen.getByTestId('current-language')).toHaveTextContent('en');
    expect(screen.getByTestId('welcome-text')).toHaveTextContent('Welcome');

    // Change to French
    await act(async () => {
      const changeFrenchButton = screen.getByTestId('change-to-french');
      changeFrenchButton.props.onPress();
    });

    await waitFor(() => {
      expect(screen.getByTestId('current-language')).toHaveTextContent('fr');
    });

    expect(screen.getByTestId('welcome-text')).toHaveTextContent('Bienvenue');
    expect(screen.getByTestId('hello-text')).toHaveTextContent('Bonjour John');
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      '@app_language',
      'fr'
    );

    // Change back to English
    await act(async () => {
      const changeEnglishButton = screen.getByTestId('change-to-english');
      changeEnglishButton.props.onPress();
    });

    await waitFor(() => {
      expect(screen.getByTestId('current-language')).toHaveTextContent('en');
    });

    expect(screen.getByTestId('welcome-text')).toHaveTextContent('Welcome');
    expect(screen.getByTestId('hello-text')).toHaveTextContent('Hello John');
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      '@app_language',
      'en'
    );
  });

  it('should provide available languages', async () => {
    render(
      <TestWrapper testI18n={testI18n}>
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('available-languages')).toBeTruthy();
    });

    expect(screen.getByTestId('available-languages')).toHaveTextContent('2');
  });

  it('should handle initialization errors gracefully', async () => {
    mockAsyncStorage.getItem.mockRejectedValue(new Error('AsyncStorage error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(
      <TestWrapper testI18n={testI18n}>
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-language')).toBeTruthy();
    });

    // Should still initialize and work with fallback
    expect(screen.getByTestId('current-language')).toHaveTextContent('en');
    expect(screen.getByTestId('welcome-text')).toHaveTextContent('Welcome');

    consoleSpy.mockRestore();
  });

  it('should handle language change errors gracefully', async () => {
    render(
      <TestWrapper testI18n={testI18n}>
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-language')).toBeTruthy();
    });

    // Mock AsyncStorage error during language change
    mockAsyncStorage.setItem.mockRejectedValue(new Error('Save error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await act(async () => {
      const changeFrenchButton = screen.getByTestId('change-to-french');
      changeFrenchButton.props.onPress();
    });

    await waitFor(() => {
      expect(screen.getByTestId('current-language')).toHaveTextContent('fr');
    });

    // Language should still change even if saving fails
    expect(screen.getByTestId('welcome-text')).toHaveTextContent('Bienvenue');

    consoleSpy.mockRestore();
  });

  it('should throw error when useLanguage is used outside provider', () => {
    const TestComponentOutsideProvider = () => {
      try {
        useLanguage();
        return <Text testID="should-not-render">Should not render</Text>;
      } catch (error) {
        return <Text testID="error-message">{(error as Error).message}</Text>;
      }
    };

    render(
      <TestWrapper testI18n={testI18n}>
        <TestComponentOutsideProvider />
      </TestWrapper>
    );

    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'useLanguage must be used within a LanguageProvider'
    );
  });

  it('should handle interpolation in translations', async () => {
    render(
      <TestWrapper testI18n={testI18n}>
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('hello-text')).toBeTruthy();
    });

    expect(screen.getByTestId('hello-text')).toHaveTextContent('Hello John');

    // Change to French and verify interpolation works
    await act(async () => {
      const changeFrenchButton = screen.getByTestId('change-to-french');
      changeFrenchButton.props.onPress();
    });

    await waitFor(() => {
      expect(screen.getByTestId('hello-text')).toHaveTextContent(
        'Bonjour John'
      );
    });
  });
});
