import { LanguageState } from '@/types/app-state';

const defaultState = (): LanguageState => ({
  currentLanguage: 'en',
  setUserLanguage: (_) => Promise.resolve(),
  t: (key, __?) => key,
  availableLanguages: [{ code: 'en', name: 'en_CA' }],
});

export const aLanguageState = (overrides: Partial<LanguageState> = {}) => ({
  ...defaultState(),
  ...overrides,
});
