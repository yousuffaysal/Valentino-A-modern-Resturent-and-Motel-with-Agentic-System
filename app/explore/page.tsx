'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BookingDrawer } from '@/components/BookingDrawer';
import { EXPLORE } from '@/lib/data';

export default function ExplorePage() {
  const [isBookOpen, setIsBookOpen] = useState(false);

  return (
    <>
      <Header onOpenBook={() => setIsBookOpen(true)} />

      <main style={{ paddingTop: '92px', background: 'var(--limestone)', minHeight: '100vh' }}>
        <section style={{ padding: 'var(--sy) var(--gd)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '12.5px', letterSpacing: '.2em', color: 'var(--slate)' }}>05 · DESTINATIONS</p>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, letterSpacing: '-.03em', marginTop: '12px' }}>
              <span data-en="1">Explore Noakhali</span>
              <span data-bn="1">নোয়াখালী দর্শনীয় স্থানসমূহ</span>
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '48px' }}>
              {EXPLORE.map((item) => (
                <div key={item.slug} style={{ background: '#fff', border: 'var(--bl)', overflow: 'hidden' }}>
                  <img src={item.img} alt={item.name} width="600" height="400" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                  <div style={{ padding: '24px' }}>
                    <span style={{ fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--lacquer)', fontWeight: 700 }}>{item.dist} FROM HOTEL</span>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: '6px' }}>{item.name}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--slate)', marginTop: '8px', lineHeight: 1.5 }}>{item.line}</p>
                  </div>
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
