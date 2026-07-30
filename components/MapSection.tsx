'use client';

import React from 'react';
import Link from 'next/link';

export const MapSection: React.FC = () => {
  return (
    <section
      data-floor="G · LOCATION"
      data-floor-id="location"
      aria-labelledby="loc-h"
      style={{
        position: 'relative',
        background: 'var(--mist)',
        padding: 'var(--sy) var(--gd)',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'url(/img/real-map-bw.png) center/cover no-repeat',
          filter: 'grayscale(1) contrast(1.15)',
          opacity: 0.9,
        }}
      >
        {/* Blinking Red Dot Marker */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%,-50%)',
            width: '14px',
            height: '14px',
            background: '#A81E2D',
            borderRadius: '50%',
            boxShadow: '0 0 0 rgba(168,30,45,0.7)',
            animation: 'hv-map-pulse 2s infinite',
            zIndex: 2,
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%,-50%)',
            width: '32px',
            height: '32px',
            border: '2px solid #A81E2D',
            borderRadius: '50%',
            opacity: 0.6,
            zIndex: 1,
          }}
        ></div>
      </div>

      <div style={{ position: 'relative', maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'flex-end' }}>
        <div
          style={{
            background: 'var(--limestone)',
            border: 'var(--bl)',
            padding: 'clamp(26px,3.4vw,46px)',
            maxWidth: '520px',
            width: '100%',
          }}
        >
          <p style={{ fontFamily: 'var(--fu)', fontSize: '.8125rem', letterSpacing: '.22em', color: 'var(--slate)' }}>
            GROUND · LOCATION
          </p>
          <h2 id="loc-h" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1.05, marginTop: '16px' }}>
            Boro Masjid Moar, Main Road.
          </h2>
          <address style={{ fontStyle: 'normal', fontSize: '.9375rem', lineHeight: 1.68, color: 'var(--slate)', marginTop: '18px' }}>
            Ahsan Bhaban (Shwapno Super Shop), Guptanka, Main Road, Maijdee Court, Sadar, Noakhali-3800
          </address>
          <dl style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px 18px', marginTop: '26px', paddingTop: '22px', borderTop: 'var(--bl)', fontSize: '.8125rem' }}>
            <dt style={{ color: 'var(--slate)' }}>Maijdee Court train station</dt>
            <dd style={{ fontFamily: 'var(--fu)', fontVariantNumeric: 'tabular-nums' }}>1 KM</dd>
            <dt style={{ color: 'var(--slate)' }}>Maijdee Court bus station</dt>
            <dd style={{ fontFamily: 'var(--fu)', fontVariantNumeric: 'tabular-nums' }}>1 KM</dd>
            <dt style={{ color: 'var(--slate)' }}>NSTU campus</dt>
            <dd style={{ fontFamily: 'var(--fu)', fontVariantNumeric: 'tabular-nums', color: 'var(--brass)' }}>8 KM</dd>
          </dl>
          <Link
            href="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              marginTop: '26px',
              fontSize: '14px',
              fontWeight: 600,
              minHeight: '44px',
              borderBottom: '1px solid var(--lacquer)',
            }}
          >
            <span data-en="1">Get directions</span>
            <span data-bn="1">দিকনির্দেশনা পান</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
