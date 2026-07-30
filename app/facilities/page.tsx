import type { Metadata } from 'next';
import { css } from '@/lib/css';
import { getFacilities, getServices, getSettings } from '@/lib/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Facilities · Hotel Valentino',
  description:
    'What the rate includes at Hotel Valentino and what reception can arrange: tour desk, air and coach tickets, car rental, airport transfers and the hall room.',
};

export default async function FacilitiesPage() {
  const [facilities, services, settings] = await Promise.all([getFacilities(), getServices(), getSettings()]);
  const phone = settings.phonePrimary;

  return (
    <div data-screen-label="Facilities">
      <section
        data-floor="G · FACILITIES"
        data-floor-id="fx"
        style={css('position:relative;height:62vh;min-height:420px;overflow:hidden;background:var(--night)')}
      >
        <div data-hv-hero-bg="1" style={css('position:absolute;inset:-8% 0')}>
          <img
            src="/img/lobby-reception.png"
            alt="Ground floor lobby with the reception desk"
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
            GROUND · FACILITIES
          </p>
          <h1
            data-hero-split="1"
            style={css('font-size:clamp(2.2rem,5.6vw,5rem);font-weight:700;letter-spacing:-.035em;line-height:.96;color:#fff;margin-top:20px;max-width:15ch')}
          >
            What is included, and what reception can arrange.
          </h1>
        </div>
      </section>

      <section aria-label="Included facilities" style={css('background:var(--limestone);padding:var(--sy) var(--gd)')}>
        <div style={css('max-width:1400px;margin:0 auto')}>
          <p style={css('font-family:var(--fu);font-size:.8125rem;letter-spacing:.22em;color:var(--slate)')}>
            INCLUDED IN THE RATE · {String(facilities.length).padStart(2, '0')}
          </p>
          <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1px clamp(24px,4vw,60px);margin-top:clamp(30px,5vh,54px)')}>
            {facilities.map((f, i) => (
              <div key={f.en} data-rev="1" style={css('padding:26px 0;border-top:var(--bl)')}>
                <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:var(--brass);font-variant-numeric:tabular-nums')}>
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h2 style={css('font-size:1.3rem;font-weight:700;letter-spacing:-.02em;margin-top:10px')}>
                  <span data-en="1">{f.en}</span>
                  <span data-bn="1">{f.bn}</span>
                </h2>
                <p style={css('font-size:.9375rem;line-height:1.68;color:var(--slate);margin-top:10px;max-width:44ch')}>
                  {f.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Special services" style={css('background:var(--night);color:var(--limestone);padding:var(--sy) var(--gd)')}>
        <div style={css('max-width:1400px;margin:0 auto')}>
          <p style={css('font-family:var(--fu);font-size:.8125rem;letter-spacing:.22em;color:rgba(233,234,229,.5)')}>
            SPECIAL SERVICES · 01 — {String(services.length).padStart(2, '0')}
          </p>
          <h2 style={css('font-size:clamp(2.2rem,5.6vw,4.2rem);font-weight:700;letter-spacing:-.035em;line-height:.96;margin-top:16px;max-width:16ch')}>
            Booked at the desk, not on a phone tree.
          </h2>
          <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1px clamp(24px,4vw,60px);margin-top:clamp(34px,5vh,64px)')}>
            {services.map((s) => (
              <div key={s.num + s.en} data-rev="1" style={css('padding:26px 0;border-top:var(--bd)')}>
                <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:var(--brass);font-variant-numeric:tabular-nums')}>
                  {s.num}
                </p>
                <h3 style={css('font-size:1.3rem;font-weight:700;letter-spacing:-.02em;margin-top:10px')}>
                  <span data-en="1">{s.en}</span>
                  <span data-bn="1">{s.bn}</span>
                </h3>
                <p style={css('font-size:.9375rem;line-height:1.68;color:rgba(233,234,229,.7);margin-top:10px;max-width:44ch')}>
                  {s.copy}
                </p>
              </div>
            ))}
          </div>
          <a
            href={'tel:' + phone.replace(/\s/g, '')}
            style={css('display:inline-block;font-family:var(--fu);font-size:clamp(1.1rem,2.6vw,1.9rem);color:var(--limestone);margin-top:clamp(40px,6vh,70px);border-bottom:1px solid rgba(233,234,229,.28);font-variant-numeric:tabular-nums')}
            data-hover-style="border-bottom-color:var(--lacquer);color:#fff"
          >
            Ask reception · {phone}
          </a>
        </div>
      </section>
    </div>
  );
}
