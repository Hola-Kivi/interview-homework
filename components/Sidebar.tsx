import Card from '@/components/Card';
import SidebarLink from '@/components/SidebarLink';
import { ValidLocale } from '@/i18n/i18n-config';

type Props = {
  lang: ValidLocale;
};

const Sidebar = ({ lang }: Props) => {
  const links = [
    { label: 'Home', icon: 'Grid', link: `/${lang}/` },
    {
      label: 'Upload',
      icon: 'Upload',
      link: `/${lang}/rep-sharing`,
    },
    { label: 'Profile', icon: 'User', link: `#` },
    {
      label: 'Settings',
      icon: 'Settings',
      link: `#`,
    },
  ];

  return (
    <Card className="h-full flex flex-col items-center justify-around">
      {links.map((link) => (
        <SidebarLink key={link.label} link={link} />
      ))}
    </Card>
  );
};

export default Sidebar;
