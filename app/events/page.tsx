import type { Metadata } from 'next';
import { css } from '@/lib/css';
import { getSettings } from '@/lib/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Hall room and events · Hotel Valentino',
  description:
    'The hall room at Hotel Valentino for weddings, gaye holud, corporate meetings and receptions, catered by the Sky View rooftop kitchen.',
};

const FACTS = [
  { label: 'THE ROOM', copy: 'A hall inside the building, on the guest floors, with its own entrance off the lift lobby.' },
  { label: 'CATERING', copy: 'Food comes up from the Sky View kitchen. Set menus are built with the chef, not from a fixed list.' },
  { label: 'OCCASIONS', copy: 'Weddings, gaye holud, birthdays, corporate meetings, training days and product launches.' },
  { label: 'ROOMS', copy: 'Out of town guests can be blocked into room categories at the desk when the hall is booked.' },
  { label: 'CAPACITY', copy: 'CONFIRM WITH HOTEL' },
  { label: 'HIRE RATE', copy: 'CONFIRM WITH HOTEL' },
];

export default async function EventsPage() {
  const settings = await getSettings();
  const phone = settings.phonePrimary;

  return (
    <div data-screen-label="Events">
      <section
        data-floor="G · EVENTS"
        data-floor-id="evx"
        style={css('position:relative;height:62vh;min-height:420px;overflow:hidden;background:var(--night)')}
      >
        <div data-hv-hero-bg="1" style={css('position:absolute;inset:-8% 0')}>
          <img
            src="/img/hall-room.png"
            alt="The hall room at Hotel Valentino set for an event"
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
            GROUND · HALL ROOM
          </p>
          <h1
            data-hero-split="1"
            style={css('font-size:clamp(2.2rem,5.6vw,5rem);font-weight:700;letter-spacing:-.035em;line-height:.96;color:#fff;margin-top:20px;max-width:15ch')}
          >
            One hall, one kitchen, one building.
          </h1>
        </div>
      </section>

      <section aria-label="Hall room" style={css('background:var(--limestone);padding:var(--sy) var(--gd)')}>
        <div style={css('max-width:1400px;margin:0 auto')}>
          <p style={css('font-size:clamp(1.3rem,2.6vw,2rem);font-weight:500;letter-spacing:-.02em;line-height:1.42;max-width:30ch')}>
            The hall is in the building, so the catering does not travel and the guests who are staying over do not either.
          </p>
          <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1px clamp(24px,4vw,60px);margin-top:clamp(40px,6vh,72px)')}>
            {FACTS.map((f) => (
              <div key={f.label} data-rev="1" style={css('padding:26px 0;border-top:var(--bl)')}>
                <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:var(--brass)')}>{f.label}</p>
                <p style={css('font-size:.9375rem;line-height:1.68;color:var(--slate);margin-top:10px;max-width:44ch')}>
                  {f.copy}
                </p>
              </div>
            ))}
          </div>
          <a
            href={'tel:' + phone.replace(/\s/g, '')}
            style={css('display:inline-block;font-family:var(--fu);font-size:clamp(1.1rem,2.6vw,1.9rem);color:var(--ink);margin-top:clamp(40px,6vh,70px);border-bottom:1px solid var(--lacquer);font-variant-numeric:tabular-nums')}
          >
            Ask the desk about a date · {phone}
          </a>
        </div>
      </section>
    </div>
  );
}
