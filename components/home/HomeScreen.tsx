'use client';

import React from 'react';
import { css } from '@/lib/css';
import { fmt, money } from '@/lib/format';
import type { Attraction, Room, Service } from '@/lib/defaults';
import { useSite } from '@/context/SiteContext';
import { TLink } from '@/components/chrome/TLink';

const NOISE =
  'url(data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22120%22%20height%3D%22120%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%22.85%22%20numOctaves%3D%223%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22120%22%20height%3D%22120%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E)';

const eyebrow = css('font-family:var(--fu);font-size:.8125rem;letter-spacing:.22em;color:var(--slate)');
const sectionH2 = css('font-size:clamp(2.2rem,5.6vw,4.2rem);font-weight:700;letter-spacing:-.035em;line-height:.96;margin-top:18px');
const heroMeta = css('font-family:var(--fu);font-size:12.5px;letter-spacing:.18em;color:rgba(233,234,229,.5);font-variant-numeric:tabular-nums');
const factCopy = css('font-size:.8125rem;color:var(--slate);margin-top:14px;line-height:1.5;max-width:22ch');
const factNumber = css('font-family:var(--fu);font-size:clamp(2.4rem,5.5vw,4.6rem);letter-spacing:-.02em;line-height:1;font-variant-numeric:tabular-nums');
const marqueeDot = css('width:4px;height:4px;background:var(--brass);border-radius:50%;display:block');

