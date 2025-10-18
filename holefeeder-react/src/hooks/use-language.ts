import { useAppContext } from '@/contexts';
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
