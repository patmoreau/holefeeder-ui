import { getLocales } from 'expo-localization';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, AppStateStatus } from 'react-native';
import { tk } from '@/i18n/translations';

type FormatterHook = {
  currentLocale: string;
  currencyCode: string;
  formatCurrency: (amount: number, options?: { currency?: string; isEditing?: boolean }) => string;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatPercentage: (val: number) => string;
};

export const useLocaleFormatter = (): FormatterHook => {
  const { t } = useTranslation();
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
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - dateObj.getTime());
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 0) {
            return t(tk.common.today);
          } else if (diffDays === 1) {
            return t(tk.common.yesterday);
          } else if (diffDays < 7) {
            return t(tk.common.last7Days, { count: diffDays });
          } else {
            return new Intl.DateTimeFormat(localeInfo.languageTag, {
              dateStyle: 'medium',
              ...options,
            }).format(dateObj);
          }
        } catch {
          return dateObj.toDateString();
        }
      },
      formatPercentage: (val: number) => `${val.toFixed(2)}%`,
    }),
    [localeInfo, t]
  );

  return {
    currentLocale: localeInfo.languageTag,
    currencyCode: localeInfo.currencyCode ?? 'CAD',
    ...helpers,
  };
};
