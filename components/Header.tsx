'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

import { logout } from '@/lib/api';
import { headerProps } from '@/lib/Types';
import Button from '@/components/Button';
import { GlobalIcon } from '@/public/svg/svgRoot';
import classNames from 'classnames';

export default function Header({
  lang,
  userId,
  langsIcon,
  headerTranscript,
}: headerProps) {
  const pathName = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [userStatus, setUserStatus] = useState('');

  useEffect(() => {
    setUserStatus(userId);
  }, []);

  const redirectedPathName = (locale: string) => {
    if (!pathName) return `/${lang}`;

    const segments = pathName.split('/');

    segments[1].length === 2 ? (segments[1] = locale) : (segments[0] = locale);

    return segments.join('/');
  };

  const logoutHandler = async () => {
    await logout();

    return router.push(`/${lang}/home`);
  };

  const userIconPath = userId ? `/${lang}` : `/${lang}/login`;

  return (
    <header className="top-0 flex justify-center py-2">
      <div className="flex-1 text-center">
        <Button
          onClick={() => router.push(userIconPath)}
          className="hover:scale-100"
          intent="text"
        >
          <span className="sr-only">User Menu</span>
          <div className="hidden md:inline-block">
            <span className="font-semibold">
              Hi, {userStatus || headerTranscript.offline}
            </span>
          </div>
        </Button>
      </div>

      <div className="ml-auto">
        <Button
          onClick={() => setIsOpen((prev) => !prev)}
          className="hover:fill-gray-600 active:fill-gray-600"
          intent="text"
        >
          <GlobalIcon />
        </Button>

        {isOpen && (
          <div className="glass absolute z-20 top-16 right-14 w-40 shadow leading-3 rounded-lg">
            <div className="p-3">
              {langsIcon.map((item) => (
                <div
                  className="flex items-center justify-between mx-2 mb-2"
                  key={item.lng}
                >
                  <Link
                    className={classNames('text-sm', item.underline)}
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

        <Button className="hover:text-gray-600" intent="text">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </Button>

        <Button
          onClick={() => logoutHandler()}
          className="hover:text-gray-600"
          intent="text"
        >
          <span className="sr-only">Log out</span>
          <svg
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </Button>
      </div>
    </header>
  );
}
