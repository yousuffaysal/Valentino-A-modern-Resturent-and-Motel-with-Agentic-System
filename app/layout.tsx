import type { Metadata } from 'next';
import './globals.css';
import { SiteProvider } from '@/context/SiteContext';
import { SiteChrome } from '@/components/chrome/SiteChrome';
import { getSiteData } from '@/lib/content';

export const dynamic = 'force-dynamic';

const SITE_URL = 'https://valentino-a-modern-resturent-and-mo.vercel.app';

/** Short enough to survive a search-result snippet without being cut mid-clause. */
const DESCRIPTION =
  'Hotel Valentino, Main Road, Maijdee Court, Noakhali — eight room categories from BDT 2,500, 24 hour reception and the Sky View rooftop restaurant. Book by chat with an AI reception desk, in English or বাংলা.';

/** The full story, for link previews and share cards where there is room for it. */
const LONG_DESCRIPTION =
  'Hotel Valentino, Main Road, Maijdee Court, Noakhali — eight room categories from BDT 2,500, 24 hour reception and the Sky View rooftop restaurant serving Chinese, Japanese and Korean. ' +
  'An agentic AI reception desk, running Llama 3.3 70B on Groq, holds a real conversation: it reads live room rates, parses dates like "next month 21 to 23", collects guest details across turns and hands a completed booking to the checkout panel. ' +
  'Behind it, a Next.js 14 App Router backend with typed REST routes for availability, bookings, reservations, messages, content and settings, persisted to Neon serverless Postgres through Prisma. ' +
  'A password-gated admin dashboard runs the property end to end across seven panels — dashboard, bookings, room management, Sky View menu, gallery, messages and site settings — with every edit flowing straight back to the public pages. ' +
  'The interface is a scroll-driven, bilingual (English/বাংলা) motion design: smooth scroll, a pinned floor rail, word-by-word reveals and a pinned room track, all responsive down to mobile.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  /* No `template` here: every child page already ends in "· Hotel Valentino". */
  title: 'Hotel Valentino · Main Road, Maijdee Court, Noakhali',
  description: DESCRIPTION,
  applicationName: 'Hotel Valentino',
  category: 'travel',
  keywords: [
    // the property
    'Hotel Valentino',
    'hotel in Noakhali',
    'Maijdee Court hotel',
    'Noakhali hotel booking',
    'Sky View rooftop restaurant',
    'Chinese Japanese Korean restaurant Noakhali',
    'hotel booking Bangladesh',
    // the agentic layer
    'agentic AI',
    'AI reception desk',
    'AI booking assistant',
    'conversational booking',
    'LLM agent',
    'Groq',
    'Llama 3.3 70B',
    'AI concierge',
    // the backend
    'Next.js 14 App Router',
    'React server components',
    'Prisma ORM',
    'Neon serverless Postgres',
    'typed REST API',
    'full-stack TypeScript',
    // the admin side
    'admin dashboard',
    'hotel management system',
    'property management dashboard',
    'booking management',
    'CMS',
    'invoice generation',
    // the front of house
    'modern web design',
    'scroll-driven animation',
    'smooth scroll',
    'motion design',
    'bilingual website',
    'English Bengali site',
    'responsive design',
  ],
  authors: [{ name: 'YusuF Faisal' }],
  creator: 'YusuF Faisal',
  publisher: 'Hotel Valentino',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Hotel Valentino',
    title: 'Hotel Valentino · Maijdee Court, Noakhali',
    description: LONG_DESCRIPTION,
    locale: 'en_US',
    alternateLocale: 'bn_BD',
    images: [
      {
        url: '/img/exterior-night-hero.png',
        width: 1536,
        height: 1024,
        alt: 'Hotel Valentino at dusk, the lit Sky View restaurant on the roof above the guest floors',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hotel Valentino · Maijdee Court, Noakhali',
    description: DESCRIPTION,
    images: ['/img/exterior-night-hero.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  other: {
    'ai:reception': 'Agentic AI reception desk — Llama 3.3 70B on Groq, live rates, multi-turn booking handoff to checkout',
    'stack:frontend': 'Next.js 14 App Router, React 18, TypeScript, Lenis smooth scroll, scroll-driven motion system',
    'stack:backend': 'Next.js route handlers, Prisma ORM, Neon serverless Postgres',
    'stack:admin': 'Password-gated admin dashboard — bookings, rooms, menu, gallery, messages, settings, invoices',
    'site:languages': 'English, বাংলা',
  },
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
