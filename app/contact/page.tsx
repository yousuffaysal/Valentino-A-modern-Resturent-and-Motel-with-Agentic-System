'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BookingDrawer } from '@/components/BookingDrawer';

export default function ContactPage() {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <Header onOpenBook={() => setIsBookOpen(true)} />

      <main style={{ paddingTop: '92px', background: 'var(--limestone)', minHeight: '100vh' }}>
        <section style={{ padding: 'var(--sy) var(--gd)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '12.5px', letterSpacing: '.2em', color: 'var(--slate)' }}>GROUND · CONTACT</p>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5.6vw, 4.5rem)', fontWeight: 800, letterSpacing: '-.035em', marginTop: '16px', maxWidth: '18ch' }}>
              Boro Masjid Moar, Main Road, Maijdee Court.
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(30px, 4vw, 70px)', marginTop: '48px' }}>
              <div>
                <address style={{ fontStyle: 'normal', fontSize: '1.1rem', lineHeight: 1.68 }}>
                  Ahsan Bhaban (Shwapno Super Shop)<br />
                  Guptanka, Main Road, Maijdee Court<br />
                  Sadar, Noakhali-3800, Bangladesh
                </address>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '30px', paddingTop: '22px', borderTop: 'var(--bl)' }}>
                  <a href="tel:+8801795855555" style={{ fontFamily: 'var(--fu)', fontSize: '1.4rem', color: 'var(--ink)' }}>+880 1795 855555</a>
                  <a href="tel:+8802334491777" style={{ fontFamily: 'var(--fu)', fontSize: '1.4rem', color: 'var(--ink)' }}>+880 2334 491777</a>
                  <a href="tel:+880032171277" style={{ fontFamily: 'var(--fu)', fontSize: '1.4rem', color: 'var(--ink)' }}>0321 71277</a>
                </div>

                <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px 24px', marginTop: '30px', paddingTop: '22px', borderTop: 'var(--bl)', fontSize: '.875rem' }}>
                  <dt style={{ fontFamily: 'var(--fu)', color: 'var(--slate)' }}>RECEPTION</dt>
                  <dd>Open 24 hours, every day</dd>
                  <dt style={{ fontFamily: 'var(--fu)', color: 'var(--slate)' }}>TRAIN</dt>
                  <dd>1 km from Maijdee Court station</dd>
                  <dt style={{ fontFamily: 'var(--fu)', color: 'var(--slate)' }}>BUS</dt>
                  <dd>1 km from Maijdee Court bus station</dd>
                </dl>
              </div>

              <div>
                {/* Black & White map with blinking red dot */}
                <div style={{ border: 'var(--bl)', overflow: 'hidden', position: 'relative', aspectRatio: '600/420', background: 'url(/img/real-map-bw.png) center/cover no-repeat', filter: 'grayscale(1) contrast(1.15)' }}>
                  <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '14px', height: '14px', background: '#A81E2D', borderRadius: '50%', boxShadow: '0 0 0 rgba(168,30,45,0.7)', animation: 'hv-map-pulse 2s infinite', zIndex: 2 }}></div>
                  <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '32px', height: '32px', border: '2px solid #A81E2D', borderRadius: '50%', opacity: 0.6, zIndex: 1 }}></div>
                </div>

                <div style={{ border: 'var(--bl)', borderTop: 'none', padding: '32px', background: '#fff' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Send reception a message</h2>
                  {sent ? (
                    <p style={{ color: 'var(--brass)', fontWeight: 700, marginTop: '20px' }}>Message sent to reception! We will get back to you shortly.</p>
                  ) : (
                    <form onSubmit={handleSubmit} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <label style={{ display: 'block' }}>
                        <span style={{ display: 'block', fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--slate)' }}>NAME</span>
                        <input type="text" required style={{ width: '100%', borderBottom: 'var(--bl)', padding: '10px 0', fontSize: '15px' }} />
                      </label>
                      <label style={{ display: 'block' }}>
                        <span style={{ display: 'block', fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--slate)' }}>MOBILE</span>
                        <input type="tel" required placeholder="01XXXXXXXXX" style={{ width: '100%', borderBottom: 'var(--bl)', padding: '10px 0', fontSize: '15px' }} />
                      </label>
                      <label style={{ display: 'block' }}>
                        <span style={{ display: 'block', fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--slate)' }}>MESSAGE</span>
                        <textarea rows={3} required style={{ width: '100%', borderBottom: 'var(--bl)', padding: '10px 0', fontSize: '15px' }}></textarea>
                      </label>
                      <button type="submit" style={{ background: 'var(--lacquer)', color: '#fff', padding: '14px', fontWeight: 700, borderRadius: '2px', marginTop: '10px' }}>
                        Send to reception
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BookingDrawer isOpen={isBookOpen} onClose={() => setIsBookOpen(false)} />
    </>
  );
}
