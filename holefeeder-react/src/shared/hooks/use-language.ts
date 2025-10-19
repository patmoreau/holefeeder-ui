import { useAppContext } from '@/contexts/AppContext';
import { LanguageState } from '@/types/app-state';

export function useLanguage(): LanguageState {
  const context = useAppContext();
  return {
    currentLanguage: context.currentLanguage,
    setUserLanguage: context.setUserLanguage,
    t: context.t,
    availableLanguages: context.availableLanguages,
  };
}
