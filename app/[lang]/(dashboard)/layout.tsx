import '@/styles/global.css';
import '/node_modules/flag-icons/css/flag-icons.min.css';

import Sidebar from '@/components/Sidebar';
import { langProps } from '@/lib/Types';

export default async function DashboardRootLayout({
  children,
  params,
}: langProps) {
  return (
    <div className="h-full flex items-center">
      <aside className="h-5/6 hidden sm:block sm:w-14 md:w-16 xl:w-32 shrink-0">
        <Sidebar lang={params.lang} />
      </aside>
      <main className="h-full mx-auto w-11/12">{children}</main>
    </div>
  );
}
