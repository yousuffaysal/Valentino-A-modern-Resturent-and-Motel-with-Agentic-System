'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { NAV } from '@/lib/data';

interface HeaderProps {
  onOpenBook: () => void;
  isAdmin?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBook, isAdmin = false }) => {
  const { toggleLang, isBn } = useLanguage();

  if (isAdmin) return null;

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 80,
        height: '92px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 var(--gd)',
        background: 'rgba(14, 17, 20, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(233, 234, 229, 0.12)',
      }}
    >
      <Link href="/" style={{ display: 'flex', flexDirection: 'column', color: 'inherit', flex: '0 0 auto' }}>
        <span style={{ fontSize: '23px', fontWeight: 800, letterSpacing: '-.03em', color: '#fff' }}>
          Valent<span style={{ position: 'relative', display: 'inline-block' }}>ı<span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '.1em', transform: 'translateX(-50%)', width: '.17em', height: '.17em', background: 'var(--lacquer)', borderRadius: '50%', display: 'block' }}></span></span>no
        </span>
        <span style={{ fontFamily: 'var(--fu)', fontSize: '12px', letterSpacing: '.24em', color: 'rgba(255,255,255,.55)', marginTop: '5px' }}>
          MAIJDEE COURT
        </span>
      </Link>

      <nav style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 'clamp(16px, 2.6vw, 42px)' }}>
        {NAV.map((n) => (
          <Link
            key={n.route}
            href={`/${n.route}`}
            style={{
              fontSize: '15.5px',
              fontWeight: 500,
              letterSpacing: '-.012em',
              padding: '8px 2px',
              color: 'rgba(255,255,255,0.85)',
              whiteSpace: 'nowrap',
            }}
          >
            <span data-en="1">{n.en}</span>
            <span data-bn="1">{n.bn}</span>
          </Link>
        ))}
      </nav>

      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 'clamp(10px, 1.4vw, 20px)' }}>
        <button
          type="button"
          onClick={toggleLang}
          style={{
            fontFamily: 'var(--fu)',
            fontSize: '13px',
            letterSpacing: '.14em',
            border: '1px solid rgba(255,255,255,.28)',
            padding: '7px 10px',
            minHeight: '34px',
            color: '#fff',
            borderRadius: '2px',
          }}
        >
          <span data-en="1">বাংলা</span>
          <span data-bn="1">EN</span>
        </button>

        <a
          href="tel:+8801795855555"
          style={{
            fontFamily: 'var(--fu)',
            fontSize: '13px',
            letterSpacing: '.04em',
            fontVariantNumeric: 'tabular-nums',
            color: '#fff',
          }}
        >
          +880 1795 855555
        </a>

        <button
          type="button"
          onClick={onOpenBook}
          style={{
            background: 'var(--lacquer)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '-.01em',
            padding: '12px 20px',
            minHeight: '44px',
            borderRadius: '2px',
            transition: 'background .3s var(--eo)',
          }}
        >
          <span data-en="1">Book now</span>
          <span data-bn="1">বুক করুন</span>
        </button>
      </div>
    </header>
  );
};
