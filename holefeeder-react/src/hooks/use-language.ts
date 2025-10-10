import { useAppContext } from '@/contexts';
import { LanguageState } from '@/types';

export function useLanguage(): LanguageState {
  const context = useAppContext();
  return {
    currentLanguage: context.currentLanguage,
    setUserLanguage: context.setUserLanguage,
    t: context.t,
    availableLanguages: context.availableLanguages,
  };
}
