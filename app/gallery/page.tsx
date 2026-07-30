'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BookingDrawer } from '@/components/BookingDrawer';
import { GALLERY } from '@/lib/data';

export default function GalleryPage() {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [activeCat, setActiveCat] = useState('All');

  const categories = ['All', 'Building', 'Rooms', 'Sky View'];

  const filtered = activeCat === 'All' ? GALLERY : GALLERY.filter((g) => g.cat === activeCat);

  return (
    <>
      <Header onOpenBook={() => setIsBookOpen(true)} />

      <main style={{ paddingTop: '92px', background: 'var(--night)', color: 'var(--limestone)', minHeight: '100vh' }}>
        <section style={{ padding: 'var(--sy) var(--gd)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '12.5px', letterSpacing: '.2em', color: 'var(--brass)' }}>06 · VISUALS</p>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, letterSpacing: '-.03em', marginTop: '12px' }}>
              <span data-en="1">Photographs</span>
              <span data-bn="1">ছবি গ্যালারি</span>
            </h1>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '32px' }}>
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveCat(c)}
                  style={{
                    padding: '8px 18px',
                    fontFamily: 'var(--fu)',
                    fontSize: '13px',
                    borderRadius: '2px',
                    background: activeCat === c ? 'var(--lacquer)' : 'rgba(255,255,255,.08)',
                    color: '#fff',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginTop: '36px' }}>
              {filtered.map((item, i) => (
                <figure key={i} style={{ overflow: 'hidden', border: '1px solid rgba(233,234,229,.12)' }}>
                  <img src={item.src} alt={item.alt} width="800" height="600" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
                </figure>
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
