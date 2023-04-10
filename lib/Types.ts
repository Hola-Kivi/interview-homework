import { ValidLocale, ValidLocaleIcon } from '@/i18n/i18n-config';
import { Task } from '@prisma/client';
import { ReactNode } from 'react';

export type langProps = {
  children?: ReactNode;
  user?: {
    firstName: string;
  };
  params: {
    lang: ValidLocale;
  };
  lang: ValidLocale;
};

export type taskProps = {
  title: string;
  lang: ValidLocale;
  tasks: Task[];
};

export type headerProps = {
  lang: string | undefined;
  userId: string;
  langsIcon: ValidLocaleIcon;
  headerTranscript: any;
};
