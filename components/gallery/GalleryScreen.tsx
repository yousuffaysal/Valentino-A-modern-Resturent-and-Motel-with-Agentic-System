'use client';

import React, { useMemo, useState } from 'react';
import { css } from '@/lib/css';
import type { GalleryItem } from '@/lib/defaults';

const chipStyle = (on: boolean) =>
  css(
    'font-family:var(--fu);font-size:13px;letter-spacing:.12em;padding:10px 14px;min-height:42px;border-radius:2px;white-space:nowrap;text-transform:uppercase;' +
      (on ? 'background:var(--lacquer);color:#fff;' : 'border:var(--bl);color:var(--slate);'),
  );

export function GalleryScreen({ items }: { items: GalleryItem[] }) {
  const [cat, setCat] = useState('All');

  const cats = useMemo(() => {
    const seen: string[] = [];
    items.forEach((g) => {
      if (!seen.includes(g.cat)) seen.push(g.cat);
    });
    return ['All', ...seen];
  }, [items]);

  const filtered = cat === 'All' ? items : items.filter((g) => g.cat === cat);

  return (
    <div data-screen-label="Gallery">
      <section
        data-floor="G · GALLERY"
        data-floor-id="gx"
        style={css('position:relative;height:56vh;min-height:380px;overflow:hidden;background:var(--night)')}
      >
        <div data-hv-hero-bg="1" style={css('position:absolute;inset:-8% 0')}>
          <img
            src="/img/room-executive-window.png"
            alt="Premium Executive Suite window over the town at sunrise"
            width={1440}
            height={1080}
            style={css('width:100%;height:100%;object-fit:cover;filter:brightness(.56)')}
          />
        </div>
        <div
          aria-hidden="true"
          style={css('position:absolute;inset:0;background:linear-gradient(to top,rgba(14,17,20,.94),rgba(14,17,20,.2))')}
        />
        <div style={css('position:relative;height:100%;display:flex;flex-direction:column;justify-content:flex-end;padding:0 var(--gd) clamp(40px,7vh,72px);max-width:1400px;margin:0 auto')}>
          <p style={css('display:flex;align-items:center;gap:14px;font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:rgba(233,234,229,.6)')}>
            <span aria-hidden="true" style={css('width:38px;height:1px;background:var(--brass);display:block')} />
            GALLERY
          </p>
          <h1
            data-hero-split="1"
            style={css('font-size:clamp(2.2rem,5.6vw,5rem);font-weight:700;letter-spacing:-.035em;line-height:.96;color:#fff;margin-top:20px;max-width:15ch')}
          >
            The building, top to bottom.
          </h1>
        </div>
      </section>

      <div
        data-noscroll="1"
        style={css('position:sticky;top:64px;z-index:40;background:var(--limestone);border-bottom:var(--bl);padding:14px var(--gd);overflow-x:auto')}
      >
        <div style={css('max-width:1400px;margin:0 auto;display:flex;gap:7px;width:max-content')}>
          {cats.map((c) => (
            <button key={c} type="button" onClick={() => setCat(c)} style={chipStyle(cat === c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <section aria-label="Photographs" style={css('background:var(--night);padding:clamp(30px,5vh,60px) var(--gd) var(--sy)')}>
        <div style={css('max-width:1400px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:10px')}>
          {filtered.map((g, i) => (
            <figure key={g.src + i} style={css('grid-column:span ' + (i % 5 === 0 || i % 5 === 3 ? 2 : 1))}>
              <img
                data-fill="1"
                src={g.src}
                alt={g.alt}
                loading="lazy"
                width={900}
                height={700}
                style={css('width:100%;aspect-ratio:4/3;object-fit:cover')}
              />
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
