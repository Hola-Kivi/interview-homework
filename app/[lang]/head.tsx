import { NextSeo } from 'next-seo';

import { NEXT_SEO_DEFAULT } from '@/seo/NEXT_SEO_DEFAULT';
import { VideoProps } from './(dashboard)/post/[id]/page';

export default function Head(req: VideoProps) {
  const updateMeta = {
    ...NEXT_SEO_DEFAULT,
    openGraph: {
      type: 'website',
      url: 'https://www.url.ie/b',
      title: 'OG Title',
      locale: req.params.lang,
      description: 'OG Decription',
      siteName: 'Example',
    },
  };

  return (
    <>
      <NextSeo
        {...updateMeta}
        useAppDir={true}
        // additionalLinkTags={[
        //   {
        //     rel: 'icon',
        //     href: 'https://www.test.ie/favicon.ico',
        //   },
        // ]}
      />
      <title>InterviewDemo-JSON-LD</title>
    </>
  );
}
