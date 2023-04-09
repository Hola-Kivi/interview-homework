'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

import clsx from 'clsx';
import { Settings, User, Grid, Upload } from 'react-feather';

const icons = { Settings, User, Grid, Upload };

type Props = {
  link: {
    label: string;
    icon: string;
    link: string;
  };
};

const SidebarLink = ({ link }: Props) => {
  const pathname = usePathname();
  let isActive = false;

  if (pathname === link.link) {
    isActive = true;
  }
  const key = link.icon as keyof typeof icons;

  const Icon = icons[key];
  return (
    <div>
      <Link href={link.link} className="">
        <Icon
          size={30}
          className={clsx(
            'stroke-zinc-700 hover:stroke-violet-700 hover:rotate-6 transition duration-200 ease-in-out relative',
            isActive && 'stroke-violet-600'
          )}
        />
      </Link>
    </div>
  );
};

export default SidebarLink;
