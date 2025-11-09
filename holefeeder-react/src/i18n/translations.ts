import { en } from '@/i18n/locales/en-CA/translations';

type RecursiveRecord<T> = {
  [K in keyof T]: T[K] extends string ? string : RecursiveRecord<T[K]>;
};

export type TranslationStructure = RecursiveRecord<typeof en>;

type BuildLangObject<T, Path extends string = ''> = {
  [K in keyof T]: T[K] extends string
    ? Path extends ''
      ? K
      : `${Path}.${K & string}`
    : BuildLangObject<T[K], Path extends '' ? K & string : `${Path}.${K & string}`>;
};

function createLangObject<T extends Record<string, any>>(obj: T, prefix = ''): any {
  const result: any = {};

  for (const key in obj) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === 'string') {
      result[key] = path;
    } else {
      result[key] = createLangObject(obj[key], path);
    }
  }

  return result;
}

export const tk = createLangObject(en) as BuildLangObject<typeof en>;
