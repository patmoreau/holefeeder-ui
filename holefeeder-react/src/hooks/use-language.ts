import { useAppContext } from '@/contexts';
import { LanguageState } from '@/types';

export function useLanguage(): LanguageState {
  const context = useAppContext();
  return {
    currentLanguage: context.currentLanguage,
    changeLanguage: context.changeLanguage,
    t: context.t,
    availableLanguages: context.availableLanguages,
  };
}
