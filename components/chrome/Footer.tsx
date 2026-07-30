'use client';

import React from 'react';
import { css } from '@/lib/css';
import { FOOTER_NAV, POLICY_NAV } from '@/lib/defaults';
import { useSite } from '@/context/SiteContext';
import { TLink } from '@/components/chrome/TLink';

const linkStyle = css('font-size:.875rem;color:rgba(233,234,229,.72);min-height:24px');
const numberStyle = css('font-family:var(--fu);font-size:.875rem;color:rgba(233,234,229,.85);font-variant-numeric:tabular-nums;min-height:24px');
const labelStyle = css('font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:var(--slate)');
const payStyle = css('font-family:var(--fu);font-size:12.5px;letter-spacing:.14em;color:var(--limestone);border:var(--bd);padding:5px 8px');

export function Footer() {
  const { settings } = useSite();
  const phones = [settings.phonePrimary, settings.phoneSecondary, settings.phoneLandline].filter(Boolean);

  return (
    <footer style={css('background:var(--night);color:var(--limestone);padding:var(--sy) var(--gd) 40px;position:relative;z-index:2')}>
      <div style={css('max-width:1400px;margin:0 auto')}>
        <p style={css('font-size:clamp(2.6rem,11vw,9rem);font-weight:800;letter-spacing:-.05em;line-height:.85;color:rgba(233,234,229,.14)')}>
          VALENTINO
        </p>
        <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:clamp(26px,3vw,50px);margin-top:clamp(40px,6vh,72px);padding-top:36px;border-top:var(--bd)')}>
          <div>
            <p style={labelStyle}>ADDRESS</p>
            <address style={css('font-style:normal;font-size:.875rem;line-height:1.68;color:rgba(233,234,229,.72);margin-top:14px')}>
              {settings.addressLine1}
              <br />
              {settings.addressLine2}
              <br />
              {settings.addressLine3}
            </address>
            <TLink
              href="/contact"
              style={css('display:block;margin-top:16px;border:var(--bd);padding:10px;max-width:190px')}
              hoverStyle="border-color:rgba(233,234,229,.4);color:var(--limestone)"
            >
              <svg viewBox="0 0 200 90" aria-hidden="true" style={css('width:100%;height:auto;display:block')}>
                <rect width="200" height="90" fill="#171B1F" />
                <g stroke="#E9EAE5" strokeOpacity=".22" fill="none">
                  <path d="M0 46 L200 40" />
                  <path d="M74 0 L84 90" />
                  <path d="M140 0 L132 90" />
                </g>
                <circle cx="100" cy="45" r="4" fill="#A81E2D" />
              </svg>
              <span style={css('display:block;font-family:var(--fu);font-size:12px;letter-spacing:.16em;color:var(--slate);margin-top:8px')}>
                OPEN IN MAPS ↗
              </span>
            </TLink>
          </div>

          <div>
            <p style={labelStyle}>RESERVATIONS</p>
            <div style={css('display:flex;flex-direction:column;gap:8px;margin-top:14px')}>
              {phones.map((p) => (
                <a key={p} href={'tel:' + p.replace(/\s/g, '')} style={numberStyle} data-hover-style="color:#fff">
                  {p}
                </a>
              ))}
              <p style={css('font-family:var(--fu);font-size:.8125rem;color:var(--brass);margin-top:6px')}>
                EMAIL · {settings.email}
              </p>
            </div>
          </div>

          <div>
            <p style={labelStyle}>THE HOTEL</p>
            <div style={css('display:flex;flex-direction:column;gap:9px;margin-top:14px')}>
              {FOOTER_NAV.map((f) => (
                <TLink key={f.href} href={f.href} style={linkStyle} hoverStyle="color:#fff">
                  {f.label}
                </TLink>
              ))}
            </div>
          </div>

          <div>
            <p style={labelStyle}>POLICIES</p>
            <div style={css('display:flex;flex-direction:column;gap:9px;margin-top:14px')}>
              {POLICY_NAV.map((p) => (
                <TLink key={p.slug} href={'/policies/' + p.slug} style={linkStyle} hoverStyle="color:#fff">
                  {p.label}
                </TLink>
              ))}
            </div>
            <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:var(--slate);margin-top:26px')}>
              SOCIAL
            </p>
            <div style={css('display:flex;flex-direction:column;gap:9px;margin-top:14px')}>
              <a href={settings.facebook} target="_blank" rel="noopener" style={linkStyle} data-hover-style="color:#fff">
                Facebook ↗
              </a>
              <a href={settings.youtube} target="_blank" rel="noopener" style={linkStyle} data-hover-style="color:#fff">
                YouTube ↗
              </a>
            </div>
          </div>
        </div>

        <div style={css('display:flex;flex-wrap:wrap;gap:20px;justify-content:space-between;align-items:center;margin-top:clamp(40px,6vh,70px);padding-top:26px;border-top:var(--bd)')}>
          <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.18em;color:var(--slate)')}>
            MAIN ROAD · MAIJDEE COURT · NOAKHALI-3800 · RECEPTION OPEN 24H
          </p>
          <div style={css('display:flex;gap:16px;align-items:center;opacity:.5')}>
            <span style={payStyle}>bKash</span>
            <span style={payStyle}>Nagad</span>
            <span style={payStyle}>VISA</span>
            <span style={payStyle}>MASTERCARD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
