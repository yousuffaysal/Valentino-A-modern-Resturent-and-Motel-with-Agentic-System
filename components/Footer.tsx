'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer style={{ background: 'var(--night)', color: 'var(--limestone)', padding: 'var(--sy) var(--gd) clamp(40px,6vh,72px)', borderTop: 'var(--bd)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'clamp(30px,4vw,60px)' }}>
          <div>
            <span style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-.03em', color: '#fff', display: 'block' }}>
              Valent<span style={{ position: 'relative', display: 'inline-block' }}>ı<span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '.1em', transform: 'translateX(-50%)', width: '.17em', height: '.17em', background: 'var(--lacquer)', borderRadius: '50%', display: 'block' }}></span></span>no
            </span>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '12px', letterSpacing: '.24em', color: 'rgba(255,255,255,.55)', marginTop: '6px' }}>
              MAIJDEE COURT
            </p>
            <address style={{ fontStyle: 'normal', fontSize: '14px', lineHeight: 1.6, color: 'var(--slate)', marginTop: '20px' }}>
              Boro Masjid Moar, Main Road, Maijdee Court,<br />
              Sadar, Noakhali-3800, Bangladesh
            </address>
          </div>

          <div>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '12.5px', letterSpacing: '.2em', color: 'var(--brass)', marginBottom: '16px' }}>
              EXPLORE
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li><Link href="/rooms" style={{ color: 'var(--limestone)' }}><span data-en="1">Rooms & Suites</span><span data-bn="1">রুম এবং স্যুট</span></Link></li>
              <li><Link href="/restaurant" style={{ color: 'var(--limestone)' }}><span data-en="1">Sky View Restaurant</span><span data-bn="1">স্কাই ভিউ রেস্টুরেন্ট</span></Link></li>
              <li><Link href="/facilities" style={{ color: 'var(--limestone)' }}><span data-en="1">Facilities</span><span data-bn="1">সুযোগ সুবিধা</span></Link></li>
              <li><Link href="/explore" style={{ color: 'var(--limestone)' }}><span data-en="1">Explore Noakhali</span><span data-bn="1">ঘুরে দেখুন নোয়াখালী</span></Link></li>
              <li><Link href="/gallery" style={{ color: 'var(--limestone)' }}><span data-en="1">Photo Gallery</span><span data-bn="1">ছবি গ্যালারি</span></Link></li>
            </ul>
          </div>

          <div>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '12.5px', letterSpacing: '.2em', color: 'var(--brass)', marginBottom: '16px' }}>
              CONTACT & ADMIN
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <a href="tel:+8801795855555" style={{ color: 'var(--limestone)', fontFamily: 'var(--fu)' }}>+880 1795 855555</a>
              <Link href="/contact" style={{ color: 'var(--limestone)' }}><span data-en="1">Contact Us</span><span data-bn="1">যোগাযোগ করুন</span></Link>
              <Link href="/admin" style={{ color: 'var(--brass)', fontWeight: 700, marginTop: '8px' }}>
                🔑 Admin Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(233,234,229,.12)', marginTop: '48px', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', color: 'var(--slate)', fontFamily: 'var(--fu)' }}>
          <p>© {new Date().getFullYear()} Hotel Valentino. All rights reserved.</p>
          <p>Maijdee Court, Noakhali</p>
        </div>
      </div>
    </footer>
  );
};
