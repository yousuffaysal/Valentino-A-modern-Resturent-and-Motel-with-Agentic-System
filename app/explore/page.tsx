import type { Metadata } from 'next';
import { css } from '@/lib/css';
import { getAttractions } from '@/lib/content';
import { TLink } from '@/components/chrome/TLink';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Explore Noakhali · Hotel Valentino',
  description:
    'Four places the Hotel Valentino tour desk sends guests to: NSTU, Bajra Shahi Mosque, Nijhum Dweep and the Gandhi Ashram.',
};

export default async function ExplorePage() {
  const attractions = await getAttractions();

  return (
    <div data-screen-label="Explore">
      <section
        data-floor="N · NOAKHALI"
        data-floor-id="ex"
        style={css('position:relative;height:62vh;min-height:420px;overflow:hidden;background:var(--night)')}
      >
        <div data-hv-hero-bg="1" style={css('position:absolute;inset:-8% 0')}>
          <img
            src="/img/room-sunset-window.png"
            alt="Sunset over Noakhali town seen from a hotel room window"
            width={1440}
            height={1080}
            style={css('width:100%;height:100%;object-fit:cover;filter:brightness(.58)')}
          />
        </div>
        <div
          aria-hidden="true"
          style={css('position:absolute;inset:0;background:linear-gradient(to top,rgba(14,17,20,.94),rgba(14,17,20,.2))')}
        />
        <div style={css('position:relative;height:100%;display:flex;flex-direction:column;justify-content:flex-end;padding:0 var(--gd) clamp(40px,7vh,72px);max-width:1400px;margin:0 auto')}>
          <p style={css('display:flex;align-items:center;gap:14px;font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:rgba(233,234,229,.6)')}>
            <span aria-hidden="true" style={css('width:38px;height:1px;background:var(--brass);display:block')} />
            NOAKHALI · {String(attractions.length).padStart(2, '0')} PLACES
          </p>
          <h1
            data-hero-split="1"
            style={css('font-size:clamp(2.2rem,5.6vw,5rem);font-weight:700;letter-spacing:-.035em;line-height:.96;color:#fff;margin-top:20px;max-width:15ch')}
          >
            Four places worth the drive.
          </h1>
          <p
            data-hero-el="1"
            style={css('font-size:1rem;color:rgba(233,234,229,.76);margin-top:20px;max-width:52ch;line-height:1.68')}
          >
            The tour desk books the car and the driver for all four. Distances and travel times are being confirmed with
            the hotel before they go on the site.
          </p>
        </div>
      </section>

      <section aria-label="Places near the hotel" style={css('background:var(--limestone);padding:var(--sy) var(--gd)')}>
        <div style={css('max-width:1400px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:clamp(16px,2vw,30px)')}>
          {attractions.map((e) => (
            <TLink key={e.slug} href={'/explore/' + e.slug} data-rev="1" style={css('color:inherit;display:block')}>
              <div style={css('position:relative;aspect-ratio:3/4;overflow:hidden;background:var(--mist)')}>
                <img
                  src={e.img}
                  alt={e.name}
                  loading="lazy"
                  style={css('position:absolute;inset:0;width:100%;height:100%;object-fit:cover')}
                />
              </div>
              <div style={css('display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-top:14px')}>
                <h2 style={css('font-size:1.15rem;font-weight:700;letter-spacing:-.02em')}>{e.name}</h2>
                <span style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.1em;color:var(--brass)')}>
                  {e.dist}
                </span>
              </div>
              <p style={css('font-size:.8125rem;color:var(--slate);margin-top:6px;line-height:1.55')}>{e.line}</p>
            </TLink>
          ))}
        </div>
      </section>
    </div>
  );
}
