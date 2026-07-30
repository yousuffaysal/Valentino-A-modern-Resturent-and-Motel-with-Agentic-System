'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { css } from '@/lib/css';
import { NAV } from '@/lib/defaults';
import { useSite } from '@/context/SiteContext';
import { TLink } from '@/components/chrome/TLink';
import { Wordmark } from '@/components/chrome/Wordmark';

export function Header() {
  const pathname = usePathname();
  const { openBook, toggleLang, settings } = useSite();
  const phone = settings.phonePrimary ?? '+880 1795 855555';
  const telHref = 'tel:' + phone.replace(/\s/g, '');

  return (
    <header
      data-hv-header="1"
      style={css('position:fixed;top:0;left:0;right:0;z-index:80;height:92px;display:flex;align-items:center;padding:0 var(--gd);transition:height .4s var(--eo),background .4s var(--eo),backdrop-filter .4s var(--eo);border-bottom:1px solid transparent')}
    >
      <TLink
        href="/"
        ariaLabel="Hotel Valentino, home"
        style={css('display:flex;flex-direction:column;line-height:1;color:inherit;flex:0 0 auto')}
      >
        <Wordmark />
        <span
          style={css('font-family:var(--fu);font-size:12px;letter-spacing:.24em;color:rgba(255,255,255,.55);margin-top:5px;transition:color .4s var(--eo)')}
        >
          MAIJDEE COURT
        </span>
      </TLink>

      <nav
        aria-label="Primary"
        data-hv-nav="1"
        style={css('flex:1;display:none;justify-content:center;gap:clamp(20px,2.6vw,42px)')}
      >
        {NAV.map((n) => {
          const href = '/' + n.route;
          const active = pathname === href || pathname?.startsWith(href + '/');
          return (
            <TLink
              key={n.route}
              href={href}
              style={css(
                'font-size:15.5px;font-weight:500;letter-spacing:-.012em;padding:8px 2px;position:relative;white-space:nowrap;color:' +
                  (active ? '#fff' : 'rgba(255,255,255,.72)'),
              )}
              hoverStyle="color:#fff"
            >
              <span data-en="1">{n.en}</span>
              <span data-bn="1">{n.bn}</span>
            </TLink>
          );
        })}
      </nav>

      <div style={css('flex:0 0 auto;display:flex;align-items:center;gap:clamp(10px,1.4vw,20px)')}>
        <button
          type="button"
          onClick={toggleLang}
          style={css('font-family:var(--fu);font-size:13px;letter-spacing:.14em;border:1px solid rgba(255,255,255,.28);padding:7px 10px;min-height:34px;transition:border-color .4s var(--eo),color .4s var(--eo);color:#fff')}
          data-hover-style="border-color:rgba(255,255,255,.6)"
        >
          <span data-en="1">বাংলা</span>
          <span data-bn="1">EN</span>
        </button>
        <a
          href={telHref}
          data-hv-phone="1"
          style={css('font-family:var(--fu);font-size:13px;letter-spacing:.04em;font-variant-numeric:tabular-nums;display:none;color:#fff')}
        >
          {phone}
        </a>
        <button
          type="button"
          onClick={() => openBook()}
          style={css('background:var(--lacquer);color:#fff;font-size:13px;font-weight:700;letter-spacing:-.01em;padding:12px 20px;min-height:44px;border-radius:2px;transition:transform .3s var(--eo),background .3s var(--eo)')}
          data-hover-style="background:#8e1826;transform:translateY(-1px)"
        >
          <span data-en="1">Book now</span>
          <span data-bn="1">বুক করুন</span>
        </button>
      </div>
    </header>
  );
}
