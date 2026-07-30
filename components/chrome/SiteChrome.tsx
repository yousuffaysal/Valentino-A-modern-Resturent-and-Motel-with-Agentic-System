'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { css } from '@/lib/css';
import { MotionRoot } from '@/components/motion/MotionRoot';
import { Header } from '@/components/chrome/Header';
import { Footer } from '@/components/chrome/Footer';
import { MobileBar, WhatsAppFab } from '@/components/chrome/MobileBar';
import { PageWipe } from '@/components/chrome/PageWipe';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { BookingPanel } from '@/components/booking/BookingPanel';

/** Everything wrapped around a page. The admin portal runs without site chrome. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') ?? false;

  return (
    <div style={css('position:relative;background:var(--limestone)')}>
      {!isAdmin && (
        <a
          href="#main"
          style={css('position:absolute;left:-9999px;top:0;z-index:999;background:var(--ink);color:var(--limestone);padding:12px 18px;font-family:var(--fu);font-size:13.5px')}
          data-hover-style="left:12px;top:12px"
        >
          Skip to content
        </a>
      )}

      <MotionRoot />
      {!isAdmin && <Header />}

      <main id="main" style={css('display:block;min-height:100vh')}>
        {children}
      </main>

      {/* The portal is a working tool: no marketing footer, no guest chat. */}
      {!isAdmin && (
        <>
          <Footer />
          <MobileBar />
          <WhatsAppFab />
          <ChatWidget />
        </>
      )}

      <PageWipe />
      <BookingPanel />
    </div>
  );
}
