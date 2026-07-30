'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MapSection } from '@/components/MapSection';
import { BookingDrawer } from '@/components/BookingDrawer';
import { TableDrawer } from '@/components/TableDrawer';
import { ROOMS, FACILITIES, money } from '@/lib/data';

export default function HomePage() {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [pickedRoomCode, setPickedRoomCode] = useState<string | null>(null);

  const handleOpenBookForRoom = (code: string) => {
    setPickedRoomCode(code);
    setIsBookOpen(true);
  };

  return (
    <>
      <Header onOpenBook={() => { setPickedRoomCode(null); setIsBookOpen(true); }} />

      <main style={{ paddingTop: '92px' }}>
        {/* HERO SECTION */}
        <section
          style={{
            position: 'relative',
            minHeight: '85vh',
            display: 'flex',
            alignItems: 'center',
            background: 'var(--night)',
            color: 'var(--limestone)',
            padding: 'var(--sy) var(--gd)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'url(/img/hotel-exterior.png) center/cover no-repeat',
              filter: 'brightness(0.38) contrast(1.1)',
            }}
          ></div>

          <div style={{ position: 'relative', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '13px', letterSpacing: '.24em', color: 'var(--brass)', textTransform: 'uppercase' }}>
              01 · MAIJDEE COURT, NOAKHALI
            </p>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 6.5vw, 6rem)',
                fontWeight: 800,
                letterSpacing: '-.035em',
                lineHeight: 0.96,
                marginTop: '24px',
                maxWidth: '18ch',
              }}
            >
              <span data-en="1">A quiet room in the centre of town.</span>
              <span data-bn="1">শহরের কেন্দ্রস্থলে একটি শান্ত এবং আরামদায়ক আবাসন।</span>
            </h1>

            <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.35rem)', color: 'rgba(233,234,229,.85)', marginTop: '28px', maxWidth: '42ch', lineHeight: 1.6 }}>
              <span data-en="1">Hotel Valentino sits on Main Road at Boro Masjid Moar. Eight categories of rooms, 24-hour reception, and Sky View restaurant on the roof.</span>
              <span data-bn="1">হোটেল ভ্যালেন্টিনো মাইজদী কোর্টের বড় মসজিদ মোড়ে অবস্থিত। আটটি ক্যাটাগরির রুম, ২৪ ঘণ্টা রিসেপশন এবং ছাদে স্কাই ভিউ রেস্টুরেন্ট।</span>
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '40px' }}>
              <button
                type="button"
                onClick={() => { setPickedRoomCode(null); setIsBookOpen(true); }}
                style={{
                  background: 'var(--lacquer)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 700,
                  padding: '16px 28px',
                  borderRadius: '2px',
                }}
              >
                <span data-en="1">Check available rooms</span>
                <span data-bn="1">খালি রুম পরীক্ষা করুন</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTableOpen(true)}
                style={{
                  border: '1px solid rgba(233,234,229,.4)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 700,
                  padding: '16px 28px',
                  borderRadius: '2px',
                }}
              >
                <span data-en="1">Reserve a table at Sky View</span>
                <span data-bn="1">স্কাই ভিউতে টেবিল বুক করুন</span>
              </button>
            </div>
          </div>
        </section>

        {/* ROOMS SHOWCASE */}
        <section style={{ padding: 'var(--sy) var(--gd)', background: 'var(--limestone)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <p style={{ fontFamily: 'var(--fu)', fontSize: '12.5px', letterSpacing: '.2em', color: 'var(--slate)' }}>02 · ACCOMMODATION</p>
                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.6rem)', fontWeight: 800, letterSpacing: '-.03em', marginTop: '12px' }}>
                  <span data-en="1">Rooms & Suites</span>
                  <span data-bn="1">আমাদের রুম এবং স্যুটসমূহ</span>
                </h2>
              </div>
              <Link href="/rooms" style={{ fontFamily: 'var(--fu)', fontSize: '13px', letterSpacing: '.14em', color: 'var(--ink)' }}>
                VIEW ALL CATEGORIES ↗
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '48px' }}>
              {ROOMS.slice(0, 4).map((r) => (
                <div key={r.code} style={{ background: '#fff', border: 'var(--bl)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <img src={r.img} alt={r.alt} width="600" height="400" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <p style={{ fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--slate)' }}>{r.code}</p>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px' }}>
                      <span data-en="1">{r.name}</span>
                      <span data-bn="1">{r.nameBn}</span>
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--slate)', marginTop: '8px', lineHeight: 1.6, flex: 1 }}>
                      <span data-en="1">{r.blurb}</span>
                      <span data-bn="1">{r.blurbBn}</span>
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: 'var(--bl)' }}>
                      <p style={{ fontFamily: 'var(--fu)', fontSize: '1.1rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                        ৳{money(r.rate)} <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--slate)' }}>/ night</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => handleOpenBookForRoom(r.code)}
                        style={{ background: 'var(--lacquer)', color: '#fff', padding: '10px 18px', fontSize: '13px', fontWeight: 700, borderRadius: '2px' }}
                      >
                        <span data-en="1">Book</span>
                        <span data-bn="1">বুক</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SKY VIEW RESTAURANT PREVIEW */}
        <section style={{ background: 'var(--night)', color: 'var(--limestone)', padding: 'var(--sy) var(--gd)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(30px, 5vw, 70px)', alignItems: 'center' }}>
            <div>
              <p style={{ fontFamily: 'var(--fu)', fontSize: '12.5px', letterSpacing: '.2em', color: 'var(--brass)' }}>03 · ROOFTOP DINING</p>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.6rem)', fontWeight: 800, letterSpacing: '-.03em', marginTop: '14px', lineHeight: 1.05 }}>
                <span data-en="1">Sky View Restaurant & Lounge</span>
                <span data-bn="1">স্কাই ভিউ রেস্টুরেন্ট এবং লাউঞ্জ</span>
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.68, color: 'rgba(233,234,229,.8)', marginTop: '22px' }}>
                <span data-en="1">Located on the roof of Hotel Valentino with panoramic views of Maijdee Court. Sizzling platters, chicken steaks, and mocktails served daily from 11:30 AM to 10:30 PM.</span>
                <span data-bn="1">হোটেল ভ্যালেন্টিনোর ছাদে অবস্থিত মাইজদী কোর্টের চারপাশের দৃশ্যসহ মনোরম রেস্টুরেন্ট। প্রতিদিন বেলা ১১:৩০ থেকে রাত ১০:৩০ পর্যন্ত খোলা।</span>
              </p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                <Link href="/restaurant" style={{ background: 'var(--lacquer)', color: '#fff', padding: '14px 24px', fontSize: '14px', fontWeight: 700, borderRadius: '2px' }}>
                  <span data-en="1">Explore menu</span>
                  <span data-bn="1">মেনু দেখুন</span>
                </Link>
                <button type="button" onClick={() => setIsTableOpen(true)} style={{ border: '1px solid rgba(233,234,229,.3)', color: '#fff', padding: '14px 24px', fontSize: '14px', fontWeight: 700, borderRadius: '2px' }}>
                  <span data-en="1">Reserve table</span>
                  <span data-bn="1">টেবিল রিজার্ভ করুন</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <img src="/img/dish-crispy-fried-chicken.png" alt="Crispy Fried Chicken" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '2px' }} />
              <img src="/img/dish-teriyaki-chicken.png" alt="Teriyaki Chicken" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '2px' }} />
            </div>
          </div>
        </section>

        {/* FACILITIES */}
        <section style={{ padding: 'var(--sy) var(--gd)', background: 'var(--limestone)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '12.5px', letterSpacing: '.2em', color: 'var(--slate)' }}>04 · ESSENTIALS</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.6rem)', fontWeight: 800, letterSpacing: '-.03em', marginTop: '12px' }}>
              <span data-en="1">Hotel Facilities</span>
              <span data-bn="1">হোটেল সুযোগ সুবিধাসমূহ</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '40px' }}>
              {FACILITIES.map((f, i) => (
                <div key={i} style={{ border: 'var(--bl)', padding: '28px', background: '#fff' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                    <span data-en="1">{f.en}</span>
                    <span data-bn="1">{f.bn}</span>
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--slate)', marginTop: '10px', lineHeight: 1.6 }}>{f.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MAP SECTION */}
        <MapSection />
      </main>

      <Footer />

      {/* DRAWERS */}
      <BookingDrawer
        isOpen={isBookOpen}
        onClose={() => setIsBookOpen(false)}
        initialRoomCode={pickedRoomCode}
      />
      <TableDrawer
        isOpen={isTableOpen}
        onClose={() => setIsTableOpen(false)}
      />
    </>
  );
}
