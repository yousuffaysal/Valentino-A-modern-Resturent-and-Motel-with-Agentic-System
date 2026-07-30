import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { css } from '@/lib/css';
import { getAttractions, getSettings } from '@/lib/content';
import { TLink } from '@/components/chrome/TLink';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const attractions = await getAttractions();
  const place = attractions.find((a) => a.slug === params.slug);
  if (!place) return { title: 'Place not found · Hotel Valentino' };
  return { title: `${place.name} · Explore Noakhali`, description: place.line };
}

export default async function AttractionPage({ params }: { params: { slug: string } }) {
  const [attractions, settings] = await Promise.all([getAttractions(), getSettings()]);
  const place = attractions.find((a) => a.slug === params.slug);
  if (!place) notFound();

  const others = attractions.filter((a) => a.slug !== place.slug);
  const phone = settings.phonePrimary;

  return (
    <div data-screen-label="Explore detail">
      <section
        data-floor="N · NOAKHALI"
        data-floor-id="exd"
        style={css('position:relative;height:62vh;min-height:420px;overflow:hidden;background:var(--night)')}
      >
        <div data-hv-hero-bg="1" style={css('position:absolute;inset:-8% 0')}>
          <img
            src={place.img}
            alt={place.name}
            width={1440}
            height={1080}
            style={css('width:100%;height:100%;object-fit:cover;filter:brightness(.6)')}
          />
        </div>
        <div
          aria-hidden="true"
          style={css('position:absolute;inset:0;background:linear-gradient(to top,rgba(14,17,20,.94),rgba(14,17,20,.2))')}
        />
        <div style={css('position:relative;height:100%;display:flex;flex-direction:column;justify-content:flex-end;padding:0 var(--gd) clamp(40px,7vh,72px);max-width:1400px;margin:0 auto')}>
          <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:rgba(233,234,229,.55)')}>
            <TLink href="/explore" style={css('color:rgba(233,234,229,.55)')} hoverStyle="color:#fff">
              EXPLORE
            </TLink>{' '}
            / {place.ph}
          </p>
          <h1
            data-hero-split="1"
            style={css('font-size:clamp(2.2rem,5.6vw,5rem);font-weight:700;letter-spacing:-.035em;line-height:.96;color:#fff;margin-top:20px')}
          >
            {place.name}
          </h1>
          <p
            data-hero-el="1"
            style={css('font-family:var(--fu);font-size:13.5px;letter-spacing:.14em;color:rgba(233,234,229,.7);margin-top:20px')}
          >
            DISTANCE · {place.dist}
          </p>
        </div>
      </section>

      <section aria-label="About this place" style={css('background:var(--limestone);padding:var(--sy) var(--gd)')}>
        <div
          data-two-col="1.2fr .8fr"
          style={css('max-width:1400px;margin:0 auto;display:grid;grid-template-columns:1fr;gap:clamp(30px,4vw,70px);align-items:start')}
        >
          <div>
            <p style={css('font-size:clamp(1.3rem,2.4vw,1.9rem);font-weight:500;letter-spacing:-.02em;line-height:1.42;max-width:34ch')}>
              {place.line}
            </p>
            <img
              data-fill="1"
              src={place.img}
              alt={place.name}
              loading="lazy"
              width={1440}
              height={1080}
              style={css('width:100%;aspect-ratio:16/10;object-fit:cover;margin-top:clamp(34px,5vh,64px)')}
            />
            <p style={css('font-size:.9375rem;color:var(--slate);line-height:1.68;margin-top:26px;max-width:56ch')}>
              The tour desk arranges the car, the driver and the timing. Travel time depends on the road and the tide, so
              reception confirms the schedule with you the evening before you go.
            </p>
          </div>
          <aside style={css('border:var(--bl);padding:clamp(22px,2.6vw,32px)')}>
            <p style={css('font-family:var(--fu);font-size:12px;letter-spacing:.2em;color:var(--slate)')}>TOUR DESK</p>
            <p style={css('font-size:1.05rem;font-weight:600;margin-top:12px;line-height:1.5')}>
              Ask reception to book the trip
            </p>
            <a
              href={'tel:' + phone.replace(/\s/g, '')}
              style={css('display:block;font-family:var(--fu);font-size:1.1rem;color:var(--ink);margin-top:18px;font-variant-numeric:tabular-nums;border-bottom:1px solid var(--lacquer);padding-bottom:6px')}
            >
              {phone}
            </a>
            <div style={css('margin-top:26px;padding-top:20px;border-top:var(--bl)')}>
              <p style={css('font-family:var(--fu);font-size:12px;letter-spacing:.2em;color:var(--slate)')}>ALSO NEARBY</p>
              <div style={css('display:flex;flex-direction:column;gap:10px;margin-top:14px')}>
                {others.map((o) => (
                  <TLink
                    key={o.slug}
                    href={'/explore/' + o.slug}
                    style={css('font-size:.9375rem;color:var(--ink);display:flex;justify-content:space-between;gap:12px')}
                    hoverStyle="color:var(--lacquer)"
                  >
                    {o.name}
                    <span style={css('font-family:var(--fu);font-size:12px;color:var(--slate)')}>{o.dist}</span>
                  </TLink>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
