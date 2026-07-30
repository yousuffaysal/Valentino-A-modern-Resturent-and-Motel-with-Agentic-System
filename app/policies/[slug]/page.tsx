import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { css } from '@/lib/css';
import { POLICIES, getPolicy } from '@/lib/policies';
import { TLink } from '@/components/chrome/TLink';

export function generateStaticParams() {
  return POLICIES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const policy = getPolicy(params.slug);
  if (!policy) return { title: 'Policy not found · Hotel Valentino' };
  return { title: `${policy.label} · Hotel Valentino`, description: policy.intro };
}

export default function PolicyPage({ params }: { params: { slug: string } }) {
  const policy = getPolicy(params.slug);
  if (!policy) notFound();

  return (
    <div data-screen-label="Policy">
      <section
        data-floor="G · POLICIES"
        data-floor-id="px"
        style={css('background:var(--limestone);padding:calc(92px + var(--sy)) var(--gd) var(--sy)')}
      >
        <div style={css('max-width:1400px;margin:0 auto')}>
          <p style={css('display:flex;align-items:center;gap:14px;font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:var(--slate)')}>
            <span aria-hidden="true" style={css('width:38px;height:1px;background:var(--brass);display:block')} />
            {policy.eyebrow}
          </p>
          <h1 style={css('font-size:clamp(2.2rem,5.6vw,5rem);font-weight:700;letter-spacing:-.035em;line-height:.96;margin-top:20px;max-width:16ch')}>
            {policy.title}
          </h1>

          <div
            data-two-col=".62fr 1.38fr"
            style={css('display:grid;grid-template-columns:1fr;gap:clamp(30px,4vw,70px);margin-top:clamp(40px,6vh,72px)')}
          >
            <nav aria-label="All policies" style={css('align-self:start')}>
              <p style={css('font-family:var(--fu);font-size:12px;letter-spacing:.2em;color:var(--slate)')}>ALL POLICIES</p>
              <div style={css('display:flex;flex-direction:column;margin-top:16px;border-top:var(--bl)')}>
                {POLICIES.map((p) => (
                  <TLink
                    key={p.slug}
                    href={'/policies/' + p.slug}
                    style={css(
                      'font-size:.9375rem;padding:14px 0;border-bottom:var(--bl);color:' +
                        (p.slug === policy.slug ? 'var(--lacquer)' : 'var(--ink)'),
                    )}
                    hoverStyle="color:var(--lacquer)"
                  >
                    {p.label}
                  </TLink>
                ))}
              </div>
            </nav>

            <div>
              <p style={css('font-size:clamp(1.15rem,2vw,1.5rem);font-weight:500;letter-spacing:-.02em;line-height:1.5;max-width:44ch')}>
                {policy.intro}
              </p>
              {policy.sections.map((section) => (
                <div key={section.heading} data-rev="1" style={css('margin-top:clamp(34px,5vh,56px);padding-top:26px;border-top:var(--bl)')}>
                  <h2 style={css('font-size:1.3rem;font-weight:700;letter-spacing:-.025em')}>{section.heading}</h2>
                  {section.body.map((paragraph, i) => (
                    <p
                      key={i}
                      style={css('font-size:.9375rem;line-height:1.75;color:var(--slate);margin-top:14px;max-width:64ch')}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
              <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.18em;color:var(--brass);margin-top:clamp(34px,5vh,56px)')}>
                QUESTIONS · CALL RECEPTION, 24 HOURS
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
