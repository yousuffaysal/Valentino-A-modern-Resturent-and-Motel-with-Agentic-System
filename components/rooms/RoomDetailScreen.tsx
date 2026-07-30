'use client';

import React from 'react';
import { css } from '@/lib/css';
import { money } from '@/lib/format';
import { ROOM_INCLUDED, type Room } from '@/lib/defaults';
import { useSite } from '@/context/SiteContext';
import { TLink } from '@/components/chrome/TLink';

export function RoomDetailScreen({ room, others }: { room: Room; others: Room[] }) {
  const { openBook, settings } = useSite();
  const phone = settings.phonePrimary ?? '+880 1795 855555';

  return (
    <div data-screen-label="Room detail">
      <section
        data-floor="01 · ROOM"
        data-floor-id="rhero"
        aria-labelledby="rd-h"
        style={css('position:relative;height:62vh;min-height:460px;overflow:hidden;background:var(--night)')}
      >
        <div data-hv-hero-bg="1" style={css('position:absolute;inset:-8% 0;will-change:transform')}>
          <img
            src={room.img}
            alt={room.alt}
            width={1440}
            height={1080}
            style={css('width:100%;height:100%;object-fit:cover;filter:brightness(.66)')}
          />
        </div>
        <div
          aria-hidden="true"
          style={css('position:absolute;inset:0;background:linear-gradient(to top,rgba(14,17,20,.92),rgba(14,17,20,.15))')}
        />
        <div style={css('position:relative;height:100%;display:flex;flex-direction:column;justify-content:flex-end;padding:0 var(--gd) clamp(40px,7vh,72px);max-width:1400px;margin:0 auto')}>
          <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:rgba(233,234,229,.55)')}>
            <TLink href="/rooms" style={css('color:rgba(233,234,229,.55)')} hoverStyle="color:#fff">
              ROOMS
            </TLink>{' '}
            / {room.code}
          </p>
          <h1
            id="rd-h"
            data-hero-split="1"
            style={css('font-size:clamp(2.2rem,5.6vw,5rem);font-weight:700;letter-spacing:-.035em;line-height:.96;color:#fff;margin-top:20px')}
          >
            {room.name}
          </h1>
          <p
            data-hero-el="1"
            style={css('font-family:var(--fu);font-size:13.5px;letter-spacing:.14em;color:rgba(233,234,229,.7);margin-top:20px;font-variant-numeric:tabular-nums')}
          >
            {room.config} · SLEEPS {room.sleeps} · ৳{money(room.rate)} / NIGHT
          </p>
        </div>
      </section>

      <section aria-label="Room detail" style={css('background:var(--limestone);padding:var(--sy) var(--gd)')}>
        <div
          data-two-col="1.25fr .75fr"
          style={css('max-width:1400px;margin:0 auto;display:grid;grid-template-columns:1fr;gap:clamp(34px,5vw,80px);align-items:start')}
        >
          <div>
            <p style={css('font-size:clamp(1.3rem,2.4vw,1.9rem);font-weight:500;letter-spacing:-.02em;line-height:1.42;max-width:34ch')}>
              <span data-en="1">{room.blurb}</span>
              <span data-bn="1">{room.blurbBn}</span>
            </p>
            <img
              data-fill="1"
              src={room.img}
              alt={room.alt}
              loading="lazy"
              width={1440}
              height={1080}
              style={css('width:100%;aspect-ratio:16/10;object-fit:cover;margin-top:clamp(34px,5vh,64px)')}
            />
            <h2 style={css('font-size:1.35rem;font-weight:700;letter-spacing:-.025em;margin-top:clamp(40px,6vh,72px)')}>
              <span data-en="1">In every room</span>
              <span data-bn="1">প্রতিটি রুমে</span>
            </h2>
            <ul style={css('list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1px;margin-top:22px;border-top:var(--bl)')}>
              {ROOM_INCLUDED.map((item) => (
                <li
                  key={item}
                  style={css('padding:15px 0;border-bottom:var(--bl);font-size:.9375rem;display:flex;gap:12px;align-items:center')}
                >
                  <span aria-hidden="true" style={css('width:5px;height:5px;background:var(--brass);display:block;flex:0 0 auto')} />
                  {item}
                </li>
              ))}
            </ul>
            <p style={css('font-size:.8125rem;color:var(--slate);line-height:1.68;margin-top:26px;max-width:52ch')}>
              Check in from 12:00, check out by 12:00. Reception is staffed around the clock, so a late arrival off the
              Dhaka coach is not a problem. Tell them the time when you book.
            </p>
          </div>

          <aside style={css('position:sticky;top:110px')}>
            <div style={css('border:var(--bl);background:var(--limestone);padding:clamp(22px,2.6vw,32px)')}>
              <p style={css('font-family:var(--fu);font-size:12px;letter-spacing:.2em;color:var(--slate)')}>{room.code}</p>
              <p style={css('font-family:var(--fu);font-size:clamp(1.5rem,3vw,2.1rem);letter-spacing:-.02em;margin-top:12px;font-variant-numeric:tabular-nums')}>
                ৳{money(room.rate)}
              </p>
              <p style={css('font-size:.8125rem;color:var(--slate);margin-top:5px')}>per night, before VAT and service</p>
              <dl style={css('display:grid;grid-template-columns:1fr auto;gap:11px 16px;margin-top:24px;padding-top:20px;border-top:var(--bl);font-size:.8125rem')}>
                <dt style={css('color:var(--slate)')}>Beds</dt>
                <dd style={css('text-align:right')}>
                  <span data-en="1">{room.config}</span>
                  <span data-bn="1">{room.configBn}</span>
                </dd>
                <dt style={css('color:var(--slate)')}>Sleeps</dt>
                <dd style={css('font-family:var(--fu);text-align:right;font-variant-numeric:tabular-nums')}>{room.sleeps}</dd>
                <dt style={css('color:var(--slate)')}>Reception</dt>
                <dd style={css('font-family:var(--fu);text-align:right')}>24H</dd>
              </dl>
              <button
                type="button"
                onClick={() => openBook(room.code)}
                style={css('width:100%;background:var(--lacquer);color:#fff;font-size:14px;font-weight:700;padding:16px;min-height:52px;border-radius:2px;margin-top:24px;transition:background .3s var(--eo)')}
                data-hover-style="background:#8e1826"
              >
                <span data-en="1">Book this room</span>
                <span data-bn="1">এই রুম বুক করুন</span>
              </button>
              <a
                href={'tel:' + phone.replace(/\s/g, '')}
                style={css('display:block;text-align:center;font-family:var(--fu);font-size:13.5px;letter-spacing:.08em;color:var(--slate);margin-top:16px;min-height:44px;line-height:44px;font-variant-numeric:tabular-nums')}
                data-hover-style="color:var(--ink)"
              >
                OR CALL {phone}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section aria-labelledby="other-h" style={css('background:var(--mist);padding:var(--sy) var(--gd)')}>
        <div style={css('max-width:1400px;margin:0 auto')}>
          <p style={css('font-family:var(--fu);font-size:.8125rem;letter-spacing:.22em;color:var(--slate)')}>
            ROOMS · OTHER CATEGORIES
          </p>
          <h2 id="other-h" style={css('font-size:clamp(1.7rem,3.4vw,2.8rem);font-weight:700;letter-spacing:-.03em;margin-top:16px')}>
            Not the right fit
          </h2>
          <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:clamp(14px,1.8vw,26px);margin-top:clamp(30px,5vh,54px)')}>
            {others.map((r) => (
              <TLink key={r.code} href={'/rooms/' + r.slug} data-rev="1" style={css('color:inherit;display:block')}>
                <img
                  src={r.img}
                  alt={r.alt}
                  loading="lazy"
                  width={800}
                  height={1000}
                  style={css('width:100%;aspect-ratio:4/5;object-fit:cover')}
                />
                <div style={css('display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-top:13px')}>
                  <h3 style={css('font-size:.9375rem;font-weight:700;letter-spacing:-.01em')}>{r.name}</h3>
                  <span style={css('font-family:var(--fu);font-size:.8125rem;font-variant-numeric:tabular-nums')}>
                    ৳{money(r.rate)}
                  </span>
                </div>
              </TLink>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
