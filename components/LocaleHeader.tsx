'use client';

import { useState } from 'react';
import Link from 'next/link';
import classNames from 'classnames';

import { usePathname } from 'next/navigation';
import { ValidLocaleIcon } from '@/i18n/i18n-config';

import Button from '@/components/Button';
import { GlobalIcon } from '@/public/svg/svgRoot';

type dictionaryType = {
  dictionary: {
    product: string;
    support: string;
    explore: string;
    business: string;
  };
  langsIcon: ValidLocaleIcon;
};

export default function LocaleHeader({
  langsIcon,
  dictionary,
}: dictionaryType) {
  const pathName = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const redirectedPathName = (locale: string) => {
    if (!pathName) return '/';

    const segments = pathName.split('/');

    segments[1].length === 2 ? (segments[1] = locale) : (segments[0] = locale);

    return segments.join('/');
  };

  return (
    <header className="sticky top-0 z-30 w-full flex items-center justify-between p-4 rounded-2xl">
      <div className="hidden flex-1 items-center justify-center space-x-8 sm:flex">
        <Link href="#">{dictionary.product}</Link>
        <Link href="#">{dictionary.explore}</Link>
        <Link href="#">{dictionary.support}</Link>
        <Link href="#">{dictionary.business}</Link>
      </div>
      <div className="text-center md:w-1/5">
        <Button
          onClick={() => setIsOpen((prev) => !prev)}
          className="hover:fill-gray-600 text-left absolute top-4 right-2"
          intent="text"
        >
          <GlobalIcon />
        </Button>

        {isOpen && (
          <div className="glass absolute z-10 top-14 right-8 w-40 shadow leading-3 rounded-lg">
            <div className="p-3">
              {langsIcon.map((item) => (
                <div
                  className={classNames(
                    'flex items-center justify-between hover:underline-offset-1 mx-2 mb-2',
                    item.underline
                  )}
                  key={item.lng}
                >
                  <Link
                    className="text-sm"
                    href={redirectedPathName(item.locale)}
                  >
                    {item.lng}
                  </Link>
                  <span className={item.icon}></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
