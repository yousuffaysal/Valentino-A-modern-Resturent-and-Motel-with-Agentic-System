'use client';

import React, { useState } from 'react';
import { css } from '@/lib/css';
import { useSite } from '@/context/SiteContext';

const labelStyle = css('display:block;font-family:var(--fu);font-size:12px;letter-spacing:.18em;color:var(--slate)');
const inputStyle = css('width:100%;border-bottom:var(--bl);padding:12px 0;min-height:48px;font-size:15px');
const dtStyle = css('font-family:var(--fu);font-size:12.5px;letter-spacing:.18em;color:var(--slate);align-self:center');

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactScreen() {
  const { settings } = useSite();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const phones = [settings.phonePrimary, settings.phoneSecondary, settings.phoneLandline].filter(Boolean);

  const send = async () => {
    if (name.trim().length < 2 || mobile.trim().length < 6 || message.trim().length < 3) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile, message }),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('sent');
      setName('');
      setMobile('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div data-screen-label="Contact">
      <section
        data-floor="G · CONTACT"
        data-floor-id="cx"
        style={css('background:var(--limestone);padding:calc(92px + var(--sy)) var(--gd) var(--sy)')}
      >
        <div style={css('max-width:1400px;margin:0 auto')}>
          <p style={css('display:flex;align-items:center;gap:14px;font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:var(--slate)')}>
            <span aria-hidden="true" style={css('width:38px;height:1px;background:var(--brass);display:block')} />
            GROUND · CONTACT
          </p>
          <h1 style={css('font-size:clamp(2.2rem,5.6vw,5rem);font-weight:700;letter-spacing:-.035em;line-height:.96;margin-top:20px;max-width:16ch')}>
            Boro Masjid Moar, Main Road, Maijdee Court.
          </h1>

          <div
            data-two-col="1fr 1fr"
            style={css('display:grid;grid-template-columns:1fr;gap:clamp(30px,4vw,70px);margin-top:clamp(40px,6vh,72px)')}
          >
            <div>
              <address style={css('font-style:normal;font-size:1.05rem;line-height:1.68')}>
                {settings.addressLine1}
                <br />
                {settings.addressLine2}
                <br />
                {settings.addressLine3}
              </address>
              <div style={css('display:flex;flex-direction:column;gap:2px;margin-top:30px;padding-top:22px;border-top:var(--bl)')}>
                {phones.map((p) => (
                  <a
                    key={p}
                    href={'tel:' + p.replace(/\s/g, '')}
                    style={css('font-family:var(--fu);font-size:clamp(1.1rem,2.4vw,1.6rem);color:var(--ink);padding:8px 0;font-variant-numeric:tabular-nums')}
                    data-hover-style="color:var(--lacquer)"
                  >
                    {p}
                  </a>
                ))}
              </div>
              <dl style={css('display:grid;grid-template-columns:auto 1fr;gap:12px 24px;margin-top:30px;padding-top:22px;border-top:var(--bl);font-size:.875rem')}>
                <dt style={dtStyle}>RECEPTION</dt>
                <dd>Open 24 hours, every day</dd>
                <dt style={dtStyle}>TRAIN</dt>
                <dd>1 km from Maijdee Court station</dd>
                <dt style={dtStyle}>BUS</dt>
                <dd>1 km from Maijdee Court bus station</dd>
                <dt style={dtStyle}>EMAIL</dt>
                <dd style={css('color:var(--brass);font-family:var(--fu);font-size:13.5px')}>{settings.email}</dd>
              </dl>
            </div>

            <div>
              <div style={css('border:var(--bl);overflow:hidden;position:relative;aspect-ratio:600/420;background:url(/img/real-map-bw.png) center/cover no-repeat;filter:grayscale(1) contrast(1.15)')}>
                <div style={css('position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:14px;height:14px;background:#A81E2D;border-radius:50%;box-shadow:0 0 0 rgba(168,30,45,0.7);animation:hv-map-pulse 2s infinite;z-index:2')} />
                <div style={css('position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:32px;height:32px;border:2px solid #A81E2D;border-radius:50%;opacity:0.6;z-index:1')} />
              </div>
              <div style={css('border:var(--bl);border-top:none;padding:clamp(22px,3vw,32px)')}>
                <h2 style={css('font-size:1.25rem;font-weight:700;letter-spacing:-.02em')}>Send reception a message</h2>
                <label style={css('display:block;margin-top:22px')}>
                  <span style={labelStyle}>NAME</span>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
                </label>
                <label style={css('display:block;margin-top:18px')}>
                  <span style={labelStyle}>MOBILE</span>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    style={css('width:100%;border-bottom:var(--bl);padding:12px 0;min-height:48px;font-size:15px;font-family:var(--fu)')}
                  />
                </label>
                <label style={css('display:block;margin-top:18px')}>
                  <span style={labelStyle}>MESSAGE</span>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={css('width:100%;border-bottom:var(--bl);padding:12px 0;font-size:15px;resize:vertical')}
                  />
                </label>
                <button
                  type="button"
                  onClick={send}
                  disabled={status === 'sending'}
                  style={css('width:100%;background:var(--lacquer);color:#fff;font-size:14px;font-weight:700;padding:16px;min-height:52px;border-radius:2px;margin-top:26px')}
                >
                  {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent to reception ✓' : 'Send to reception'}
                </button>
                {status === 'error' && (
                  <p style={css('font-size:.8125rem;color:var(--lacquer);margin-top:12px;line-height:1.6')}>
                    That did not go through. Fill in all three fields, or call the desk on {settings.phonePrimary}.
                  </p>
                )}
                <p style={css('font-size:.8125rem;color:var(--slate);margin-top:14px;line-height:1.6')}>
                  For a room, the booking flow is faster and shows the rate. Call the desk if it is urgent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
