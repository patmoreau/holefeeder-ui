/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/**
 * Initializes a mock i18n instance for testing purposes.
 * @param ns - Namespace for translations.
 * @param debug - Enable debug mode for i18next.
 * @returns Initialized i18n instance.
 * @example
 * const i18nInstance = i18nForTest('translations');
 * i18nInstance.addResourceBundle('en', 'translations', { key: 'value' });
 * render(<I18nextProvider i18n={i18nInstance}></I18nextProvider>);
 */
const i18nForTest = (ns: string, debug: boolean = false) => {
  i18n
    .use(initReactI18next)
    .init({
      initAsync: false,
      lng: 'en',
      ns: [ns],
      defaultNS: ns,
      resources: { en: { [ns]: {} } },
      debug,
    })
    .then();
  return i18n;
};
export default i18nForTest;
