import { i18n, ValidLocale, ValidLocaleIcon } from '@/i18n/i18n-config';
import { getTranslation } from '@/i18n/getDictionary';

import {
  svgNature,
  svgRadio,
  svgAds,
  svgStats,
  svgDownArrow,
  svgWatch,
  svgFM,
} from '@/public/svg/svgRoot';

export const langSwitcher: ValidLocaleIcon = i18n.localeIcon;
export const getRootScript = async (lang: ValidLocale) => {
  const translate = await getTranslation(lang);

  const rootTranscript = {
    rootPage: {
      hits: translate('rootPage.hits'),
      hitsText: translate('rootPage.hitsText'),
      typeCTA: translate('rootPage.CTA'),
      typeAd: translate('rootPage.typeAd'),
      hotsFM: translate('rootPage.hotsFM'),
      hotsNews: translate('rootPage.hotsNews'),
      winner: translate('rootPage.winner'),
      winnerSharing: translate('rootPage.winnerSharing'),
    },
    common: {
      searchPlaceholder: translate('common.searchPlaceholder'),
      logout: translate('common.logout'),
      desc: translate('common.desc'),
      asc: translate('common.acsc'),
      level: translate('common.level'),
      offline: translate('common.offline'),
    },
    secContent: [
      {
        id: 'typeNature',
        stats: '6.2h',
        transcript: translate('rootPage.typeNature'),
        svg: svgNature,
        textColor: 'text-purple-600',
      },
      {
        id: 'typeRadio',
        stats: '1.8h',
        transcript: translate('rootPage.typeRadio'),
        svg: svgRadio,
        textColor: 'text-blue-600',
      },

      {
        id: 'svgAds',
        stats: '90min',
        transcript: translate('rootPage.typeAds'),
        svg: svgAds,
        textColor: 'text-purple-600',
      },
      {
        id: 'svgStats',
        stats: '53%',
        transcript: translate('rootPage.typeStats'),
        svg: svgStats,
        textColor: 'text-blue-600',
      },
    ],
    selectParts: [
      {
        id: 'GTA3: Chatterbox FM—话匣子',
        transcript: translate('rootPage.hotsFM'),
        svg: svgFM,
        textColor: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
      },
      {
        id: 'NEWS BRIEFING',
        transcript: translate('rootPage.hotsNews'),
        svg: svgWatch,
        textColor: 'text-teal-600',
        bgColor: 'bg-teal-100',
      },
    ],
    svg: {
      DownArrow: svgDownArrow,
    },
  };

  return rootTranscript;
};
