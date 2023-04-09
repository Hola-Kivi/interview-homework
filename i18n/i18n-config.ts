export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'de', 'cn', 'jp', 'es', 'pt', 'fr', 'kr', 'it'],
  localeIconA: [
    {
      lng: 'English',
      icon: 'fi fi-us',
      locale: 'en',
    },
    {
      lng: 'Deutsch',
      icon: 'fi fi-de',
      locale: 'de',
    },
    {
      lng: '中文',
      icon: 'fi fi-cn',
      locale: 'cn',
    },
    {
      lng: '日本語',
      icon: 'fi fi-jp',
      locale: 'jp',
    },
    {
      lng: 'Español',
      icon: 'fi fi-es',
      locale: 'es',
    },
    {
      lng: 'Português',
      icon: 'fi fi-pt',
      locale: 'pt',
    },
    {
      lng: 'Français',
      icon: 'fi fi-fr',
      locale: 'fr',
    },
    {
      lng: '한국어',
      icon: 'fi fi-kr',
      locale: 'kr',
    },
    {
      lng: 'Italiano',
      icon: 'fi fi-it',
      locale: 'it',
    },
  ],
  navHeader: ['About', 'Services', 'Pricing', 'Contact'],
} as const;

export const languages = [
  'en',
  'de',
  'cn',
  'jp',
  'es',
  'pt',
  'fr',
  'kr',
  'it',
] as const;
export type ValidLocale = typeof i18n.locales[number];
export type ValidLocaleIcon = typeof i18n.localeIconA;
export type Locale = typeof i18n['locales'][number];
