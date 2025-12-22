import { getLocales } from 'expo-localization';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

type FormatterHook = {
  currentLocale: string;
  currencyCode: string;
  formatCurrency: (amount: number, options?: { currency?: string; isEditing?: boolean }) => string;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatPercentage: (val: number) => string;
};

export const useLocaleFormatter = (): FormatterHook => {
  const [localeInfo, setLocaleInfo] = useState(getLocales()[0]);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        const newLocale = getLocales()[0];

        if (newLocale.languageTag !== localeInfo.languageTag) {
          setLocaleInfo(newLocale);
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [localeInfo.languageTag]);

  const helpers = useMemo(
    () => ({
      formatCurrency: (amount: number, options?: { currency?: string; isEditing?: boolean }) => {
        const { currency = localeInfo.currencyCode ?? 'CAD', isEditing = false } = options ?? {};
        const safeCurrency = currency || 'CAD';

        try {
          return isEditing
            ? amount.toFixed(2)
            : new Intl.NumberFormat(localeInfo.languageTag, {
                style: 'currency',
                currency: safeCurrency,
              }).format(amount);
        } catch {
          return `${amount} ${safeCurrency}`;
        }
      },
      formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
        const dateObj = new Date(date);
        try {
          return new Intl.DateTimeFormat(localeInfo.languageTag, {
            dateStyle: 'medium',
            ...options,
          }).format(dateObj);
        } catch {
          return dateObj.toDateString();
        }
      },
      formatPercentage: (val: number) => `${val.toFixed(2)}%`,
    }),
    [localeInfo]
  );

  return {
    currentLocale: localeInfo.languageTag,
    currencyCode: localeInfo.currencyCode ?? 'CAD',
    ...helpers,
  };
};
