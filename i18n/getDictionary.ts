import { i18n, ValidLocale } from '@/i18n/i18n-config';

const dictionaries: Record<ValidLocale, any> = {
  en: () =>
    import('@/assets/dictionaries/en/translation.json').then(
      (module) => module.default
    ),
  de: () =>
    import('@/assets/dictionaries/de/translation.json').then(
      (module) => module.default
    ),
  cn: () =>
    import('@/assets/dictionaries/cn/translation.json').then(
      (module) => module.default
    ),
  jp: () =>
    import('@/assets/dictionaries/jp/translation.json').then(
      (module) => module.default
    ),
  es: () =>
    import('@/assets/dictionaries/es/translation.json').then(
      (module) => module.default
    ),
  pt: () =>
    import('@/assets/dictionaries/pt/translation.json').then(
      (module) => module.default
    ),
  fr: () =>
    import('@/assets/dictionaries/fr/translation.json').then(
      (module) => module.default
    ),
  kr: () =>
    import('@/assets/dictionaries/kr/translation.json').then(
      (module) => module.default
    ),
  it: () =>
    import('@/assets/dictionaries/it/translation.json').then(
      (module) => module.default
    ),
} as const;

export const getDictionary = async (locale: ValidLocale) =>
  await dictionaries[locale]();

export const getTranslation = async (locale: ValidLocale = 'en') => {
  let isWrite = !i18n.locales.includes(locale) ? 'en' : locale;

  const dictionary = await dictionaries[isWrite]();

  return (key: string, params?: { [key: string]: string | number }) => {
    let translation = key
      .split('.')
      .reduce((obj, key) => obj && obj[key], dictionary);

    if (!translation) {
      return key;
    }
    if (params && Object.entries(params).length) {
      Object.entries(params).forEach(([key, value]) => {
        translation = translation.replace(`{{ ${key} }}`, String(value));
      });
    }
    return translation;
  };
};
