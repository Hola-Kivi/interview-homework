import '@/styles/global.css';
import { Inter } from '@next/font/google';
import '/node_modules/flag-icons/css/flag-icons.min.css';

import Sidebar from '@/components/Sidebar';
import { langProps } from '@/lib/Types';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default async function DashboardRootLayout({
  children,
  params,
}: langProps) {
  return (
    <div className="h-full flex">
      <aside className="h-full hidden sm:block sm:w-14 md:w-16 xl:w-32 shrink-0">
        <Sidebar lang={params.lang} />
      </aside>
      <main className="h-full mx-auto w-11/12">{children}</main>
    </div>
  );
}
