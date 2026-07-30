'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BookingDrawer } from '@/components/BookingDrawer';
import { FACILITIES } from '@/lib/data';

export default function FacilitiesPage() {
  const [isBookOpen, setIsBookOpen] = useState(false);

  return (
    <>
      <Header onOpenBook={() => setIsBookOpen(true)} />

      <main style={{ paddingTop: '92px', background: 'var(--limestone)', minHeight: '100vh' }}>
        <section style={{ padding: 'var(--sy) var(--gd)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '12.5px', letterSpacing: '.2em', color: 'var(--slate)' }}>04 · ESSENTIALS</p>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, letterSpacing: '-.03em', marginTop: '12px' }}>
              <span data-en="1">Hotel Facilities</span>
              <span data-bn="1">হোটেল সুযোগ সুবিধাসমূহ</span>
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginTop: '48px' }}>
              {FACILITIES.map((f, i) => (
                <div key={i} style={{ border: 'var(--bl)', padding: '32px', background: '#fff' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                    <span data-en="1">{f.en}</span>
                    <span data-bn="1">{f.bn}</span>
                  </h3>
                  <p style={{ fontSize: '15px', color: 'var(--slate)', marginTop: '12px', lineHeight: 1.6 }}>{f.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BookingDrawer isOpen={isBookOpen} onClose={() => setIsBookOpen(false)} />
    </>
  );
}
