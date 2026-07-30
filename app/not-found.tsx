import { css } from '@/lib/css';
import { TLink } from '@/components/chrome/TLink';

export default function NotFound() {
  return (
    <div
      data-screen-label="404"
      style={css('padding:calc(92px + var(--sy)) var(--gd) var(--sy);min-height:80vh;display:flex;align-items:center')}
    >
      <div style={css('max-width:1400px;margin:0 auto;width:100%')}>
        <p style={css('font-family:var(--fu);font-size:.8125rem;letter-spacing:.22em;color:var(--slate)')}>ERROR · 404</p>
        <h1 style={css('font-size:clamp(2.2rem,5.6vw,5rem);font-weight:700;letter-spacing:-.035em;line-height:.96;margin-top:18px;max-width:16ch')}>
          That floor does not exist in this building.
        </h1>
        <p style={css('font-size:1rem;color:var(--slate);margin-top:22px;max-width:46ch;line-height:1.68')}>
          The page you asked for is not here. Reception is, and so are the rooms.
        </p>
        <div style={css('display:flex;gap:14px;flex-wrap:wrap;margin-top:34px')}>
          <TLink
            href="/"
            style={css('background:var(--ink);color:var(--limestone);font-size:14px;font-weight:700;padding:16px 26px;min-height:50px;display:inline-flex;align-items:center;border-radius:2px')}
            hoverStyle="background:var(--lacquer);color:#fff"
          >
            Back to the ground floor
          </TLink>
          <TLink
            href="/rooms"
            style={css('border:var(--bl);color:var(--ink);font-size:14px;font-weight:600;padding:16px 26px;min-height:50px;display:inline-flex;align-items:center;border-radius:2px')}
            hoverStyle="background:var(--mist);color:var(--ink)"
          >
            See the rooms
          </TLink>
        </div>
      </div>
    </div>
  );
}
