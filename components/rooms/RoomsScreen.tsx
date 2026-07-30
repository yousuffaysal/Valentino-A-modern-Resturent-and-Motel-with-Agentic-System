'use client';

import React, { useState } from 'react';
import { css } from '@/lib/css';
import { money } from '@/lib/format';
import type { Room } from '@/lib/defaults';
import { TLink } from '@/components/chrome/TLink';

const chipStyle = (on: boolean) =>
  css(
    'font-family:var(--fu);font-size:12.5px;letter-spacing:.1em;padding:10px 15px;min-height:42px;border-radius:2px;font-variant-numeric:tabular-nums;' +
      (on ? 'background:var(--ink);color:var(--limestone);' : 'border:var(--bl);color:var(--slate);'),
  );

export function RoomsScreen({ rooms }: { rooms: Room[] }) {
  const [guests, setGuests] = useState(0);
  const [maxRate, setMaxRate] = useState(11000);

  const filtered = rooms.filter((r) => (guests === 0 || r.sleeps >= guests) && r.rate <= maxRate);
  const total = String(rooms.length).padStart(2, '0');

  return (
    <div data-screen-label="Rooms">
      <section
        data-floor="01 · ROOMS"
        data-floor-id="rx"
        style={css('position:relative;height:62vh;min-height:420px;overflow:hidden;background:var(--night)')}
      >
        <div data-hv-hero-bg="1" style={css('position:absolute;inset:-8% 0')}>
          <img
            src="/img/room-twin-deluxe.png"
            alt="Twin Deluxe room with two single beds"
            width={1536}
            height={1024}
            style={css('width:100%;height:100%;object-fit:cover;filter:brightness(.6)')}
          />
        </div>
        <div
          aria-hidden="true"
          style={css('position:absolute;inset:0;background:linear-gradient(to top,rgba(14,17,20,.94),rgba(14,17,20,.2))')}
        />
        <div style={css('position:relative;height:100%;display:flex;flex-direction:column;justify-content:flex-end;padding:0 var(--gd) clamp(40px,7vh,72px);max-width:1400px;margin:0 auto')}>
          <p style={css('display:flex;align-items:center;gap:14px;font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:rgba(233,234,229,.6)')}>
            <span aria-hidden="true" style={css('width:38px;height:1px;background:var(--brass);display:block')} />
            ROOMS · {total} CATEGORIES
          </p>
          <h1
            data-hero-split="1"
            style={css('font-size:clamp(2.2rem,5.6vw,5rem);font-weight:700;letter-spacing:-.035em;line-height:.96;color:#fff;margin-top:20px;max-width:15ch')}
          >
            Eight ways to sleep in Maijdee.
          </h1>
          <p
            data-hero-el="1"
            style={css('font-size:1rem;color:rgba(233,234,229,.76);margin-top:20px;max-width:52ch;line-height:1.68')}
          >
            Rates run from BDT 2,500 to BDT 10,500 a night. Every room has hot water, a mini fridge, a flat-screen and
            free Wi-Fi. The difference is the beds and the view.
          </p>
        </div>
      </section>

      <section
        aria-label="Filter rooms"
        style={css('position:sticky;top:64px;z-index:40;background:var(--limestone);border-bottom:var(--bl);padding:16px var(--gd)')}
      >
        <div style={css('max-width:1400px;margin:0 auto;display:flex;flex-wrap:wrap;gap:20px;align-items:center')}>
          <div style={css('display:flex;gap:7px;flex-wrap:wrap;align-items:center')}>
            <span style={css('font-family:var(--fu);font-size:12px;letter-spacing:.18em;color:var(--slate);margin-right:4px')}>
              GUESTS
            </span>
            {[0, 1, 2, 3, 4].map((g) => (
              <button key={g} type="button" onClick={() => setGuests(g)} style={chipStyle(guests === g)}>
                {g === 0 ? 'Any' : g + (g === 4 ? '+' : '')}
              </button>
            ))}
          </div>
          <div style={css('display:flex;gap:7px;flex-wrap:wrap;align-items:center')}>
            <span style={css('font-family:var(--fu);font-size:12px;letter-spacing:.18em;color:var(--slate);margin-right:4px')}>
              RATE
            </span>
            {[11000, 6000, 4500].map((p) => (
              <button key={p} type="button" onClick={() => setMaxRate(p)} style={chipStyle(maxRate === p)}>
                {p === 11000 ? 'Any rate' : 'Up to ৳' + money(p)}
              </button>
            ))}
          </div>
          <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.16em;color:var(--slate);margin-left:auto;font-variant-numeric:tabular-nums')}>
            {String(filtered.length).padStart(2, '0')} / {total} SHOWING
          </p>
        </div>
      </section>

      <section aria-label="All rooms" style={css('background:var(--limestone);padding:var(--sy) var(--gd)')}>
        <div style={css('max-width:1400px;margin:0 auto;display:flex;flex-direction:column')}>
          {filtered.map((r) => (
            <TLink
              key={r.code}
              href={'/rooms/' + r.slug}
              data-rev="1"
              data-two-col=".9fr 1.1fr"
              style={css('color:inherit;display:grid;grid-template-columns:1fr;gap:clamp(20px,3vw,50px);align-items:center;padding:clamp(24px,4vh,44px) 0;border-top:var(--bl)')}
            >
              <img
                data-fill="1"
                src={r.img}
                alt={r.alt}
                loading="lazy"
                width={900}
                height={600}
                style={css('width:100%;aspect-ratio:3/2;object-fit:cover')}
              />
              <div>
                <p style={css('font-family:var(--fu);font-size:12px;letter-spacing:.18em;color:var(--slate)')}>{r.code}</p>
                <h2 style={css('font-size:clamp(1.5rem,3vw,2.4rem);font-weight:700;letter-spacing:-.03em;margin-top:10px')}>
                  <span data-en="1">{r.name}</span>
                  <span data-bn="1">{r.nameBn}</span>
                </h2>
                <p style={css('font-size:.9375rem;line-height:1.68;color:var(--slate);margin-top:14px;max-width:52ch')}>
                  <span data-en="1">{r.blurb}</span>
                  <span data-bn="1">{r.blurbBn}</span>
                </p>
                <div style={css('display:flex;flex-wrap:wrap;gap:0 30px;align-items:baseline;margin-top:20px;padding-top:16px;border-top:var(--bl)')}>
                  <span style={css('font-family:var(--fu);font-size:13px;letter-spacing:.08em;color:var(--slate)')}>
                    {r.config}
                  </span>
                  <span style={css('font-family:var(--fu);font-size:13px;letter-spacing:.08em;color:var(--slate);font-variant-numeric:tabular-nums')}>
                    SLEEPS {r.sleeps}
                  </span>
                  <span style={css('font-family:var(--fu);font-size:1.05rem;margin-left:auto;font-variant-numeric:tabular-nums')}>
                    ৳{money(r.rate)}
                  </span>
                </div>
              </div>
            </TLink>
          ))}
        </div>
      </section>
    </div>
  );
}
