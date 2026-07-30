'use client';

import React from 'react';
import { money } from '@/lib/data';

interface InvoiceModalProps {
  booking: any;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const subtotal = Math.round(booking.rate / 1.15);
  const vat = booking.rate - subtotal;

  return (
    <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, zIndex: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)', padding: '20px' }}>
      <div style={{ background: '#fff', color: '#16181A', width: '100%', maxWidth: '720px', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: 'var(--night)', color: '#fff' }}>
          <p style={{ fontWeight: 700, fontSize: '14px' }}>Invoice Preview — {booking.id}</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={handlePrint} style={{ background: 'var(--lacquer)', color: '#fff', padding: '8px 18px', borderRadius: '2px', fontWeight: 700, fontSize: '13px' }}>
              🖨️ Print Invoice
            </button>
            <button type="button" onClick={onClose} style={{ color: '#fff', fontSize: '16px' }}>✕</button>
          </div>
        </div>

        {/* PRINT AREA */}
        <div id="invoice-print-area" style={{ padding: '40px', background: '#fff', color: '#16181A', fontFamily: 'var(--fd)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #16181A', paddingBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-.02em', color: '#A81E2D' }}>HOTEL VALENTINO</h1>
              <p style={{ fontFamily: 'var(--fu)', fontSize: '12px', letterSpacing: '.2em', color: '#5B6058', marginTop: '4px' }}>MAIJDEE COURT · NOAKHALI</p>
              <address style={{ fontStyle: 'normal', fontSize: '12.5px', color: '#5B6058', marginTop: '10px', lineHeight: 1.5 }}>
                Boro Masjid Moar, Main Road, Maijdee Court<br />
                Sadar, Noakhali-3800, Bangladesh<br />
                Phone: +880 1795 855555
              </address>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#16181A' }}>INVOICE</h2>
              <p style={{ fontFamily: 'var(--fu)', fontSize: '14px', fontWeight: 700, color: '#A81E2D', marginTop: '6px' }}>{booking.id}</p>
              <p style={{ fontFamily: 'var(--fu)', fontSize: '12px', color: '#5B6058', marginTop: '4px' }}>Date: {booking.date}</p>
              <p style={{ display: 'inline-block', background: booking.status === 'Paid' ? '#1F5C4A' : '#A98A55', color: '#fff', padding: '4px 10px', borderRadius: '2px', fontSize: '11px', fontWeight: 700, marginTop: '8px' }}>
                STATUS: {booking.status?.toUpperCase()}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', margin: '24px 0', padding: '16px', background: '#F5F5F3', borderRadius: '4px' }}>
            <div>
              <p style={{ fontFamily: 'var(--fu)', fontSize: '11px', letterSpacing: '.18em', color: '#5B6058' }}>BILLED TO</p>
              <p style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>{booking.name}</p>
              <p style={{ fontSize: '13px', color: '#5B6058', marginTop: '2px' }}>Mobile: {booking.mobile}</p>
              <p style={{ fontSize: '13px', color: '#5B6058' }}>Email: {booking.email || 'N/A'}</p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--fu)', fontSize: '11px', letterSpacing: '.18em', color: '#5B6058' }}>RESERVATION DETAILS</p>
              <p style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>Room: {booking.room}</p>
              <p style={{ fontSize: '13px', color: '#5B6058', marginTop: '2px' }}>Check-in: {booking.ci} | Check-out: {booking.co}</p>
              <p style={{ fontSize: '13px', color: '#5B6058' }}>Payment Method: {(booking.pay || 'bkash').toUpperCase()}</p>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #16181A', textAlign: 'left', fontFamily: 'var(--fu)', fontSize: '11.5px', color: '#5B6058' }}>
                <th style={{ padding: '10px 0' }}>DESCRIPTION</th>
                <th style={{ padding: '10px 0', textAlign: 'right' }}>AMOUNT (BDT)</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '13.5px' }}>
              <tr style={{ borderBottom: '1px solid #E9EAE5' }}>
                <td style={{ padding: '12px 0' }}>
                  <strong>{booking.room} Accommodation</strong><br />
                  <span style={{ fontSize: '12px', color: '#5B6058' }}>Dates: {booking.ci} to {booking.co}</span>
                </td>
                <td style={{ padding: '12px 0', textAlign: 'right', fontFamily: 'var(--fu)' }}>৳{money(subtotal)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #E9EAE5' }}>
                <td style={{ padding: '12px 0' }}>Government VAT & Service Charge (15%)</td>
                <td style={{ padding: '12px 0', textAlign: 'right', fontFamily: 'var(--fu)' }}>৳{money(vat)}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '2px solid #16181A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#5B6058' }}>Thank you for staying at Hotel Valentino!</p>
              <p style={{ fontSize: '11px', color: '#5B6058', marginTop: '2px' }}>Computer generated invoice. No signature required.</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: 'var(--fu)', fontSize: '12px', color: '#5B6058' }}>TOTAL AMOUNT</p>
              <p style={{ fontFamily: 'var(--fu)', fontSize: '24px', fontWeight: 800, color: '#A81E2D' }}>৳{money(booking.rate)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
