import { useTranslation } from 'react-i18next';
import { useAppContext } from '@/contexts/AppContext';
import { LanguageState } from '@/types/app-state';

export function useLanguage(): LanguageState {
  const context = useAppContext();
  const { t } = useTranslation();

  return {
    currentLanguage: context.currentLanguage,
    setUserLanguage: context.setUserLanguage,
    t,
    availableLanguages: context.availableLanguages,
  };
}
