'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BookingDrawer } from '@/components/BookingDrawer';
import { ROOMS, money } from '@/lib/data';

export default function RoomsPage() {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [pickedCode, setPickedCode] = useState<string | null>(null);

  const handleBook = (code: string) => {
    setPickedCode(code);
    setIsBookOpen(true);
  };

  return (
    <>
      <Header onOpenBook={() => { setPickedCode(null); setIsBookOpen(true); }} />

      <main style={{ paddingTop: '92px', background: 'var(--limestone)', minHeight: '100vh' }}>
        <section style={{ padding: 'var(--sy) var(--gd)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '12.5px', letterSpacing: '.2em', color: 'var(--slate)' }}>02 · ACCOMMODATION</p>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, letterSpacing: '-.03em', marginTop: '12px' }}>
              <span data-en="1">Rooms & Suites</span>
              <span data-bn="1">আমাদের সকল রুম এবং স্যুট</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--slate)', marginTop: '16px', maxWidth: '44ch', lineHeight: 1.6 }}>
              <span data-en="1">Eight room categories designed for business travellers, couples, families, and high profile guests.</span>
              <span data-bn="1">ব্যবসায়ী, দম্পতি, পরিবার ও ভিআইপি অতিথিদের জন্য উপযোগী আটটি ক্যাটাগরির সুসজ্জিত রুম।</span>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px', marginTop: '48px' }}>
              {ROOMS.map((r) => (
                <div key={r.code} style={{ background: '#fff', border: 'var(--bl)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <img src={r.img} alt={r.name} width="600" height="400" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--slate)' }}>{r.code}</span>
                      <span style={{ fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--brass)' }}>Sleeps {r.sleeps}</span>
                    </div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '6px' }}>
                      <span data-en="1">{r.name}</span>
                      <span data-bn="1">{r.nameBn}</span>
                    </h3>
                    <p style={{ fontSize: '13.5px', color: 'var(--slate)', fontFamily: 'var(--fu)', marginTop: '4px' }}>
                      <span data-en="1">{r.config}</span>
                      <span data-bn="1">{r.configBn}</span>
                    </p>
                    <p style={{ fontSize: '14px', color: 'var(--slate)', marginTop: '12px', lineHeight: 1.6, flex: 1 }}>
                      <span data-en="1">{r.blurb}</span>
                      <span data-bn="1">{r.blurbBn}</span>
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '18px', borderTop: 'var(--bl)' }}>
                      <p style={{ fontFamily: 'var(--fu)', fontSize: '1.2rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                        ৳{money(r.rate)} <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--slate)' }}>/ night</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => handleBook(r.code)}
                        style={{ background: 'var(--lacquer)', color: '#fff', padding: '12px 22px', fontSize: '13.5px', fontWeight: 700, borderRadius: '2px' }}
                      >
                        <span data-en="1">Book this room</span>
                        <span data-bn="1">বুক করুন</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <BookingDrawer isOpen={isBookOpen} onClose={() => setIsBookOpen(false)} initialRoomCode={pickedCode} />
    </>
  );
}
