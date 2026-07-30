'use client';

import React from 'react';
import { css } from '@/lib/css';
import { money, nightsBetween } from '@/lib/format';
import type { BookingRecord } from '@/lib/defaults';
import { Wordmark } from '@/components/chrome/Wordmark';

const thStyle = css('padding-bottom:12px');
const thRight = css('padding-bottom:12px;text-align:right');
const tdRight = css('padding:16px 0;text-align:right;font-family:var(--fu);font-variant-numeric:tabular-nums');

/** Printable invoice for a single reservation. */
export function InvoiceModal({
  booking,
  nightlyRate,
  onClose,
}: {
  booking: BookingRecord;
  nightlyRate: number;
  onClose: () => void;
}) {
  const nights = Math.max(1, nightsBetween(booking.ci, booking.co));
  const subtotal = Math.round(booking.rate / 1.15);
  const vat = booking.rate - subtotal;

  return (
    <div style={css('position:fixed;inset:0;background:rgba(14,17,20,0.65);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:900;padding:20px;overflow-y:auto')}>
      <div
        className="invoice-print-card"
        style={css('background:#fff;color:var(--ink);width:100%;max-width:680px;border-radius:2px;box-shadow:0 30px 90px -15px rgba(0,0,0,0.3);overflow:hidden;animation:fadeIn .3s var(--eo);display:flex;flex-direction:column')}
      >
        <div style={css('padding:40px;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:flex-start;gap:20px')}>
          <div>
            <Wordmark color="var(--ink)" size="24px" />
            <span style={css('display:block;font-family:var(--fu);font-size:10px;letter-spacing:.2em;color:var(--slate);margin-top:4px')}>
              MAIJDEE COURT · NOAKHALI
            </span>
            <p style={css('font-size:11px;color:var(--slate);margin-top:14px;line-height:1.5')}>
              Boro Masjid Moar, Main Road, Sadar
              <br />
              Noakhali-3800, Bangladesh
              <br />
              Phone: +880 1795 855555
            </p>
          </div>
          <div style={css('text-align:right')}>
            <h2 style={css('font-family:var(--fu);font-size:18px;font-weight:700;letter-spacing:.1em;color:var(--lacquer)')}>
              INVOICE
            </h2>
            <div style={css('margin-top:16px;font-size:12px;color:var(--slate);display:flex;flex-direction:column;gap:4px')}>
              <div>
                <strong style={css('color:var(--ink)')}>Invoice No:</strong>{' '}
                <span style={css('font-family:var(--fu);font-variant-numeric:tabular-nums')}>{booking.id}</span>
              </div>
              <div>
                <strong style={css('color:var(--ink)')}>Date:</strong>{' '}
                <span style={css('font-family:var(--fu);font-variant-numeric:tabular-nums')}>{booking.date}</span>
              </div>
              <div>
                <strong style={css('color:var(--ink)')}>Status:</strong>{' '}
                <span
                  style={css(
                    'font-family:var(--fu);text-transform:uppercase;color:' +
                      (booking.status === 'Paid' ? '#1F5C4A' : '#A81E2D'),
                  )}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={css('padding:32px 40px;background:#F9F9F7;display:grid;grid-template-columns:1fr 1fr;gap:24px;border-bottom:1px solid #f0f0f0')}>
          <div>
            <span style={css('font-family:var(--fu);font-size:10px;letter-spacing:.12em;color:var(--slate)')}>BILL TO:</span>
            <h4 style={css('font-size:15px;font-weight:700;margin-top:6px')}>{booking.name}</h4>
            <div style={css('margin-top:8px;font-size:12px;color:var(--slate);display:flex;flex-direction:column;gap:3px')}>
              <span>Phone: {booking.mobile}</span>
              <span>Email: {booking.email || 'N/A'}</span>
            </div>
          </div>
          <div>
            <span style={css('font-family:var(--fu);font-size:10px;letter-spacing:.12em;color:var(--slate)')}>
              RESERVATION DETAILS:
            </span>
            <h4 style={css('font-size:14px;font-weight:700;margin-top:6px')}>{booking.room}</h4>
            <div style={css('margin-top:8px;font-size:12px;color:var(--slate);display:flex;flex-direction:column;gap:3px')}>
              <span>
                Check-in: <span style={css('font-family:var(--fu);font-variant-numeric:tabular-nums')}>{booking.ci}</span>
              </span>
              <span>
                Check-out: <span style={css('font-family:var(--fu);font-variant-numeric:tabular-nums')}>{booking.co}</span>
              </span>
              <span>
                Nights: <span style={css('font-family:var(--fu);font-variant-numeric:tabular-nums')}>{nights}</span>
              </span>
            </div>
          </div>
        </div>

        <div style={css('padding:32px 40px;flex:1')}>
          <table style={css('width:100%;border-collapse:collapse;text-align:left;font-size:13.5px')}>
            <thead>
              <tr style={css('border-bottom:2px solid var(--ink);font-family:var(--fu);font-size:10.5px;letter-spacing:.1em;color:var(--slate)')}>
                <th style={thStyle}>DESCRIPTION</th>
                <th style={thRight}>QTY</th>
                <th style={thRight}>UNIT PRICE</th>
                <th style={thRight}>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr style={css('border-bottom:1px solid #f0f0f0')}>
                <td style={css('padding:16px 0')}>
                  <strong>Accommodation Charges</strong>
                  <div style={css('font-size:11.5px;color:var(--slate);margin-top:4px')}>
                    {booking.room} · {nights} night(s)
                  </div>
                </td>
                <td style={tdRight}>1</td>
                <td style={tdRight}>৳{money(nightlyRate)}</td>
                <td style={tdRight}>৳{money(subtotal)}</td>
              </tr>
              <tr>
                <td colSpan={2} />
                <td style={css('padding:14px 0 6px;text-align:right;color:var(--slate)')}>Subtotal</td>
                <td style={css('padding:14px 0 6px;text-align:right;font-family:var(--fu);font-variant-numeric:tabular-nums')}>
                  ৳{money(subtotal)}
                </td>
              </tr>
              <tr style={css('border-bottom:1px solid #e0e0e0')}>
                <td colSpan={2} />
                <td style={css('padding:6px 0 14px;text-align:right;color:var(--slate)')}>VAT &amp; Service (15%)</td>
                <td style={css('padding:6px 0 14px;text-align:right;font-family:var(--fu);font-variant-numeric:tabular-nums')}>
                  ৳{money(vat)}
                </td>
              </tr>
              <tr style={css('font-size:16px;font-weight:700')}>
                <td colSpan={2} />
                <td style={css('padding:20px 0;text-align:right;color:var(--ink)')}>Total</td>
                <td style={css('padding:20px 0;text-align:right;font-family:var(--fu);font-variant-numeric:tabular-nums;color:var(--lacquer)')}>
                  ৳{money(booking.rate)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          className="invoice-print-btn-panel"
          style={css('padding:28px 40px;background:#F9F9F7;border-top:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap')}
        >
          <span style={css('font-size:11px;color:var(--slate)')}>Thank you for choosing Hotel Valentino.</span>
          <div style={css('display:flex;gap:12px')}>
            <button
              type="button"
              onClick={() => window.print()}
              style={css('padding:10px 18px;border:1px solid var(--ink);font-family:var(--fu);font-size:12px;letter-spacing:.05em;font-weight:700;border-radius:2px')}
              data-hover-style="background:var(--mist)"
            >
              PRINT INVOICE
            </button>
            <button
              type="button"
              onClick={onClose}
              style={css('padding:10px 22px;background:var(--ink);color:var(--limestone);font-family:var(--fu);font-size:12px;letter-spacing:.05em;font-weight:700;border-radius:2px')}
              data-hover-style="background:var(--lacquer);color:#fff"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
