import { Inter } from '@next/font/google';
import '/node_modules/flag-icons/css/flag-icons.min.css';
import '@/styles/global.css';

import { langProps } from '@/lib/Types';
import GlassPane from '@/components/GlassPane';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default async function RootLayout({ children, params }: langProps) {
  return (
    <html lang={params.lang} className={inter.variable}>
      <body className="h-screen rainbow-mesh p-6 ">
        <GlassPane className="h-full overflow-hidden">{children}</GlassPane>
        <div id="modal"></div>
      </body>
    </html>
  );
}
