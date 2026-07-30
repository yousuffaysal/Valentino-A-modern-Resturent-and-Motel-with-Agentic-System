'use client';

import React, { useMemo, useState } from 'react';
import { css } from '@/lib/css';
import { money } from '@/lib/format';
import { MENU_CAT_IMAGES, MENU_CAT_NOTES, type MenuItem } from '@/lib/defaults';
import { useSite } from '@/context/SiteContext';

const chipStyle = (on: boolean) =>
  css(
    'font-family:var(--fu);font-size:13px;letter-spacing:.12em;padding:10px 14px;min-height:42px;border-radius:2px;white-space:nowrap;text-transform:uppercase;' +
      (on ? 'background:var(--lacquer);color:#fff;' : 'border:var(--bl);color:var(--slate);'),
  );

export function RestaurantScreen({ menu, hours }: { menu: MenuItem[]; hours: string }) {
  const { openTable } = useSite();
  const [cat, setCat] = useState('All');

  const cats = useMemo(() => {
    const seen: string[] = [];
    menu.forEach((m) => {
      if (!seen.includes(m.cat)) seen.push(m.cat);
    });
    return seen;
  }, [menu]);

  const spreads = useMemo(
    () =>
      cats.map((c, i) => ({
        cat: c,
        num: String(i + 1).padStart(2, '0'),
        img: MENU_CAT_IMAGES[c] ?? null,
        items: menu.filter((m) => m.cat === c),
        nextCat: cats[i + 1] ?? 'End of menu',
        nextNum: cats[i + 1] ? String(i + 2).padStart(2, '0') : '—',
        nextNote: cats[i + 1]
          ? MENU_CAT_NOTES[cats[i + 1]] ?? ''
          : 'Everything above is cooked to order on the roof.',
      })),
    [cats, menu],
  );

  const filtered = cat === 'All' ? menu : menu.filter((m) => m.cat === cat);
  const firstCat = cats[0] ?? 'Appetizers';

  return (
    <div data-screen-label="Sky View">
      <section
        data-floor="R · SKY VIEW"
        data-floor-id="sv"
        style={css('position:relative;height:62vh;min-height:420px;overflow:hidden;background:var(--night)')}
      >
        <div data-hv-hero-bg="1" style={css('position:absolute;inset:-8% 0')}>
          <img
            src="/img/dish-bbq-chicken-rice.png"
            alt="Barbecue chicken with fried rice and potato wedges at Sky View"
            width={1134}
            height={1417}
            style={css('width:100%;height:100%;object-fit:cover;filter:brightness(.55)')}
          />
        </div>
        <div
          aria-hidden="true"
          style={css('position:absolute;inset:0;background:linear-gradient(to top,rgba(14,17,20,.95),rgba(14,17,20,.25))')}
        />
        <div style={css('position:relative;height:100%;display:flex;flex-direction:column;justify-content:flex-end;padding:0 var(--gd) clamp(40px,7vh,72px);max-width:1400px;margin:0 auto')}>
          <p style={css('display:flex;align-items:center;gap:14px;font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:rgba(233,234,229,.6)')}>
            <span aria-hidden="true" style={css('width:38px;height:1px;background:var(--brass);display:block')} />
            ROOFTOP · SKY VIEW
          </p>
          <h1
            data-hero-split="1"
            style={css('font-size:clamp(2.2rem,5.6vw,5rem);font-weight:700;letter-spacing:-.035em;line-height:.96;color:#fff;margin-top:20px;max-width:14ch')}
          >
            Italian beans. Korean heat. Noakhali roof.
          </h1>
        </div>
      </section>

      <section aria-label="About Sky View" style={css('background:var(--night);color:var(--limestone);padding:var(--sy) var(--gd)')}>
        <div
          data-two-col="1fr 1fr"
          style={css('max-width:1400px;margin:0 auto;display:grid;grid-template-columns:1fr;gap:clamp(30px,4vw,70px)')}
        >
          <p style={css('font-size:clamp(1.3rem,2.6vw,2rem);font-weight:500;letter-spacing:-.02em;line-height:1.4;max-width:26ch')}>
            Sky View is on the top floor. Chinese, Japanese and Korean from one kitchen, and an Italian café next to it.
          </p>
          <div>
            <p style={css('font-size:1rem;line-height:1.68;color:rgba(233,234,229,.72);max-width:52ch')}>
              The coffee is pulled from Danesi Emerald beans shipped from Italy. The ice cream is Mövenpick, from
              Switzerland. Those are the two imports the kitchen will not substitute, and they are the reason the café list
              reads the way it does.
            </p>
            <p style={css('font-size:1rem;line-height:1.68;color:rgba(233,234,229,.72);max-width:52ch;margin-top:18px')}>
              Everything else is cooked to order on the roof. The Hunan chicken is genuinely hot. The BBQ whole chicken is
              built for a table of six. Reception can send any of it down to your room.
            </p>
            <dl style={css('display:grid;grid-template-columns:auto 1fr;gap:12px 26px;margin-top:32px;padding-top:22px;border-top:var(--bd);font-size:.875rem')}>
              <dt style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.18em;color:var(--slate);align-self:center')}>
                HOURS
              </dt>
              <dd style={css('color:var(--brass);font-family:var(--fu);font-size:13.5px')}>{hours}</dd>
              <dt style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.18em;color:var(--slate);align-self:center')}>
                FLOOR
              </dt>
              <dd>Rooftop, above the guest floors</dd>
              <dt style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.18em;color:var(--slate);align-self:center')}>
                BOOKING
              </dt>
              <dd>Tables held 20 minutes past the time</dd>
            </dl>
            <button
              type="button"
              onClick={openTable}
              style={css('background:var(--lacquer);color:#fff;font-size:14px;font-weight:700;padding:16px 28px;min-height:52px;border-radius:2px;margin-top:28px')}
            >
              Reserve a table
            </button>
          </div>
        </div>
      </section>

      <section aria-label="Menu" style={css('background:var(--limestone);padding:var(--sy) 0 0')}>
        <div style={css('max-width:1400px;margin:0 auto;padding:0 var(--gd)')}>
          <p style={css('font-family:var(--fu);font-size:.8125rem;letter-spacing:.22em;color:var(--slate)')}>
            MENU · PRICES IN BDT
          </p>
          <h2 style={css('font-size:clamp(2.2rem,5.6vw,4.2rem);font-weight:700;letter-spacing:-.035em;line-height:.96;margin-top:16px')}>
            What the kitchen sends up.
          </h2>
        </div>

        {/* The scroll-driven menu book. Each leaf flips as the section scrolls. */}
        <div data-hv-book-wrap="1" style={css('position:relative;margin-top:clamp(28px,4vh,50px);background:var(--night)')}>
          <div style={css('position:sticky;top:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;padding:clamp(60px,10vh,90px) var(--gd) clamp(30px,5vh,50px)')}>
            <div style={css('position:relative;width:min(1080px,94vw);aspect-ratio:16/10;perspective:2600px')}>
              <div style={css('position:absolute;inset:0;display:flex;background:var(--limestone);box-shadow:0 50px 110px -40px rgba(0,0,0,.75)')}>
                <div style={css('width:50%;height:100%;padding:clamp(22px,3.4vw,48px);border-right:1px solid rgba(22,24,26,.14);display:flex;flex-direction:column;justify-content:space-between')}>
                  <div>
                    <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.22em;color:var(--brass)')}>
                      01 · {firstCat.toUpperCase()}
                    </p>
                    <h3 style={css('font-size:clamp(1.5rem,2.8vw,2.4rem);font-weight:700;letter-spacing:-.03em;line-height:1;margin-top:14px')}>
                      {firstCat}
                    </h3>
                    <p style={css('font-size:.875rem;color:var(--slate);line-height:1.6;margin-top:12px;max-width:30ch')}>
                      {MENU_CAT_NOTES[firstCat] ?? ''}
                    </p>
                  </div>
                  <img
                    src={MENU_CAT_IMAGES[firstCat] ?? '/img/dish-crispy-fried-chicken.png'}
                    alt={'Dish from the ' + firstCat + ' section at Sky View'}
                    width={900}
                    height={600}
                    style={css('width:100%;aspect-ratio:3/2;object-fit:cover')}
                  />
                </div>
                <div style={css('width:50%;height:100%;padding:clamp(22px,3.4vw,48px);display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;background:var(--mist)')}>
                  <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.22em;color:var(--slate)')}>
                    SKY VIEW · ROOFTOP
                  </p>
                  <p style={css('font-size:clamp(1.1rem,2vw,1.6rem);font-weight:700;letter-spacing:-.025em;line-height:1.2;margin-top:16px;max-width:20ch')}>
                    Everything above is cooked to order on the roof.
                  </p>
                </div>
              </div>

              {spreads.map((sp) => (
                <div
                  key={sp.cat}
                  data-hv-leaf="1"
                  style={css('position:absolute;left:50%;top:0;width:50%;height:100%;transform-origin:left center;transform-style:preserve-3d;will-change:transform')}
                >
                  <div style={css('position:absolute;inset:0;backface-visibility:hidden;background:var(--limestone);border-left:1px solid rgba(22,24,26,.1);box-shadow:inset 14px 0 26px -22px rgba(0,0,0,.5);padding:clamp(20px,3vw,42px);display:flex;flex-direction:column')}>
                    <p style={css('font-family:var(--fu);font-size:12px;letter-spacing:.2em;color:var(--slate)')}>{sp.cat}</p>
                    <div style={css('flex:1;margin-top:16px;overflow:hidden')}>
                      {sp.items.map((m) => (
                        <div
                          key={m.name}
                          style={css('display:grid;grid-template-columns:1fr auto;gap:3px 14px;padding:9px 0;border-bottom:1px solid rgba(22,24,26,.1);align-items:baseline')}
                        >
                          <h4 style={css('font-size:clamp(.875rem,1.1vw,1rem);font-weight:700;letter-spacing:-.015em')}>
                            {m.name}
                          </h4>
                          <span style={css('font-family:var(--fu);font-size:clamp(.8125rem,1vw,.9375rem);font-variant-numeric:tabular-nums')}>
                            {money(m.price)}
                          </span>
                          <p style={css('font-size:clamp(.6875rem,.8vw,.78rem);color:var(--slate);line-height:1.45;grid-column:1/-1')}>
                            {m.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p style={css('font-family:var(--fu);font-size:11.5px;letter-spacing:.18em;color:var(--slate);text-align:right;padding-top:10px;font-variant-numeric:tabular-nums')}>
                      {sp.num}
                    </p>
                  </div>
                  <div style={css('position:absolute;inset:0;backface-visibility:hidden;transform:rotateY(180deg);background:var(--limestone);border-right:1px solid rgba(22,24,26,.14);padding:clamp(20px,3vw,42px);display:flex;flex-direction:column;justify-content:space-between')}>
                    <div>
                      <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.22em;color:var(--brass)')}>
                        {sp.nextNum} · NEXT
                      </p>
                      <h3 style={css('font-size:clamp(1.4rem,2.6vw,2.2rem);font-weight:700;letter-spacing:-.03em;line-height:1;margin-top:14px')}>
                        {sp.nextCat}
                      </h3>
                      <p style={css('font-size:.8125rem;color:var(--slate);line-height:1.6;margin-top:12px;max-width:30ch')}>
                        {sp.nextNote}
                      </p>
                    </div>
                    {sp.img && (
                      <img
                        src={sp.img}
                        alt={'Dish from the ' + sp.cat + ' section at Sky View'}
                        loading="lazy"
                        width={900}
                        height={600}
                        style={css('width:100%;aspect-ratio:3/2;object-fit:cover')}
                      />
                    )}
                  </div>
                </div>
              ))}

              <div
                aria-hidden="true"
                style={css('position:absolute;left:50%;top:0;bottom:0;width:1px;background:rgba(22,24,26,.2);z-index:60;pointer-events:none')}
              />
            </div>
            <p
              data-hv-book-idx="1"
              style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.22em;color:var(--slate);margin-top:clamp(16px,3vh,28px);font-variant-numeric:tabular-nums')}
            >
              01 / {String(spreads.length).padStart(2, '0')}
            </p>
          </div>
        </div>

        <div style={css('background:var(--limestone);padding:var(--sy) var(--gd) 0')}>
          <div
            data-noscroll="1"
            style={css('max-width:1400px;margin:0 auto;border-top:var(--bl);border-bottom:var(--bl);padding:14px 0;overflow-x:auto')}
          >
            <div style={css('display:flex;gap:7px;width:max-content')}>
              {['All', ...cats].map((c) => (
                <button key={c} type="button" onClick={() => setCat(c)} style={chipStyle(cat === c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div style={css('max-width:1400px;margin:0 auto;padding:clamp(30px,5vh,60px) 0 var(--sy)')}>
            {filtered.map((m) => (
              <div
                key={m.cat + m.name}
                style={css('display:grid;grid-template-columns:1fr auto;gap:8px 20px;padding:18px 0;border-bottom:var(--bl);align-items:baseline')}
              >
                <h3 style={css('font-size:1.0625rem;font-weight:700;letter-spacing:-.015em')}>{m.name}</h3>
                <span style={css('font-family:var(--fu);font-size:1rem;font-variant-numeric:tabular-nums;text-align:right')}>
                  {money(m.price)}
                </span>
                <p style={css('font-size:.8125rem;color:var(--slate);line-height:1.55;max-width:56ch')}>{m.desc}</p>
                <span style={css('font-family:var(--fu);font-size:11.5px;letter-spacing:.16em;color:var(--slate);text-align:right;text-transform:uppercase')}>
                  {m.cat}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
