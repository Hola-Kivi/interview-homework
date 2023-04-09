import { NextSeo } from 'next-seo';

import { NEXT_SEO_DEFAULT } from '@/seo/NEXT_SEO_DEFAULT';

export default async function Head() {
  const updateMeta = {
    ...NEXT_SEO_DEFAULT,
    title: 'Home Page',
    description: 'Home description',
  };
  return <NextSeo {...updateMeta} useAppDir={true} />;
}
