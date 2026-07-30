'use client';

import React, { useMemo } from 'react';
import { css } from '@/lib/css';
import { DOW, MONTHS, fmt, iso, money, parse, today } from '@/lib/format';
import { useSite, type AvailRoom } from '@/context/SiteContext';
import { TLink } from '@/components/chrome/TLink';

const CELL_BASE =
  'width:100%;aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-family:var(--fu);font-size:14px;font-variant-numeric:tabular-nums;border-radius:2px;';

const labelStyle = css('display:block;font-family:var(--fu);font-size:12px;letter-spacing:.18em;color:var(--slate)');
const inputStyle = css('width:100%;border-bottom:var(--bl);padding:12px 0;min-height:48px;font-size:15px');
const monoInputStyle = css('width:100%;border-bottom:var(--bl);padding:12px 0;min-height:48px;font-size:15px;font-family:var(--fu);font-variant-numeric:tabular-nums');
const errStyle = css('display:block;font-size:.8125rem;color:var(--lacquer);margin-top:7px');
const h2Style = css('font-size:1.6rem;font-weight:700;letter-spacing:-.03em');
const primaryStyle = css('background:var(--lacquer);color:#fff;font-size:14px;font-weight:700;padding:14px 24px;min-height:48px;border-radius:2px');

export function BookingPanel() {
  const site = useSite();
  const {
    panel,
    closePanel,
    step,
    setStep,
    ci,
    co,
    nights,
    adults,
    kids,
    nrooms,
    setAdults,
    setKids,
    setNrooms,
    calAnchor,
    shiftMonth,
    pickDate,
    setRange,
    avail,
    availRooms,
    sort,
    setSort,
    picked,
    selectRoom,
    pickedRoom,
    addons,
    activeAddons,
    toggleAddon,
    form,
    setField,
    errors,
    validate,
    goToPayment,
    pay,
    setPay,
    placing,
    conf,
    confirmBooking,
    resetBooking,
    copyCode,
    subtotal,
    addonTotal,
    vat,
    total,
    isBn,
    settings,
    loadAvail,
  } = site;

  const t0 = useMemo(() => today(), []);

  const buildMonth = (base: Date, offset: number) => {
    const d = new Date(base.getFullYear(), base.getMonth() + offset, 1);
    const first = d.getDay();
    const dim = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const cells: { key: string; blank: boolean; d?: number; isoDate?: string; past?: boolean; style?: string }[] = [];
    for (let i = 0; i < first; i++) cells.push({ blank: true, key: 'b' + i });
    for (let i = 1; i <= dim; i++) {
      const cd = new Date(d.getFullYear(), d.getMonth(), i);
      const isoDate = iso(cd);
      const past = cd < t0;
      const isCi = ci === isoDate;
      const isCo = co === isoDate;
      const inRange = !!ci && !!co && cd > parse(ci) && cd < parse(co);
      cells.push({
        blank: false,
        key: isoDate,
        d: i,
        isoDate,
        past,
        style:
          CELL_BASE +
          (past ? 'color:rgba(22,24,26,.22);cursor:not-allowed;' : 'cursor:pointer;') +
          (isCi || isCo ? 'background:var(--lacquer);color:#fff;' : inRange ? 'background:rgba(168,30,45,.1);' : ''),
      });
    }
    return { label: MONTHS[d.getMonth()] + ' ' + d.getFullYear(), cells };
  };

  const calA = buildMonth(calAnchor, 0);
  const calB = buildMonth(calAnchor, 1);

  const rangeLabel = isBn
    ? (nights
        ? nights + ' রাত · ' + fmt(ci, true) + ' → ' + fmt(co, true)
        : ci
          ? fmt(ci, true) + ' → চেক-আউট নির্বাচন করুন'
          : 'তারিখ নির্বাচন করুন') +
      ' · ' +
      (adults + kids) +
      ' জন অতিথি'
    : (nights
        ? nights + (nights > 1 ? ' NIGHTS' : ' NIGHT') + ' · ' + fmt(ci) + ' → ' + fmt(co)
        : ci
          ? fmt(ci) + ' → PICK CHECK OUT'
          : 'PICK YOUR DATES') +
      ' · ' +
      (adults + kids) +
      ' GUESTS';

  const sorted = useMemo(() => {
    const list = [...availRooms];
    list.sort((a, b) =>
      sort === 'price'
        ? a.rate - b.rate
        : sort === 'capacity'
          ? b.sleeps - a.sleeps
          : (a.out ? 1 : 0) - (b.out ? 1 : 0),
    );
    return list;
  }, [availRooms, sort]);

  const altDates = [7, 14].map((offset) => {
    const start = new Date(t0.getTime() + offset * 86400000);
    const end = new Date(start.getTime() + 2 * 86400000);
    return { label: fmt(iso(start), isBn) + ' → ' + fmt(iso(end), isBn), ci: iso(start), co: iso(end) };
  });

  const counters = [
    {
      label: isBn ? 'প্রাপ্তবয়স্ক' : 'Adults',
      sub: isBn ? '১৩ বছর বা তার বেশি' : 'Age 13 and over',
      val: adults,
      dec: () => setAdults(Math.max(1, adults - 1)),
      inc: () => setAdults(Math.min(4, adults + 1)),
    },
    {
      label: isBn ? 'শিশু' : 'Children',
      sub: isBn ? '০ থেকে ১২ বছর' : 'Age 0 to 12',
      val: kids,
      dec: () => setKids(Math.max(0, kids - 1)),
      inc: () => setKids(Math.min(3, kids + 1)),
    },
    {
      label: isBn ? 'রুম' : 'Rooms',
      sub: isBn ? 'একই ক্যাটাগরির' : 'Same category',
      val: nrooms,
      dec: () => setNrooms(Math.max(1, nrooms - 1)),
      inc: () => setNrooms(Math.min(3, nrooms + 1)),
    },
  ];

  const pays = [
    { id: 'bkash', label: 'bKash' },
    { id: 'nagad', label: 'Nagad' },
    { id: 'card', label: isBn ? 'কার্ড' : 'Card' },
    { id: 'hotel', label: isBn ? 'হোটেলে পরিশোধ' : 'Pay at hotel' },
  ];

  const sorts: { k: 'recommended' | 'price' | 'capacity'; label: string }[] = [
    { k: 'recommended', label: isBn ? 'সুপারিশকৃত' : 'Recommended' },
    { k: 'price', label: isBn ? 'মূল্য' : 'Price' },
    { k: 'capacity', label: isBn ? 'ধারণক্ষমতা' : 'Capacity' },
  ];

  const flagFor = (r: AvailRoom) =>
    r.out
      ? isBn
        ? 'উক্ত তারিখে খালি নেই'
        : 'Not available for these dates'
      : r.left === 1
        ? isBn
          ? 'মাত্র ১টি রুম খালি আছে'
          : 'Only 1 left'
        : r.left === 2
          ? isBn
            ? 'মাত্র ২টি রুম খালি আছে'
            : 'Only 2 left'
          : null;

  if (!panel) return null;

  const summaryOn = !!(ci && co && step < 6);
  const phone = settings.phonePrimary ?? '+880 1795 855555';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={panel === 'table' ? 'Table reservation' : 'Booking'}
      style={css('position:fixed;inset:0;z-index:120;display:flex;justify-content:flex-end')}
    >
      <button
        type="button"
        onClick={closePanel}
        aria-label="Close booking"
        style={css('position:absolute;inset:0;background:rgba(14,17,20,.62);backdrop-filter:blur(3px);cursor:default')}
      />
      <div
        data-lenis-prevent="1"
        style={css(
          'position:relative;background:var(--limestone);width:100%;max-width:' +
            (panel === 'table' ? '440px' : '560px') +
            ';height:100%;overflow-y:auto;display:flex;flex-direction:column;box-shadow:-30px 0 80px -40px rgba(0,0,0,.6)',
        )}
      >
        {panel === 'book' && (
          <div style={css('display:flex;flex-direction:column;min-height:100%')}>
            <div style={css('position:sticky;top:0;z-index:5;background:var(--limestone);padding:22px clamp(20px,4vw,34px) 16px;border-bottom:var(--bl)')}>
              <div style={css('display:flex;justify-content:space-between;align-items:center;gap:16px')}>
                <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:var(--slate);font-variant-numeric:tabular-nums')}>
                  {'0' + Math.min(5, step) + ' / 05'}
                </p>
                <button
                  type="button"
                  onClick={closePanel}
                  aria-label="Close"
                  style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.14em;color:var(--slate);min-height:44px;padding:0 4px')}
                  data-hover-style="color:var(--ink)"
                >
                  <span data-en="1">CLOSE ✕</span>
                  <span data-bn="1">বন্ধ করুন ✕</span>
                </button>
              </div>
              <div style={css('display:flex;gap:4px;margin-top:14px')}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setStep(i)}
                    aria-label={'Step 0' + i}
                    style={css(
                      'flex:1;height:2px;background:' +
                        (i <= step ? 'var(--lacquer)' : 'rgba(22,24,26,.14)') +
                        ';transition:background .3s var(--eo)',
                    )}
                  />
                ))}
              </div>
            </div>

            <div style={css('flex:1;padding:clamp(22px,4vw,34px)')}>
              {step === 1 && (
                <div>
                  <h2 style={h2Style}>
                    <span data-en="1">Dates and guests</span>
                    <span data-bn="1">তারিখ এবং অতিথি</span>
                  </h2>
                  <p style={css('font-family:var(--fu);font-size:13px;letter-spacing:.16em;color:var(--lacquer);margin-top:12px;font-variant-numeric:tabular-nums')}>
                    {rangeLabel}
                  </p>
                  <div style={css('display:flex;justify-content:space-between;align-items:center;margin-top:26px')}>
                    <button
                      type="button"
                      onClick={() => shiftMonth(-1)}
                      aria-label="Previous month"
                      style={css('width:44px;height:44px;border:var(--bl);border-radius:2px')}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => shiftMonth(1)}
                      aria-label="Next month"
                      style={css('width:44px;height:44px;border:var(--bl);border-radius:2px')}
                    >
                      →
                    </button>
                  </div>
                  <div data-two-col="1fr 1fr" style={css('display:grid;grid-template-columns:1fr;gap:26px;margin-top:18px')}>
                    {[calA, calB].map((cal, ci2) => (
                      <div key={cal.label}>
                        <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.18em;color:var(--slate);text-align:center')}>
                          {cal.label}
                        </p>
                        <div style={css('display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-top:12px')}>
                          {DOW.map((d, i) => (
                            <span
                              key={'dow' + ci2 + i}
                              style={css('text-align:center;font-family:var(--fu);font-size:11.5px;color:var(--slate);padding-bottom:6px')}
                            >
                              {d}
                            </span>
                          ))}
                          {cal.cells.map((cell) =>
                            cell.blank ? (
                              <span key={cell.key} />
                            ) : (
                              <button
                                key={cell.key}
                                type="button"
                                disabled={cell.past}
                                onClick={() => !cell.past && pickDate(cell.isoDate!)}
                                style={css(cell.style!)}
                              >
                                {cell.d}
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={css('margin-top:30px;border-top:var(--bl)')}>
                    {counters.map((c) => (
                      <div
                        key={c.label}
                        style={css('display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 0;border-bottom:var(--bl)')}
                      >
                        <div>
                          <p style={css('font-size:.9375rem;font-weight:600')}>{c.label}</p>
                          <p style={css('font-size:.8125rem;color:var(--slate);margin-top:3px')}>{c.sub}</p>
                        </div>
                        <div style={css('display:flex;align-items:center;gap:12px')}>
                          <button
                            type="button"
                            onClick={c.dec}
                            aria-label="Fewer"
                            style={css('width:40px;height:40px;border:var(--bl);border-radius:2px;font-size:16px;line-height:1')}
                          >
                            −
                          </button>
                          <span style={css('font-family:var(--fu);font-size:14px;width:20px;text-align:center;font-variant-numeric:tabular-nums')}>
                            {c.val}
                          </span>
                          <button
                            type="button"
                            onClick={c.inc}
                            aria-label="More"
                            style={css('width:40px;height:40px;border:var(--bl);border-radius:2px;font-size:16px;line-height:1')}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 style={h2Style}>
                    <span data-en="1">Choose a room</span>
                    <span data-bn="1">রুম নির্বাচন করুন</span>
                  </h2>
                  <p style={css('font-family:var(--fu);font-size:13px;letter-spacing:.16em;color:var(--slate);margin-top:12px;font-variant-numeric:tabular-nums')}>
                    {rangeLabel}
                  </p>
                  <div style={css('display:flex;gap:6px;flex-wrap:wrap;margin-top:20px')}>
                    {sorts.map((so) => (
                      <button
                        key={so.k}
                        type="button"
                        onClick={() => setSort(so.k)}
                        style={css(
                          'font-family:var(--fu);font-size:12.5px;letter-spacing:.14em;padding:8px 11px;min-height:36px;border-radius:2px;text-transform:uppercase;' +
                            (sort === so.k ? 'background:var(--ink);color:var(--limestone);' : 'border:var(--bl);color:var(--slate);'),
                        )}
                      >
                        {so.label}
                      </button>
                    ))}
                  </div>

                  {avail === 'loading' && (
                    <div style={css('margin-top:22px')}>
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          style={css('display:grid;grid-template-columns:88px 1fr;gap:16px;padding:16px 0;border-bottom:var(--bl)')}
                        >
                          <div style={css('aspect-ratio:1;background:var(--mist);animation:hvpulse 1.4s var(--esoft) infinite')} />
                          <div>
                            <div style={css('height:14px;width:60%;background:var(--mist);animation:hvpulse 1.4s var(--esoft) infinite')} />
                            <div style={css('height:11px;width:40%;background:var(--mist);margin-top:10px;animation:hvpulse 1.4s var(--esoft) infinite')} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {avail === 'empty' && (
                    <div style={css('margin-top:26px;border:var(--bl);padding:24px')}>
                      <p style={css('font-size:1.05rem;font-weight:600')}>
                        <span data-en="1">Nothing open for those dates.</span>
                        <span data-bn="1">উক্ত তারিখে কোন রুম খালি নেই।</span>
                      </p>
                      <p style={css('font-size:.875rem;color:var(--slate);margin-top:8px;line-height:1.6')}>
                        <span data-en="1">These are the nearest nights with rooms free.</span>
                        <span data-bn="1">রুম খালি থাকার নিকটবর্তী তারিখসমূহ নিচে দেওয়া হল:</span>
                      </p>
                      <div style={css('display:flex;gap:8px;flex-wrap:wrap;margin-top:16px')}>
                        {altDates.map((a) => (
                          <button
                            key={a.ci}
                            type="button"
                            onClick={() => setRange(a.ci, a.co)}
                            style={css('font-family:var(--fu);font-size:12.5px;border:var(--bl);padding:11px 14px;min-height:44px;border-radius:2px')}
                          >
                            {a.label}
                          </button>
                        ))}
                        <a
                          href={'tel:' + phone.replace(/\s/g, '')}
                          style={css('font-family:var(--fu);font-size:12.5px;background:var(--ink);color:var(--limestone);padding:11px 14px;min-height:44px;display:inline-flex;align-items:center;border-radius:2px')}
                        >
                          <span data-en="1">CALL RECEPTION</span>
                          <span data-bn="1">রিসেপশনে কল করুন</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {avail === 'ok' && (
                    <div style={css('margin-top:22px')}>
                      {sorted.map((r) => {
                        const flag = flagFor(r);
                        return (
                          <div
                            key={r.code}
                            style={css(
                              'display:grid;grid-template-columns:88px 1fr auto;gap:16px;align-items:center;padding:16px 0;border-bottom:var(--bl);' +
                                (r.out ? 'opacity:.42;' : ''),
                            )}
                          >
                            <img
                              src={r.img}
                              alt={r.alt}
                              loading="lazy"
                              width={200}
                              height={200}
                              style={css('width:88px;height:88px;object-fit:cover')}
                            />
                            <div>
                              <p style={css('font-family:var(--fu);font-size:12px;letter-spacing:.16em;color:var(--slate)')}>{r.code}</p>
                              <h3 style={css('font-size:.9375rem;font-weight:700;margin-top:5px')}>
                                <span data-en="1">{r.name}</span>
                                <span data-bn="1">{r.nameBn}</span>
                              </h3>
                              <p style={css('font-size:.8125rem;color:var(--slate);margin-top:4px')}>
                                <span data-en="1">
                                  {r.config} · Sleeps {r.sleeps}
                                </span>
                                <span data-bn="1">
                                  {r.configBn} · ধারণক্ষমতা {r.sleeps} জন
                                </span>
                              </p>
                              <p style={css('font-family:var(--fu);font-size:.8125rem;margin-top:6px;font-variant-numeric:tabular-nums')}>
                                <span data-en="1">৳{money(r.rate)} / night</span>
                                <span data-bn="1">৳{money(r.rate)} / রাত</span>
                              </p>
                              {flag && (
                                <p
                                  style={css(
                                    'font-family:var(--fu);font-size:12px;letter-spacing:.14em;color:' +
                                      (r.out ? 'var(--slate)' : 'var(--brass)') +
                                      ';margin-top:6px;text-transform:uppercase',
                                  )}
                                >
                                  {flag}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              disabled={r.out}
                              onClick={() => !r.out && selectRoom(r.code)}
                              style={css(
                                'font-size:13px;font-weight:700;padding:11px 16px;min-height:44px;border-radius:2px;white-space:nowrap;' +
                                  (r.out
                                    ? 'background:var(--mist);color:var(--slate);cursor:not-allowed;'
                                    : picked === r.code
                                      ? 'background:var(--ink);color:var(--limestone);'
                                      : 'background:var(--lacquer);color:#fff;'),
                              )}
                            >
                              {r.out
                                ? isBn
                                  ? 'খালি নেই'
                                  : 'Unavailable'
                                : picked === r.code
                                  ? isBn
                                    ? 'নির্বাচিত'
                                    : 'Selected'
                                  : isBn
                                    ? 'নির্বাচন করুন'
                                    : 'Select'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {avail === 'idle' && (
                    <p style={css('margin-top:30px;font-size:.9375rem;color:var(--slate)')}>
                      <span data-en="1">Pick your dates to see what is open.</span>
                      <span data-bn="1">রুম খালি আছে কিনা দেখতে তারিখ নির্বাচন করুন।</span>
                    </p>
                  )}
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 style={h2Style}>
                    <span data-en="1">Add to your stay</span>
                    <span data-bn="1">অতিরিক্ত সেবা সমূহ</span>
                  </h2>
                  <p style={css('font-size:.875rem;color:var(--slate);margin-top:10px;line-height:1.6')}>
                    <span data-en="1">
                      Optional. Reception arranges all of these. Prices are being confirmed with the hotel.
                    </span>
                    <span data-bn="1">
                      ঐচ্ছিক। রিসেপশন এই সেবাগুলো আয়োজন করবে। মূল্য হোটেল কর্তৃক নিশ্চিত করা হচ্ছে।
                    </span>
                  </p>
                  <div style={css('margin-top:22px;border-top:var(--bl)')}>
                    {addons.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggleAddon(a.id)}
                        style={css('display:flex;align-items:center;gap:14px;width:100%;text-align:left;padding:15px 0;border-bottom:var(--bl);min-height:56px')}
                      >
                        <span
                          style={css(
                            'width:18px;height:18px;border:1px solid ' +
                              (activeAddons[a.id] ? 'var(--lacquer)' : 'rgba(22,24,26,.3)') +
                              ';background:' +
                              (activeAddons[a.id] ? 'var(--lacquer)' : 'transparent') +
                              ';flex:0 0 auto;border-radius:2px',
                          )}
                        />
                        <span style={css('flex:1')}>
                          <span style={css('display:block;font-size:.9375rem;font-weight:600')}>
                            {isBn ? a.labelBn : a.label}
                          </span>
                          <span style={css('display:block;font-size:.8125rem;color:var(--slate);margin-top:3px')}>
                            {isBn ? a.unitBn : a.unit}
                          </span>
                        </span>
                        <span style={css('font-family:var(--fu);font-size:.875rem;font-variant-numeric:tabular-nums')}>
                          ৳{money(a.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 style={h2Style}>
                    <span data-en="1">Your details</span>
                    <span data-bn="1">আপনার তথ্য</span>
                  </h2>
                  <div style={css('display:flex;flex-direction:column;gap:20px;margin-top:24px')}>
                    <label style={css('display:block')}>
                      <span style={labelStyle}>{isBn ? 'পূর্ণ নাম' : 'FULL NAME'}</span>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setField('name', e.target.value)}
                        onBlur={() => validate('name')}
                        placeholder={isBn ? 'সংরক্ষণকারীর পূর্ণ নাম' : 'Name for the reservation'}
                        style={inputStyle}
                      />
                      {errors.name && (
                        <span style={errStyle}>
                          {isBn ? 'রুম বুকিংয়ের জন্য আপনার নামটি প্রদান করুন।' : errors.name}
                        </span>
                      )}
                    </label>
                    <label style={css('display:block')}>
                      <span style={labelStyle}>{isBn ? 'মোবাইল নম্বর' : 'MOBILE'}</span>
                      <input
                        type="tel"
                        value={form.mobile}
                        onChange={(e) => setField('mobile', e.target.value)}
                        onBlur={() => validate('mobile')}
                        placeholder={isBn ? '০১৭৯৫৮৫৫৫৫৫' : '01XXXXXXXXX'}
                        style={monoInputStyle}
                      />
                      {errors.mobile && (
                        <span style={errStyle}>
                          {isBn ? 'একটি সঠিক মোবাইল নম্বর প্রদান করুন (যেমন: ০১৭৯৫৮৫৫৫৫৫)।' : errors.mobile}
                        </span>
                      )}
                    </label>
                    <label style={css('display:block')}>
                      <span style={labelStyle}>{isBn ? 'ইমেইল (ঐচ্ছিক)' : 'EMAIL, OPTIONAL'}</span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setField('email', e.target.value)}
                        onBlur={() => validate('email')}
                        placeholder={isBn ? 'লিখিত বুকিং নিশ্চিতকরণের জন্য' : 'For the written confirmation'}
                        style={inputStyle}
                      />
                      {errors.email && (
                        <span style={errStyle}>
                          {isBn ? 'আপনার ইমেইল ঠিকানাটি সঠিকভাবে প্রদান করুন।' : errors.email}
                        </span>
                      )}
                    </label>
                    <label style={css('display:block')}>
                      <span style={labelStyle}>{isBn ? 'আনুমানিক পৌঁছানোর সময়' : 'ARRIVAL TIME, APPROXIMATE'}</span>
                      <input
                        type="text"
                        value={form.arrival}
                        onChange={(e) => setField('arrival', e.target.value)}
                        placeholder={isBn ? 'যেমন: ২১:৩০, ঢাকা বাস থেকে নেমে' : 'e.g. 21:30, off the Dhaka coach'}
                        style={inputStyle}
                      />
                    </label>
                    <label style={css('display:block')}>
                      <span style={labelStyle}>{isBn ? 'রিসেপশনের জন্য বিশেষ অনুরোধ' : 'NOTES FOR RECEPTION'}</span>
                      <textarea
                        value={form.notes}
                        onChange={(e) => setField('notes', e.target.value)}
                        maxLength={240}
                        rows={3}
                        placeholder={
                          isBn ? 'উপরের তলার রুম, দ্রুত সকালের নাস্তা ইত্যাদি' : 'Higher floor, early breakfast, anything else'
                        }
                        style={css('width:100%;border-bottom:var(--bl);padding:12px 0;font-size:15px;resize:vertical')}
                      />
                      <span style={css('display:block;font-family:var(--fu);font-size:12.5px;color:var(--slate);text-align:right;font-variant-numeric:tabular-nums')}>
                        {isBn ? 240 - form.notes.length + 'টি অক্ষর বাকি' : 240 - form.notes.length + ' left'}
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <h2 style={h2Style}>
                    <span data-en="1">Payment and confirm</span>
                    <span data-bn="1">পেমেন্ট এবং বুকিং নিশ্চিতকরণ</span>
                  </h2>
                  <div style={css('margin-top:22px;border-top:var(--bl);padding-top:18px;display:grid;grid-template-columns:1fr auto;gap:11px 16px;font-size:.875rem')}>
                    <span>
                      <span data-en="1">
                        {pickedRoom?.code} · {pickedRoom?.name}, {nights} nights
                      </span>
                      <span data-bn="1">
                        {pickedRoom?.code} · {pickedRoom?.nameBn}, {nights} রাত
                      </span>
                    </span>
                    <span style={css('font-family:var(--fu);font-variant-numeric:tabular-nums')}>৳{money(subtotal)}</span>
                    <span style={css('color:var(--slate)')}>
                      <span data-en="1">Add-ons</span>
                      <span data-bn="1">অতিরিক্ত সেবা</span>
                    </span>
                    <span style={css('font-family:var(--fu);font-variant-numeric:tabular-nums')}>৳{money(addonTotal)}</span>
                    <span style={css('color:var(--slate)')}>
                      <span data-en="1">VAT &amp; service charge (15%)</span>
                      <span data-bn="1">ভ্যাট ও সার্ভিস চার্জ (১৫%)</span>
                    </span>
                    <span style={css('font-family:var(--fu);font-variant-numeric:tabular-nums')}>৳{money(vat)}</span>
                  </div>
                  <div style={css('display:flex;justify-content:space-between;align-items:baseline;margin-top:16px;padding-top:16px;border-top:1px solid var(--ink)')}>
                    <span style={css('font-size:1rem;font-weight:700')}>
                      <span data-en="1">Total</span>
                      <span data-bn="1">মোট</span>
                    </span>
                    <span style={css('font-family:var(--fu);font-size:1.35rem;font-variant-numeric:tabular-nums')}>
                      ৳{money(total)}
                    </span>
                  </div>
                  <p style={css('font-family:var(--fu);font-size:12px;letter-spacing:.18em;color:var(--slate);margin-top:28px')}>
                    <span data-en="1">PAY WITH</span>
                    <span data-bn="1">পেমেন্ট মাধ্যম</span>
                  </p>
                  <div style={css('display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px')}>
                    {pays.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPay(p.id)}
                        style={css(
                          'padding:15px 12px;min-height:52px;border-radius:2px;font-size:13.5px;font-weight:600;text-align:center;' +
                            (pay === p.id ? 'background:var(--ink);color:var(--limestone);' : 'border:var(--bl);'),
                        )}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <p style={css('font-size:.8125rem;color:var(--slate);line-height:1.6;margin-top:20px')}>
                    <span data-en="1">
                      Cancellation terms apply to this rate. Read the{' '}
                      <TLink href="/policies/cancellation-refund" style={css('color:var(--lacquer)')}>
                        cancellation and refund policy
                      </TLink>{' '}
                      before you confirm.
                    </span>
                    <span data-bn="1">
                      এই ভাড়ার ক্ষেত্রে বুকিং বাতিলকরণ পলিসি প্রযোজ্য। কনফার্ম করার পূর্বে{' '}
                      <TLink href="/policies/cancellation-refund" style={css('color:var(--lacquer)')}>
                        বাতিল এবং রিফান্ড পলিসি
                      </TLink>{' '}
                      পড়ুন।
                    </span>
                  </p>
                </div>
              )}

              {step === 6 && (
                <div>
                  <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:var(--brass)')}>
                    <span data-en="1">CONFIRMED</span>
                    <span data-bn="1">বুকিং সম্পন্ন হয়েছে</span>
                  </p>
                  <h2 style={css('font-size:1.7rem;font-weight:700;letter-spacing:-.03em;margin-top:14px')}>
                    <span data-en="1">Room held under {form.name}.</span>
                    <span data-bn="1">{form.name} এর নামে রুমটি বুকিং করা হয়েছে।</span>
                  </h2>
                  <p style={css('font-family:var(--fu);font-size:clamp(1.6rem,6vw,2.4rem);letter-spacing:-.02em;margin-top:26px;color:var(--lacquer);font-variant-numeric:tabular-nums')}>
                    {conf}
                  </p>
                  <div style={css('margin-top:26px;border-top:var(--bl);padding-top:18px;display:grid;grid-template-columns:1fr auto;gap:11px 16px;font-size:.875rem')}>
                    <span style={css('color:var(--slate)')}>
                      <span data-en="1">Dates</span>
                      <span data-bn="1">তারিখ</span>
                    </span>
                    <span style={css('font-family:var(--fu);font-variant-numeric:tabular-nums')}>
                      {ci ? fmt(ci, isBn) + ' → ' + fmt(co, isBn) : ''}
                    </span>
                    <span style={css('color:var(--slate)')}>
                      <span data-en="1">Room</span>
                      <span data-bn="1">রুম</span>
                    </span>
                    <span style={css('font-family:var(--fu)')}>{pickedRoom?.code}</span>
                    <span style={css('color:var(--slate)')}>
                      <span data-en="1">Total</span>
                      <span data-bn="1">মোট</span>
                    </span>
                    <span style={css('font-family:var(--fu);font-variant-numeric:tabular-nums')}>৳{money(total)}</span>
                  </div>
                  <div style={css('display:flex;gap:8px;flex-wrap:wrap;margin-top:26px')}>
                    <button
                      type="button"
                      onClick={copyCode}
                      style={css('font-size:13px;font-weight:600;border:var(--bl);padding:13px 18px;min-height:46px;border-radius:2px')}
                    >
                      <span data-en="1">Copy code</span>
                      <span data-bn="1">কোড কপি করুন</span>
                    </button>
                    <a
                      href={`https://wa.me/${settings.whatsapp}?text=Booking%20${conf ?? ''}`}
                      target="_blank"
                      rel="noopener"
                      style={css('font-size:13px;font-weight:600;border:var(--bl);padding:13px 18px;min-height:46px;border-radius:2px;color:var(--ink);display:inline-flex;align-items:center')}
                      data-hover-style="background:var(--mist);color:var(--ink)"
                    >
                      <span data-en="1">WhatsApp us</span>
                      <span data-bn="1">হোয়াটসঅ্যাপ করুন</span>
                    </a>
                    <button
                      type="button"
                      onClick={resetBooking}
                      style={css('font-size:13px;font-weight:600;background:var(--ink);color:var(--limestone);padding:13px 18px;min-height:46px;border-radius:2px')}
                    >
                      <span data-en="1">Book another</span>
                      <span data-bn="1">আরেকটি বুকিং করুন</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {summaryOn && (
              <div style={css('position:sticky;bottom:0;background:var(--night);color:var(--limestone);padding:16px clamp(20px,4vw,34px) calc(16px + env(safe-area-inset-bottom));display:flex;align-items:center;justify-content:space-between;gap:16px')}>
                <div>
                  <p style={css('font-family:var(--fu);font-size:12px;letter-spacing:.16em;color:var(--slate);font-variant-numeric:tabular-nums')}>
                    {rangeLabel}
                  </p>
                  <p style={css('font-family:var(--fu);font-size:1.05rem;margin-top:5px;font-variant-numeric:tabular-nums')}>
                    ৳{money(total)}
                  </p>
                </div>
                {step === 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (ci && co) {
                        loadAvail();
                        setStep(2);
                      }
                    }}
                    style={primaryStyle}
                  >
                    <span data-en="1">See rooms</span>
                    <span data-bn="1">রুম সমূহ দেখুন</span>
                  </button>
                )}
                {step === 3 && (
                  <button type="button" onClick={() => setStep(4)} style={primaryStyle}>
                    <span data-en="1">Your details</span>
                    <span data-bn="1">আপনার তথ্য</span>
                  </button>
                )}
                {step === 4 && (
                  <button type="button" onClick={goToPayment} style={primaryStyle}>
                    <span data-en="1">Payment</span>
                    <span data-bn="1">পেমেন্ট</span>
                  </button>
                )}
                {step === 5 && (
                  <button
                    type="button"
                    onClick={confirmBooking}
                    style={css('position:relative;overflow:hidden;background:var(--lacquer);color:#fff;font-size:14px;font-weight:700;padding:14px 24px;min-height:48px;border-radius:2px')}
                  >
                    {placing && (
                      <span
                        aria-hidden="true"
                        style={css('position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);animation:hvsweep 1s linear infinite')}
                      />
                    )}
                    {placing
                      ? isBn
                        ? 'সংরক্ষণ করা হচ্ছে…'
                        : 'Reserving…'
                      : isBn
                        ? 'বুকিং নিশ্চিত করুন'
                        : 'Confirm booking'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {panel === 'table' && <TableFlow />}
      </div>
    </div>
  );
}

function TableFlow() {
  const { table, setTbl, tblNext, tblConfirm, closePanel, isBn } = useSite();
  const t0 = useMemo(() => today(), []);

  const dates = [0, 1, 2, 3, 4, 5].map((d) => iso(new Date(t0.getTime() + d * 86400000)));
  const times = ['18:00', '19:00', '19:30', '20:00', '21:00', '21:30'];
  const parties = [2, 3, 4, 6, 8, 10];

  const chip = (on: boolean) =>
    css(
      'font-family:var(--fu);font-size:13px;padding:12px 10px;min-height:46px;border-radius:2px;' +
        (on ? 'background:var(--lacquer);color:#fff;' : 'border:var(--bl);'),
    );

  const summary =
    (table.date ? fmt(table.date, isBn) : isBn ? 'তারিখ নেই' : 'NO DATE') +
    ' · ' +
    table.time +
    ' · ' +
    table.party +
    (isBn ? ' জন অতিথি' : ' GUESTS');

  const canConfirm = table.name.trim().length > 1 && /^01[3-9]\d{8}$/.test(table.mobile.replace(/\s|-/g, ''));

  return (
    <div style={css('padding:clamp(22px,4vw,34px)')}>
      <div style={css('display:flex;justify-content:space-between;align-items:center;gap:16px')}>
        <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:var(--slate)')}>
          <span data-en="1">SKY VIEW · TABLE</span>
          <span data-bn="1">স্কাই ভিউ · টেবিল</span>
        </p>
        <button
          type="button"
          onClick={closePanel}
          aria-label="Close"
          style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.14em;color:var(--slate);min-height:44px')}
        >
          <span data-en="1">CLOSE ✕</span>
          <span data-bn="1">বন্ধ করুন ✕</span>
        </button>
      </div>

      {table.step === 1 && (
        <div>
          <h2 style={css('font-size:1.5rem;font-weight:700;letter-spacing:-.03em;margin-top:20px')}>
            <span data-en="1">Reserve a table on the roof</span>
            <span data-bn="1">ছাদে টেবিল রিজার্ভ করুন</span>
          </h2>
          <p style={css('font-family:var(--fu);font-size:12px;letter-spacing:.18em;color:var(--slate);margin-top:26px')}>
            <span data-en="1">DATE</span>
            <span data-bn="1">তারিখ</span>
          </p>
          <div style={css('display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:10px')}>
            {dates.map((d) => (
              <button key={d} type="button" onClick={() => setTbl('date', d)} style={chip(table.date === d)}>
                {fmt(d, isBn)}
              </button>
            ))}
          </div>
          <p style={css('font-family:var(--fu);font-size:12px;letter-spacing:.18em;color:var(--slate);margin-top:24px')}>
            <span data-en="1">TIME</span>
            <span data-bn="1">সময়</span>
          </p>
          <div style={css('display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:10px')}>
            {times.map((t) => (
              <button key={t} type="button" onClick={() => setTbl('time', t)} style={chip(table.time === t)}>
                {t}
              </button>
            ))}
          </div>
          <p style={css('font-family:var(--fu);font-size:12px;letter-spacing:.18em;color:var(--slate);margin-top:24px')}>
            <span data-en="1">PARTY SIZE</span>
            <span data-bn="1">অতিথির সংখ্যা</span>
          </p>
          <div style={css('display:grid;grid-template-columns:repeat(6,1fr);gap:7px;margin-top:10px')}>
            {parties.map((p) => (
              <button key={p} type="button" onClick={() => setTbl('party', p)} style={chip(table.party === p)}>
                {p}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={!table.date}
            onClick={() => table.date && tblNext()}
            style={css(
              'width:100%;margin-top:30px;font-size:14px;font-weight:700;padding:16px;min-height:52px;border-radius:2px;' +
                (table.date ? 'background:var(--lacquer);color:#fff;' : 'background:var(--mist);color:var(--slate);cursor:not-allowed;'),
            )}
          >
            <span data-en="1">Continue</span>
            <span data-bn="1">এগিয়ে যান</span>
          </button>
        </div>
      )}

      {table.step === 2 && (
        <div>
          <h2 style={css('font-size:1.5rem;font-weight:700;letter-spacing:-.03em;margin-top:20px')}>
            <span data-en="1">Who is the table for</span>
            <span data-bn="1">কার জন্য টেবিল বুকিং</span>
          </h2>
          <p style={css('font-family:var(--fu);font-size:13px;letter-spacing:.16em;color:var(--lacquer);margin-top:12px')}>
            {summary}
          </p>
          <label style={css('display:block;margin-top:26px')}>
            <span style={labelStyle}>
              <span data-en="1">NAME</span>
              <span data-bn="1">নাম</span>
            </span>
            <input type="text" value={table.name} onChange={(e) => setTbl('name', e.target.value)} style={inputStyle} />
          </label>
          <label style={css('display:block;margin-top:20px')}>
            <span style={labelStyle}>
              <span data-en="1">MOBILE</span>
              <span data-bn="1">মোবাইল নম্বর</span>
            </span>
            <input
              type="tel"
              value={table.mobile}
              onChange={(e) => setTbl('mobile', e.target.value)}
              placeholder="01XXXXXXXXX"
              style={css('width:100%;border-bottom:var(--bl);padding:12px 0;min-height:48px;font-size:15px;font-family:var(--fu)')}
            />
          </label>
          <button
            type="button"
            disabled={!canConfirm}
            onClick={() => canConfirm && tblConfirm()}
            style={css(
              'width:100%;margin-top:30px;font-size:14px;font-weight:700;padding:16px;min-height:52px;border-radius:2px;' +
                (canConfirm ? 'background:var(--lacquer);color:#fff;' : 'background:var(--mist);color:var(--slate);'),
            )}
          >
            <span data-en="1">Confirm table</span>
            <span data-bn="1">টেবিল কনফার্ম করুন</span>
          </button>
        </div>
      )}

      {table.step === 3 && (
        <div>
          <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.2em;color:var(--brass);margin-top:20px')}>
            <span data-en="1">TABLE HELD</span>
            <span data-bn="1">টেবিল সংরক্ষিত</span>
          </p>
          <h2 style={css('font-size:1.5rem;font-weight:700;letter-spacing:-.03em;margin-top:14px')}>
            <span data-en="1">See you on the roof, {table.name}.</span>
            <span data-bn="1">ছাদে দেখা হবে, {table.name}।</span>
          </h2>
          <p style={css('font-family:var(--fu);font-size:2rem;color:var(--lacquer);margin-top:22px;font-variant-numeric:tabular-nums')}>
            {table.code}
          </p>
          <p style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.14em;color:var(--slate);margin-top:14px')}>
            {summary}
          </p>
          <p style={css('font-size:.8125rem;color:var(--slate);line-height:1.6;margin-top:20px')}>
            <span data-en="1">
              Sky View holds the table for 20 minutes past the booking time. Call reception if you are running late.
            </span>
            <span data-bn="1">
              স্কাই ভিউ বুকিং সময়ের পর ২০ মিনিট পর্যন্ত টেবিল ধরে রাখে। দেরি হলে দয়া করে রিসেপশনে জানান।
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
