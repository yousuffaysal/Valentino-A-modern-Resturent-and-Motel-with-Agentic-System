import type { Metadata } from 'next';
import { css } from '@/lib/css';
import { getRooms, getSettings } from '@/lib/content';
import { TLink } from '@/components/chrome/TLink';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About the hotel · Hotel Valentino',
  description:
    'Hotel Valentino on Main Road, Maijdee Court: eight room categories, a 24 hour desk, a tour desk and the Sky View rooftop kitchen.',
};

export default async function AboutPage() {
  const [rooms, settings] = await Promise.all([getRooms(), getSettings()]);
  const cheapest = rooms.reduce((min, r) => (r.rate < min.rate ? r : min), rooms[0]);

  return (
    <div data-screen-label="About">
      <section
        data-floor="G · THE HOTEL"
        data-floor-id="abx"
        style={css('position:relative;height:62vh;min-height:420px;overflow:hidden;background:var(--night)')}
      >
        <div data-hv-hero-bg="1" style={css('position:absolute;inset:-8% 0')}>
          <img
            src="/img/exterior-skyview-day.png"
            alt="Hotel Valentino from Main Road with the Sky View sign on the roof"
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
            GROUND · THE HOTEL
          </p>
          <h1
            data-hero-split="1"
            style={css('font-size:clamp(2.2rem,5.6vw,5rem);font-weight:700;letter-spacing:-.035em;line-height:.96;color:#fff;margin-top:20px;max-width:15ch')}
          >
            Built on Main Road, run from the desk.
          </h1>
        </div>
      </section>

      <section aria-label="About the hotel" style={css('background:var(--limestone);padding:var(--sy) var(--gd)')}>
        <div
          data-two-col="1fr 1fr"
          style={css('max-width:1400px;margin:0 auto;display:grid;grid-template-columns:1fr;gap:clamp(30px,4vw,70px)')}
        >
          <p style={css('font-size:clamp(1.3rem,2.6vw,2rem);font-weight:500;letter-spacing:-.02em;line-height:1.42;max-width:26ch')}>
            Noakhali sends its people everywhere. They come home carrying a standard. Valentino was built to meet it.
          </p>
          <div>
            <p style={css('font-size:1rem;line-height:1.68;color:var(--slate);max-width:56ch')}>
              The hotel sits at Boro Masjid Moar on Main Road, a kilometre from the Maijdee Court train and bus stations,
              above the Shwapno super shop in Ahsan Bhaban. Guest floors run up the building; Sky View, the rooftop kitchen
              and café, sits on top of them.
            </p>
            <p style={css('font-size:1rem;line-height:1.68;color:var(--slate);max-width:56ch;margin-top:18px')}>
              There are {rooms.length} room categories, from the {cheapest?.name} at ৳{cheapest?.rate.toLocaleString('en-US')} a
              night up to the suites. Every one of them has hot water, a mini fridge, a flat-screen, free Wi-Fi and free
              parking downstairs. The desk is staffed 24 hours, and it also books air tickets, coach tickets, cars with
              drivers, airport transfers and day trips.
            </p>
            <p style={css('font-size:1rem;line-height:1.68;color:var(--slate);max-width:56ch;margin-top:18px')}>
              Reception answers on {settings.phonePrimary}, at any hour. That is the whole promise, and the rate is kept
              honest against it.
            </p>
            <div style={css('display:flex;flex-wrap:wrap;gap:14px;margin-top:34px')}>
              <TLink
                href="/rooms"
                style={css('background:var(--ink);color:var(--limestone);font-size:14px;font-weight:700;padding:16px 26px;min-height:50px;display:inline-flex;align-items:center;border-radius:2px')}
                hoverStyle="background:var(--lacquer);color:#fff"
              >
                See the rooms
              </TLink>
              <TLink
                href="/restaurant"
                style={css('border:var(--bl);color:var(--ink);font-size:14px;font-weight:600;padding:16px 26px;min-height:50px;display:inline-flex;align-items:center;border-radius:2px')}
                hoverStyle="background:var(--mist);color:var(--ink)"
              >
                Sky View menu
              </TLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
