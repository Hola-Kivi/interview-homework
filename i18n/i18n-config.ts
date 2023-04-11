export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'de', 'cn', 'jp', 'es', 'pt', 'fr', 'kr', 'it'],
  localeIcon: [
    {
      lng: 'English',
      icon: 'fi fi-us',
      locale: 'en',
      underline: 'no-underline',
    },
    {
      lng: 'Deutsch',
      icon: 'fi fi-de',
      locale: '#',
      underline: 'line-through',
    },
    {
      lng: '中文',
      icon: 'fi fi-cn',
      locale: 'cn',
      underline: 'no-underline',
    },
    {
      lng: '日本語',
      icon: 'fi fi-jp',
      locale: '#',
      underline: 'line-through',
    },
    {
      lng: 'Español',
      icon: 'fi fi-es',
      locale: '#',
      underline: 'line-through',
    },
    {
      lng: 'Português',
      icon: 'fi fi-pt',
      locale: '#',
      underline: 'line-through',
    },
    {
      lng: 'Français',
      icon: 'fi fi-fr',
      locale: '#',
      underline: 'line-through',
    },
    {
      lng: '한국어',
      icon: 'fi fi-kr',
      locale: '#',
      underline: 'line-through',
    },
    {
      lng: 'Italiano',
      icon: 'fi fi-it',
      locale: '#',
      underline: 'line-through',
    },
  ],
  navHeader: ['About', 'Services', 'Pricing', 'Contact'],
} as const;

export type ValidLocale = typeof i18n.locales[number];
export type ValidLocaleIcon = typeof i18n.localeIcon;
export type Locale = typeof i18n['locales'][number];

export const textList = [
  '你好世界',
  'Hello World',
  'こんにちは世界',
  'Ciao mondo',
  '헬로 월드',
  'Hello Mundo',
  'Hallo Welt',
  'สวัสดีชาวโลก',
  'Molo Lizwe',
  'Chào thế giới',
  'مرحبا بالعالم',
];
