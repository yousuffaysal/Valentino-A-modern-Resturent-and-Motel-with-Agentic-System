'use client';

import React from 'react';
import { css } from '@/lib/css';
import { useSite } from '@/context/SiteContext';

/** Sticky bottom booking bar below 1024px, hidden while scrolling down. */
export function MobileBar() {
  const { openBook, settings } = useSite();
  return (
    <div
      data-hv-mobile-bar="1"
      style={css('position:fixed;left:0;right:0;bottom:0;z-index:70;background:var(--night);color:var(--limestone);padding:12px var(--gd) calc(12px + env(safe-area-inset-bottom));display:none;align-items:center;justify-content:space-between;gap:14px;transition:transform .35s var(--eo);border-top:var(--bd)')}
    >
      <div>
        <span style={css('display:block;font-family:var(--fu);font-size:11.5px;letter-spacing:.2em;color:var(--slate)')}>
          FROM
        </span>
        <span style={css('display:block;font-family:var(--fu);font-size:14px;font-variant-numeric:tabular-nums;margin-top:3px')}>
          BDT {settings.fromRate}
        </span>
      </div>
      <button
        type="button"
        onClick={() => openBook()}
        style={css('background:var(--lacquer);color:#fff;font-size:14px;font-weight:700;padding:13px 28px;min-height:46px;border-radius:2px')}
      >
        <span data-en="1">Book</span>
        <span data-bn="1">বুক</span>
      </button>
    </div>
  );
}

/** WhatsApp shortcut, mobile only, sits above the booking bar. */
export function WhatsAppFab() {
  const { settings } = useSite();
  const href = `https://wa.me/${settings.whatsapp}?text=Hello%20Hotel%20Valentino%2C%20I%20would%20like%20to%20check%20room%20availability.`;
  return (
    <a
      data-hv-wa="1"
      href={href}
      target="_blank"
      rel="noopener"
      aria-label="Message reception on WhatsApp"
      style={css('position:fixed;right:16px;bottom:96px;z-index:70;width:52px;height:52px;background:var(--night);border:var(--bd);display:none;align-items:center;justify-content:center;border-radius:50%')}
    >
      <span aria-hidden="true" style={css('width:9px;height:9px;background:var(--lacquer);border-radius:50%;display:block')} />
      <span style={css('position:absolute;width:1px;height:1px;overflow:hidden')}>WhatsApp</span>
    </a>
  );
}
