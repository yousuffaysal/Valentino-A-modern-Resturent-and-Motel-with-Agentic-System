'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TableDrawer } from '@/components/TableDrawer';
import { BookingDrawer } from '@/components/BookingDrawer';
import { MENU, money } from '@/lib/data';

export default function RestaurantPage() {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Appetizers', 'Platters', 'Steak', 'Soup'];

  const filteredMenu = activeCategory === 'All' ? MENU : MENU.filter((m) => m.cat === activeCategory);

  return (
    <>
      <Header onOpenBook={() => setIsBookOpen(true)} />

      <main style={{ paddingTop: '92px', background: 'var(--night)', color: 'var(--limestone)', minHeight: '100vh' }}>
        <section style={{ padding: 'var(--sy) var(--gd)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <p style={{ fontFamily: 'var(--fu)', fontSize: '12.5px', letterSpacing: '.2em', color: 'var(--brass)' }}>03 · ROOFTOP RESTAURANT</p>
                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, letterSpacing: '-.03em', marginTop: '12px' }}>
                  <span data-en="1">Sky View Dining Menu</span>
                  <span data-bn="1">স্কাই ভিউ রেস্টুরেন্ট মেনু</span>
                </h1>
                <p style={{ fontSize: '1.1rem', color: 'rgba(233,234,229,.7)', marginTop: '14px', maxWidth: '48ch' }}>
                  Open 11:30 AM to 10:30 PM daily. Sizzling platters, chicken steaks, and mocktails.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTableOpen(true)}
                style={{ background: 'var(--lacquer)', color: '#fff', padding: '14px 28px', fontSize: '14px', fontWeight: 700, borderRadius: '2px' }}
              >
                <span data-en="1">Reserve a table</span>
                <span data-bn="1">টেবিল রিজার্ভ করুন</span>
              </button>
            </div>

            {/* Category Filter Bar */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '40px', borderBottom: '1px solid rgba(233,234,229,.14)', paddingBottom: '16px' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '8px 18px',
                    fontFamily: 'var(--fu)',
                    fontSize: '13px',
                    borderRadius: '2px',
                    background: activeCategory === cat ? 'var(--lacquer)' : 'rgba(255,255,255,.08)',
                    color: '#fff',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '36px' }}>
              {filteredMenu.map((item, i) => (
                <div key={i} style={{ border: '1px solid rgba(233,234,229,.12)', padding: '24px', background: 'rgba(255,255,255,.03)', borderRadius: '2px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{item.name}</h3>
                    <span style={{ fontFamily: 'var(--fu)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--brass)' }}>৳{money(item.price)}</span>
                  </div>
                  <p style={{ fontSize: '12px', fontFamily: 'var(--fu)', color: 'var(--slate)', marginTop: '4px' }}>{item.cat.toUpperCase()}</p>
                  <p style={{ fontSize: '14px', color: 'rgba(233,234,229,.7)', marginTop: '10px', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <BookingDrawer isOpen={isBookOpen} onClose={() => setIsBookOpen(false)} />
      <TableDrawer isOpen={isTableOpen} onClose={() => setIsTableOpen(false)} />
    </>
  );
}
