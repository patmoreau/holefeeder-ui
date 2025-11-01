import { useTranslation } from 'react-i18next';
import { useAppContext } from '@/contexts/AppContext';
import { LanguageState } from '@/types/app-state';

export function useLanguage(): LanguageState {
  const context = useAppContext();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  return {
    currentLanguage: context.currentLanguage,
    setUserLanguage: context.setUserLanguage,
    t,
    availableLanguages: context.availableLanguages,
  };
}