export function HomeScreen({
  rooms,
  services,
  attractions,
  fromRate,
}: {
  rooms: Room[];
  services: Service[];
  attractions: Attraction[];
  fromRate: string;
}) {
  const { openBook, openTable, ci, co, adults, kids, isBn } = useSite();

  const ciLabel = fmt(ci, isBn) || 'Add date';
  const coLabel = fmt(co, isBn) || 'Add date';
  const guestLabel = `${adults} adult${adults > 1 ? 's' : ''}${kids ? `, ${kids} child` : ''}`;
  const roomCount = String(rooms.length).padStart(2, '0');

  const marqueeRun = (
    <span style={css('display:flex;gap:44px;padding-right:44px;font-family:var(--fu);font-size:13px;letter-spacing:.2em;color:var(--slate);white-space:nowrap;align-items:center')}>
      DANESI EMERALD · ITALY
      <i style={marqueeDot} />
      MÖVENPICK · SWITZERLAND
      <i style={marqueeDot} />
      JAPANESE
      <i style={marqueeDot} />
      KOREAN
      <i style={marqueeDot} />
      CHINESE
      <i style={marqueeDot} />
      ITALIAN CAFÉ
      <i style={marqueeDot} />
    </span>
  );

  return (
    <div data-screen-label="Home">
      {/* ---------- GROUND · ARRIVAL ---------- */}
      <section
        data-floor="G · ARRIVAL"
        data-floor-id="hero"
        aria-labelledby="hero-h"
        style={css('position:relative;height:100dvh;min-height:620px;overflow:hidden;background:#000')}
      >
        <div
          aria-hidden="true"
          style={css('position:fixed;left:0;right:0;top:0;height:50.2%;background:#000;z-index:300;pointer-events:none;animation:hvShutterT 1.35s var(--eio) .45s both')}
        />
        <div
          aria-hidden="true"
          style={css('position:fixed;left:0;right:0;bottom:0;height:50.2%;background:#000;z-index:300;pointer-events:none;animation:hvShutterB 1.35s var(--eio) .45s both')}
        />
        <div
          aria-hidden="true"
          style={css('position:fixed;left:0;right:0;top:50%;height:1px;background:var(--brass);z-index:301;pointer-events:none;transform-origin:center;animation:hvHairline 1.5s var(--eo) .3s both')}
        />
        <div aria-hidden="true" style={css('position:absolute;inset:0;opacity:.05;background-image:' + NOISE)} />

        <div
          data-hv-hero-fg="1"
          style={css('position:relative;z-index:10;height:100%;display:flex;flex-direction:column;justify-content:flex-end;padding:0 var(--gd) clamp(170px,25vh,290px);max-width:1400px;margin:0 auto;will-change:transform')}
        >
          <p
            data-hero-el="1"
            style={css('display:flex;align-items:center;gap:14px;font-family:var(--fu);font-size:.8125rem;letter-spacing:.22em;color:rgba(233,234,229,.66);margin-bottom:28px')}
          >
            <span aria-hidden="true" style={css('display:block;width:38px;height:1px;background:var(--brass)')} />
            GROUND · ARRIVAL
          </p>
          <h1
            id="hero-h"
            data-hero-split="1"
            style={css('font-size:clamp(2.9rem,9.5vw,9rem);font-weight:800;letter-spacing:-.045em;line-height:.9;color:#fff;max-width:15ch')}
          >
            Main Road, top floor.
          </h1>
          <p
            data-hero-el="1"
            style={css('font-size:clamp(.98rem,1.15vw,1.125rem);line-height:1.68;color:rgba(233,234,229,.78);max-width:34ch;margin-top:26px')}
          >
            Eight room categories, 24 hour reception, and a rooftop kitchen serving Danesi coffee and Korean chicken, in
            the middle of Maijdee Court.
          </p>
          <div data-hero-el="1" style={css('display:flex;flex-wrap:wrap;gap:14px;margin-top:38px')}>
            <button
              type="button"
              onClick={() => openBook()}
              style={css('background:var(--lacquer);color:#fff;font-size:14px;font-weight:700;padding:17px 30px;min-height:52px;border-radius:2px;transition:background .3s var(--eo)')}
              data-hover-style="background:#8e1826"
            >
              <span data-en="1">Check availability</span>
              <span data-bn="1">রুম খুঁজুন</span>
            </button>
            <TLink
              href="/rooms"
              style={css('display:inline-flex;align-items:center;gap:10px;color:#fff;font-size:14px;font-weight:500;padding:17px 4px;min-height:52px;position:relative;border-bottom:1px solid rgba(255,255,255,.3)')}
              hoverStyle="border-bottom-color:#fff;color:#fff"
            >
              <span data-en="1">See the rooms</span>
              <span data-bn="1">রুম দেখুন</span>
              <span aria-hidden="true">↗</span>
            </TLink>
          </div>
          <div
            data-hero-el="1"
            style={css('display:flex;flex-wrap:wrap;gap:0 clamp(24px,4vw,58px);margin-top:clamp(34px,5vh,58px);padding-top:22px;border-top:1px solid rgba(233,234,229,.16)')}
          >
            <p style={heroMeta}>{roomCount} ROOM CATEGORIES</p>
            <p style={heroMeta}>24H RECEPTION</p>
            <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.18em;color:rgba(233,234,229,.5)')}>
              ROOFTOP SKY VIEW
            </p>
            <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.18em;color:var(--brass);font-variant-numeric:tabular-nums')}>
              FROM ৳{fromRate}
            </p>
          </div>
        </div>

        <p style={css('position:absolute;right:var(--gd);bottom:34px;font-family:var(--fu);font-size:12.5px;letter-spacing:.18em;color:rgba(233,234,229,.5);display:flex;align-items:center;gap:9px')}>
          SCROLL
          <span aria-hidden="true" style={css('display:block;width:34px;height:1px;background:rgba(233,234,229,.4)')} />
        </p>

        <div
          data-hv-hero-bg="1"
          style={css('position:absolute;left:0;right:0;top:96px;bottom:-80px;z-index:14;pointer-events:none;display:flex;align-items:flex-end;justify-content:flex-end;will-change:transform')}
        >
          <img
            data-hero-building="1"
            src="/img/exterior-night-hero.png"
            alt="Hotel Valentino at dusk, the lit Sky View restaurant on the roof above the guest floors"
            width={1536}
            height={1024}
            style={css('width:min(78%,1280px);height:auto;max-height:100%;object-fit:contain;object-position:right bottom;animation:hvRise 3.6s var(--eo) 2.5s both')}
          />
        </div>
      </section>

      {/* ---------- QUICK AVAILABILITY ---------- */}
      <section aria-label="Quick availability" style={css('position:relative;z-index:20;margin-top:-40px;padding:0 var(--gd)')}>
        <div style={css('max-width:1400px;margin:0 auto;background:var(--limestone);border:var(--bl);padding:clamp(18px,2.4vw,26px);display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:1px;box-shadow:0 24px 60px -30px rgba(14,17,20,.4)')}>
          {[
            { label: 'CHECK IN', value: ciLabel },
            { label: 'CHECK OUT', value: coLabel },
            { label: 'GUESTS', value: guestLabel },
          ].map((f) => (
            <button
              key={f.label}
              type="button"
              onClick={() => openBook()}
              style={css('text-align:left;padding:12px 16px;border-right:var(--bl)')}
            >
              <span style={css('display:block;font-family:var(--fu);font-size:12px;letter-spacing:.2em;color:var(--slate)')}>
                {f.label}
              </span>
              <span style={css('display:block;margin-top:9px;font-size:15px;font-weight:500')}>{f.value}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => openBook()}
            style={css('background:var(--ink);color:var(--limestone);font-size:14px;font-weight:700;padding:18px 20px;min-height:56px;border-radius:2px;transition:background .3s var(--eo)')}
            data-hover-style="background:var(--lacquer)"
          >
            <span data-en="1">Check availability</span>
            <span data-bn="1">খালি রুম দেখুন</span>
          </button>
        </div>
      </section>

      {/* ---------- GROUND · THE IDEA ---------- */}
      <section
        data-floor="G · THE IDEA"
        data-floor-id="idea"
        aria-label="Why Valentino exists"
        data-hv-mani-wrap="1"
        style={css('position:relative;background:var(--limestone);height:260vh;margin-top:var(--sy)')}
      >
        <div style={css('position:sticky;top:0;height:100vh;display:flex;align-items:center;overflow:hidden')}>
          <img
            data-hv-mani-bg="1"
            src="/img/exterior-skyview-day.png"
            alt=""
            aria-hidden="true"
            style={css('position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.12;transform:scale(1.15)')}
          />
          <div style={css('position:relative;max-width:1400px;margin:0 auto;padding:0 var(--gd);width:100%')}>
            <p style={css('font-family:var(--fu);font-size:.8125rem;letter-spacing:.22em;color:var(--slate);margin-bottom:clamp(28px,5vh,54px)')}>
              GROUND · THE IDEA
            </p>
            <p
              data-hv-mani="1"
              style={css('font-size:clamp(2.2rem,5.6vw,4.2rem);font-weight:700;letter-spacing:-.035em;line-height:.96;max-width:17ch;color:var(--slate)')}
            >
              Noakhali sends its people everywhere. They come home carrying a standard. We built Valentino to meet it on
              Main Road, and to keep the rate honest.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- 01 · ROOMS ---------- */}
      <section
        data-floor="01 · ROOMS"
        data-floor-id="rooms"
        aria-labelledby="rooms-h"
        data-hv-track-wrap="1"
        style={css('position:relative;background:var(--limestone);padding-top:var(--sy)')}
      >
        <div style={css('position:sticky;top:0;height:100vh;display:flex;flex-direction:column;justify-content:center;overflow:hidden')}>
          <div style={css('padding:0 var(--gd);max-width:1400px;margin:0 auto;width:100%')}>
            <p style={eyebrow}>ROOMS · {roomCount} CATEGORIES</p>
            <h2 id="rooms-h" style={css('font-size:clamp(2.2rem,5.6vw,4.2rem);font-weight:700;letter-spacing:-.035em;line-height:.96;margin-top:18px;max-width:16ch')}>
              Eight ways to sleep in Maijdee.
            </h2>
          </div>
          <div
            data-hv-track-scroll="1"
            data-noscroll="1"
            style={css('margin-top:clamp(30px,5vh,58px);overflow-x:auto;overflow-y:hidden')}
          >
            <div
              data-hv-track="1"
              style={css('display:flex;gap:clamp(14px,1.6vw,26px);padding:0 var(--gd);width:max-content;will-change:transform')}
            >
              {rooms.map((r) => (
                <TLink
                  key={r.code}
                  href={'/rooms/' + r.slug}
                  style={css('min-width:clamp(272px,32vw,440px);width:clamp(272px,32vw,440px);color:inherit;display:block;scroll-snap-align:center')}
                >
                  <div style={css('position:relative;overflow:hidden;aspect-ratio:4/5;background:var(--mist)')}>
                    <img
                      src={r.img}
                      alt={r.alt}
                      loading="lazy"
                      width={800}
                      height={1000}
                      style={css('width:100%;height:100%;object-fit:cover;transition:transform 1.05s var(--eo)')}
                      data-hover-style="transform:scale(1.05)"
                    />
                    <span style={css('position:absolute;left:0;top:0;background:var(--ink);color:var(--limestone);font-family:var(--fu);font-size:12.5px;letter-spacing:.14em;padding:8px 11px')}>
                      {r.code}
                    </span>
                  </div>
                  <div style={css('display:flex;justify-content:space-between;align-items:baseline;gap:16px;margin-top:16px')}>
                    <h3 style={css('font-size:clamp(1.05rem,1.5vw,1.35rem);font-weight:700;letter-spacing:-.015em')}>
                      <span data-en="1">{r.name}</span>
                      <span data-bn="1">{r.nameBn}</span>
                    </h3>
                    <span style={css('font-family:var(--fu);font-size:.9375rem;font-variant-numeric:tabular-nums;white-space:nowrap')}>
                      ৳{money(r.rate)}
                    </span>
                  </div>
                  <p style={css('font-size:.8125rem;color:var(--slate);margin-top:7px;line-height:1.5')}>
                    <span data-en="1">
                      {r.config} · Sleeps {r.sleeps}
                    </span>
                    <span data-bn="1">
                      {r.configBn} · {r.sleeps} জন
                    </span>
                  </p>
                </TLink>
              ))}
              <div style={css('min-width:clamp(230px,26vw,340px);display:flex;align-items:center')}>
                <TLink
                  href="/rooms"
                  style={css('display:block;border:var(--bl);padding:34px;width:100%;color:inherit')}
                  hoverStyle="background:var(--mist);color:var(--ink)"
                >
                  <span style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:var(--slate)')}>
                    {roomCount} / {roomCount}
                  </span>
                  <span style={css('display:block;font-size:1.4rem;font-weight:700;letter-spacing:-.02em;margin-top:14px')}>
                    Compare all eight ↗
                  </span>
                </TLink>
              </div>
            </div>
          </div>
          <p
            data-hv-track-idx={rooms.length}
            style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.18em;color:var(--slate);padding:18px var(--gd) 0;max-width:1400px;margin:0 auto;width:100%;font-variant-numeric:tabular-nums')}
          >
            01 / {roomCount}
          </p>
        </div>
      </section>

      {/* ---------- 01 · FACTS ---------- */}
      <section
        data-floor="01 · FACTS"
        data-floor-id="facts"
        aria-label="Hotel in numbers"
        style={css('background:var(--limestone);padding:var(--sy) var(--gd);border-top:var(--bl)')}
      >
        <div style={css('max-width:1400px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:clamp(28px,4vw,60px)')}>
          <div data-rev="1">
            <p data-count="8" data-suffix="" data-pad="2" style={factNumber}>
              08
            </p>
            <p style={factCopy}>
              <span data-en="1">Room categories, from BDT 2,500 to BDT 10,500</span>
              <span data-bn="1">রুম ক্যাটাগরি, ২,৫০০ থেকে ১০,৫০০ টাকা</span>
            </p>
          </div>
          <div data-rev="1">
            <p data-count="24" data-suffix="H" style={factNumber}>
              24H
            </p>
            <p style={factCopy}>
              <span data-en="1">Reception and room service, every day</span>
              <span data-bn="1">২৪ ঘণ্টা রিসেপশন ও রুম সার্ভিস</span>
            </p>
          </div>
          <div data-rev="1">
            <p data-count="1" data-suffix=" KM" style={factNumber}>
              1 KM
            </p>
            <p style={factCopy}>
              <span data-en="1">To Maijdee Court train station and bus station</span>
              <span data-bn="1">মাইজদী কোর্ট রেল ও বাস স্টেশন থেকে ১ কিমি</span>
            </p>
          </div>
          <div data-rev="1">
            <p data-count="100" data-suffix="%" style={factNumber}>
              100%
            </p>
            <p style={factCopy}>
              <span data-en="1">Free Wi-Fi and free parking, all rooms</span>
              <span data-bn="1">সব রুমে ফ্রি ওয়াই-ফাই ও ফ্রি পার্কিং</span>
            </p>
          </div>
        </div>
      </section>

      {/* ---------- 02 · SERVICES ---------- */}
      <section
        data-floor="02 · SERVICES"
        data-floor-id="services"
        aria-labelledby="svc-h"
        style={css('background:var(--mist);padding:var(--sy) var(--gd)')}
      >
        <div style={css('max-width:1400px;margin:0 auto')}>
          <p style={eyebrow}>SERVICES · 01 — {String(services.length).padStart(2, '0')}</p>
          <h2 id="svc-h" data-rev="1" style={css('font-size:clamp(2.2rem,5.6vw,4.2rem);font-weight:700;letter-spacing:-.035em;line-height:.96;margin-top:18px;max-width:18ch')}>
            Things reception can actually arrange.
          </h2>
          <div
            data-hv-svc-grid="1"
            style={css('display:grid;grid-template-columns:1fr;gap:clamp(30px,4vw,70px);margin-top:clamp(40px,6vh,80px)')}
          >
            <div data-hv-svc-media-wrap="1" style={css('position:relative;align-self:start')}>
              <div style={css('position:relative;aspect-ratio:4/5;overflow:hidden;background:var(--slate)')}>
                {services.map((s) => (
                  <img
                    key={s.num + s.en}
                    data-hv-svc-media="1"
                    src={s.img}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    width={900}
                    height={1125}
                    style={css('position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .7s var(--esoft)')}
                  />
                ))}
              </div>
              <p
                data-hv-svc-idx="1"
                style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:var(--slate);margin-top:14px;font-variant-numeric:tabular-nums')}
              >
                01 / {String(services.length).padStart(2, '0')}
              </p>
            </div>
            <div>
              {services.map((s) => (
                <div
                  key={s.num + s.en}
                  data-hv-svc-block="1"
                  style={css('padding:clamp(26px,4vh,52px) 0;border-top:var(--bl);opacity:.3;transition:opacity .5s var(--esoft)')}
                >
                  <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:var(--slate);font-variant-numeric:tabular-nums')}>
                    {s.num}
                  </p>
                  <h3 style={css('font-size:clamp(1.3rem,2.4vw,2rem);font-weight:700;letter-spacing:-.025em;margin-top:12px')}>
                    <span data-en="1">{s.en}</span>
                    <span data-bn="1">{s.bn}</span>
                  </h3>
                  <p style={css('font-size:.9375rem;line-height:1.68;color:var(--slate);margin-top:12px;max-width:46ch')}>
                    {s.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- ROOFTOP · SKY VIEW ---------- */}
      <section
        data-floor="R · SKY VIEW"
        data-floor-id="skyview"
        aria-labelledby="sv-h"
        style={css('background:var(--night);color:var(--limestone);padding:var(--sy) 0 0')}
      >
        <div
          data-two-col="1.05fr .95fr"
          style={css('max-width:1400px;margin:0 auto;padding:0 var(--gd);display:grid;grid-template-columns:1fr;gap:clamp(34px,5vw,70px);align-items:center')}
        >
          <div>
            <p style={css('font-family:var(--fu);font-size:.8125rem;letter-spacing:.22em;color:rgba(233,234,229,.5)')}>
              ROOFTOP · SKY VIEW
            </p>
            <h2 id="sv-h" data-rev="1" style={css('font-size:clamp(2.2rem,5.6vw,4.2rem);font-weight:700;letter-spacing:-.035em;line-height:.96;margin-top:18px;max-width:14ch')}>
              Italian beans. Korean heat. Noakhali roof.
            </h2>
            <p data-rev="1" style={css('font-size:1rem;line-height:1.68;color:rgba(233,234,229,.72);margin-top:26px;max-width:52ch')}>
              Sky View sits on the top floor of the building. The kitchen runs Chinese, Japanese and Korean, and the café
              pulls espresso from Danesi Emerald beans shipped from Italy.
            </p>
            <p data-rev="1" style={css('font-size:1rem;line-height:1.68;color:rgba(233,234,229,.72);margin-top:18px;max-width:52ch')}>
              Mövenpick ice cream comes from Switzerland. That is the whole claim. Come up and check it.
            </p>
            <div data-rev="1" style={css('display:flex;flex-wrap:wrap;gap:14px;margin-top:34px')}>
              <TLink
                href="/restaurant"
                style={css('display:inline-flex;align-items:center;gap:10px;color:var(--limestone);font-size:14px;font-weight:600;padding:15px 0;min-height:48px;border-bottom:1px solid rgba(233,234,229,.3)')}
                hoverStyle="border-bottom-color:var(--limestone);color:#fff"
              >
                See the menu <span aria-hidden="true">↗</span>
              </TLink>
              <button
                type="button"
                onClick={openTable}
                style={css('border:var(--bd);color:var(--limestone);font-size:14px;font-weight:600;padding:15px 24px;min-height:48px;border-radius:2px;transition:background .3s var(--eo)')}
                data-hover-style="background:rgba(233,234,229,.08)"
              >
                Reserve a table
              </button>
            </div>
          </div>
          <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:10px')}>
            <img
              data-fill="1"
              src="/img/dish-crispy-fried-chicken.png"
              alt="Crispy fried chicken served on a stone plate at Sky View"
              loading="lazy"
              width={1440}
              height={1080}
              style={css('width:100%;aspect-ratio:4/5;object-fit:cover')}
            />
            <img
              data-fill="1"
              data-fill-delay="140"
              src="/img/dish-teriyaki-chicken.png"
              alt="Teriyaki chicken with fried rice and stir fried vegetables"
              loading="lazy"
              width={1440}
              height={1080}
              style={css('width:100%;aspect-ratio:4/5;object-fit:cover;margin-top:clamp(20px,4vw,54px)')}
            />
          </div>
        </div>
        <div
          aria-hidden="true"
          style={css('margin-top:var(--sy);border-top:var(--bd);border-bottom:var(--bd);overflow:hidden;padding:20px 0')}
        >
          <div
            style={css('display:flex;width:max-content;animation:hvmarquee 32s linear infinite')}
            data-hover-style="animation-play-state:paused"
          >
            {marqueeRun}
            {marqueeRun}
          </div>
        </div>
      </section>

      {/* ---------- ROOFTOP · WORDMARK ---------- */}
      <section
        data-floor="R · VALENTINO"
        data-floor-id="wordmark"
        aria-label="Hotel Valentino"
        data-hv-wm-wrap="1"
        style={css('background:#000;position:relative;height:320vh')}
      >
        <div style={css('position:sticky;top:0;height:100vh;overflow:hidden;display:flex;align-items:center;justify-content:center')}>
          <h2 style={css('position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap')}>
            Hotel Valentino
          </h2>
          <div
            data-hv-mask-stage="1"
            style={css('position:absolute;inset:0;width:100%;height:100%;transform-origin:center center;will-change:transform')}
          >
            <img
              data-hv-wm-img="1"
              src="/img/exterior-skyview-day.png"
              alt=""
              aria-hidden="true"
              style={css('position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform-origin:center center;will-change:transform')}
            />
            <svg
              viewBox="0 0 1200 300"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
              style={css('position:absolute;inset:0;width:100%;height:100%')}
            >
              <defs>
                <mask id="hv-wm">
                  <rect width="100%" height="100%" fill="#fff" />
                  <text
                    x="50%"
                    y="63%"
                    textAnchor="middle"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    fontWeight="800"
                    fontSize="200"
                    letterSpacing="-10"
                    fill="#000"
                  >
                    VALENTINO
                  </text>
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="#0E1114" mask="url(#hv-wm)" />
            </svg>
          </div>
          <p style={css('text-align:center;font-family:var(--fu);font-size:12.5px;letter-spacing:.24em;color:var(--slate);position:absolute;left:0;right:0;bottom:30px;z-index:5')}>
            MAIN ROAD · MAIJDEE COURT · SINCE THE BUILDING WENT UP
          </p>
        </div>
      </section>

      {/* ---------- NOAKHALI ---------- */}
      <section
        data-floor="N · NOAKHALI"
        data-floor-id="explore"
        aria-labelledby="ex-h"
        style={css('background:var(--limestone);padding:var(--sy) var(--gd)')}
      >
        <div style={css('max-width:1400px;margin:0 auto')}>
          <p style={eyebrow}>NOAKHALI · {String(attractions.length).padStart(2, '0')} PLACES</p>
          <h2 id="ex-h" data-rev="1" style={css('font-size:clamp(2.2rem,5.6vw,4.2rem);font-weight:700;letter-spacing:-.035em;line-height:.96;margin-top:18px;max-width:16ch')}>
            What the tour desk sends people to.
          </h2>
          <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:clamp(14px,1.8vw,26px);margin-top:clamp(38px,6vh,70px)')}>
            {attractions.map((e) => (
              <TLink key={e.slug} href={'/explore/' + e.slug} data-rev="1" style={css('color:inherit;display:block')}>
                <div style={css('position:relative;overflow:hidden;aspect-ratio:3/4;background:var(--mist)')}>
                  <img
                    src={e.img}
                    alt={e.name}
                    loading="lazy"
                    style={css('position:absolute;inset:-6% 0;width:100%;height:112%;object-fit:cover')}
                  />
                </div>
                <div style={css('display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-top:14px')}>
                  <h3 style={css('font-size:1.05rem;font-weight:700;letter-spacing:-.015em')}>{e.name}</h3>
                  <span style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.1em;color:var(--slate);white-space:nowrap;font-variant-numeric:tabular-nums')}>
                    {e.dist}
                  </span>
                </div>
                <p style={css('font-size:.8125rem;color:var(--slate);margin-top:6px;line-height:1.5')}>{e.line}</p>
              </TLink>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- GROUND · LOCATION ---------- */}
      <section
        data-floor="G · LOCATION"
        data-floor-id="location"
        aria-labelledby="loc-h"
        style={css('position:relative;background:var(--mist);padding:var(--sy) var(--gd);overflow:hidden')}
      >
        <div
          data-hv-map-para="1"
          aria-hidden="true"
          style={css('position:absolute;inset:0;background:url(/img/real-map-bw.png) center/cover no-repeat;filter:grayscale(1) contrast(1.15);opacity:.9')}
        >
          <div style={css('position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:14px;height:14px;background:#A81E2D;border-radius:50%;box-shadow:0 0 0 rgba(168,30,45,0.7);animation:hv-map-pulse 2s infinite;z-index:2')} />
          <div style={css('position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:32px;height:32px;border:2px solid #A81E2D;border-radius:50%;opacity:0.6;z-index:1')} />
        </div>
        <div style={css('position:relative;max-width:1400px;margin:0 auto;display:flex;justify-content:flex-end')}>
          <div data-rev="1" style={css('background:var(--limestone);border:var(--bl);padding:clamp(26px,3.4vw,46px);max-width:520px;width:100%')}>
            <p style={eyebrow}>GROUND · LOCATION</p>
            <h2 id="loc-h" style={css('font-size:clamp(1.6rem,3vw,2.4rem);font-weight:700;letter-spacing:-.03em;line-height:1.05;margin-top:16px')}>
              Boro Masjid Moar, Main Road.
            </h2>
            <address style={css('font-style:normal;font-size:.9375rem;line-height:1.68;color:var(--slate);margin-top:18px')}>
              Ahsan Bhaban (Shwapno Super Shop), Guptanka, Main Road, Maijdee Court, Sadar, Noakhali-3800
            </address>
            <dl style={css('display:grid;grid-template-columns:1fr auto;gap:12px 18px;margin-top:26px;padding-top:22px;border-top:var(--bl);font-size:.8125rem')}>
              <dt style={css('color:var(--slate)')}>Maijdee Court train station</dt>
              <dd style={css('font-family:var(--fu);font-variant-numeric:tabular-nums')}>1 KM</dd>
              <dt style={css('color:var(--slate)')}>Maijdee Court bus station</dt>
              <dd style={css('font-family:var(--fu);font-variant-numeric:tabular-nums')}>1 KM</dd>
              <dt style={css('color:var(--slate)')}>NSTU campus</dt>
              <dd style={css('font-family:var(--fu);font-variant-numeric:tabular-nums;color:var(--brass)')}>CONFIRM</dd>
            </dl>
            <TLink
              href="/contact"
              style={css('display:inline-flex;align-items:center;gap:9px;margin-top:26px;font-size:14px;font-weight:600;min-height:44px;border-bottom:1px solid var(--lacquer)')}
            >
              Get directions <span aria-hidden="true">↗</span>
            </TLink>
          </div>
        </div>
      </section>

      {/* ---------- ASSURANCES ---------- */}
      <section
        aria-label="Booking assurances"
        style={css('background:var(--limestone);padding:clamp(40px,6vh,70px) var(--gd);border-top:var(--bl)')}
      >
        <div style={css('max-width:1400px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:clamp(20px,3vw,44px)')}>
          {[
            { label: 'RECEPTION', copy: 'Open 24 hours. Someone answers the phone at 3am.' },
            { label: 'PAYMENT', copy: 'bKash, Nagad, card, or pay at the desk on arrival.' },
            { label: 'CANCELLATION', copy: 'Free cancellation window is being confirmed with the hotel.' },
          ].map((a) => (
            <div key={a.label}>
              <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:var(--brass)')}>{a.label}</p>
              <p style={css('font-size:.9375rem;margin-top:10px;line-height:1.6')}>{a.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- GROUND · BOOK ---------- */}
      <section
        data-floor="G · BOOK"
        data-floor-id="cta"
        aria-labelledby="cta-h"
        style={css('background:var(--night);color:var(--limestone);padding:var(--sy) var(--gd)')}
      >
        <div style={css('max-width:1400px;margin:0 auto')}>
          <h2 id="cta-h" data-rev="1" style={css('font-size:clamp(2.2rem,6.4vw,5rem);font-weight:700;letter-spacing:-.04em;line-height:.96;max-width:14ch')}>
            Room from BDT {fromRate}. Reception picks up.
          </h2>
          <a
            href="tel:+8801795855555"
            data-rev="1"
            style={css('display:inline-block;font-family:var(--fu);font-size:clamp(1.4rem,4vw,3rem);letter-spacing:-.02em;color:var(--limestone);margin-top:clamp(30px,5vh,54px);font-variant-numeric:tabular-nums;border-bottom:1px solid rgba(233,234,229,.28)')}
            data-hover-style="border-bottom-color:var(--lacquer);color:#fff"
          >
            +880 1795 855555
          </a>
          <div data-rev="1" style={css('display:flex;flex-wrap:wrap;gap:14px;margin-top:clamp(30px,5vh,54px)')}>
            <button
              type="button"
              onClick={() => openBook()}
              style={css('background:var(--lacquer);color:#fff;font-size:14px;font-weight:700;padding:17px 30px;min-height:52px;border-radius:2px;transition:background .3s var(--eo)')}
              data-hover-style="background:#8e1826"
            >
              Book a room
            </button>
            <button
              type="button"
              onClick={openTable}
              style={css('border:var(--bd);color:var(--limestone);font-size:14px;font-weight:600;padding:17px 28px;min-height:52px;border-radius:2px;transition:background .3s var(--eo)')}
              data-hover-style="background:rgba(233,234,229,.08)"
            >
              Reserve a table
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
