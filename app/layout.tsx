import type { Metadata } from 'next';
import './globals.css';
import { SiteProvider } from '@/context/SiteContext';
import { SiteChrome } from '@/components/chrome/SiteChrome';
import { getSiteData } from '@/lib/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Hotel Valentino · Main Road, Maijdee Court, Noakhali',
  description:
    'Hotel Valentino, Main Road, Maijdee Court, Noakhali. Eight room categories from BDT 2,500, 24 hour reception, and the Sky View rooftop restaurant.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { rooms, addons, settings } = await getSiteData();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;700;800&family=JetBrains+Mono:wght@400&family=Noto+Sans+Bengali:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteProvider rooms={rooms} addons={addons} settings={settings}>
          <SiteChrome>{children}</SiteChrome>
        </SiteProvider>
      </body>
    </html>
  );
}
