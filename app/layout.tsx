import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AIChatDrawer } from '@/components/AIChatDrawer';

export const metadata: Metadata = {
  title: 'Hotel Valentino & Sky View Restaurant | Maijdee Court, Noakhali',
  description: 'A modern luxury hotel and rooftop restaurant located at Boro Masjid Moar, Maijdee Court, Sadar, Noakhali-3800, Bangladesh. Phone: +880 1795 855555.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>
          {children}
          <AIChatDrawer />
        </LanguageProvider>
      </body>
    </html>
  );
}
