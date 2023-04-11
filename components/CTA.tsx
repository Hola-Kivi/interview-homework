import Link from 'next/link';

import Button from '@/components/Button';
import Card from '@/components/Card';

interface ctaParams {
  rootCTA: {
    hits: string;
    hitsText: string;
    typeCTA: string;
  };
  lang: string;
}

export default function CTA({ rootCTA, lang }: ctaParams) {
  return (
    <Card className="flex p-2 justify-between items-center md:space-y-0 md:flex-row">
      <div className="m-2">
        <h1 className="text-xl font-semibold mb-2 md:text-2xl">
          {rootCTA.hits}
        </h1>
        <h2 className="hidden text-gray-600 sm:inline-block">
          {rootCTA.hitsText}
        </h2>
      </div>
      <Link href={`${lang}/home`}>
        <Button className="rounded-xl text-sm md:text-xl">
          {rootCTA.typeCTA}
        </Button>
      </Link>
    </Card>
  );
}
