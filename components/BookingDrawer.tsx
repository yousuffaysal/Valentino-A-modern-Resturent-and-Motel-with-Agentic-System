'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ROOMS, ADDONS, money, formatDisplayDate } from '@/lib/data';

interface BookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoomCode?: string | null;
  onBookingSuccess?: () => void;
}

export const BookingDrawer: React.FC<BookingDrawerProps> = ({
  isOpen,
  onClose,
  initialRoomCode = null,
  onBookingSuccess,
}) => {
  const { isBn } = useLanguage();
  const [step, setStep] = useState(initialRoomCode ? 3 : 1);
  const [ci, setCi] = useState<string | null>('2026-08-21');
  const [co, setCo] = useState<string | null>('2026-08-23');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [nrooms, setNrooms] = useState(1);
  const [pickedCode, setPickedCode] = useState<string | null>(initialRoomCode || 'HV-01');
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({ name: '', mobile: '', email: '', arrival: '', notes: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pay, setPay] = useState('bkash');
  const [placing, setPlacing] = useState(false);
  const [confCode, setConfCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const pickedRoom = ROOMS.find((r) => r.code === pickedCode) || ROOMS[0];

  const getNights = () => {
    if (!ci || !co) return 1;
    const d1 = new Date(ci).getTime();
    const d2 = new Date(co).getTime();
    const diff = Math.round((d2 - d1) / (1000 * 3600 * 24));
    return Math.max(1, diff);
  };

  const nights = getNights();

  const getSubtotal = () => (pickedRoom ? pickedRoom.rate * nights * nrooms : 0);
  const getAddonTotal = () =>
    ADDONS.reduce(
      (sum, a) => sum + (selectedAddons[a.id] ? (a.id === 'bed' ? a.price * nights : a.price) : 0),
      0
    );
  const getVat = () => Math.round((getSubtotal() + getAddonTotal()) * 0.15);
  const getTotal = () => getSubtotal() + getAddonTotal() + getVat();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) {
      errs.name = isBn ? 'রুম বুকিংয়ের জন্য আপনার নামটি প্রদান করুন।' : 'Tell us the name the room should be under.';
    }
    if (!/^01[3-9]\d{8}$/.test(form.mobile.replace(/\s|-/g, ''))) {
      errs.mobile = isBn ? 'একটি সঠিক মোবাইল নম্বর প্রদান করুন (যেমন: ০১৭৯৫৮৫৫৫৫৫)।' : 'Enter a mobile number we can confirm on, like 01795855555.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirm = async () => {
    if (!validate()) return;
    setPlacing(true);

    const generatedCode = `HV-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const bookingPayload = {
      id: generatedCode,
      name: form.name || 'Anonymous Guest',
      mobile: form.mobile || 'N/A',
      email: form.email || 'N/A',
      room: pickedRoom ? pickedRoom.name : 'Single Deluxe',
      rate: getTotal(),
      ci: ci || new Date().toISOString().split('T')[0],
      co: co || new Date().toISOString().split('T')[0],
      status: 'Paid',
      date: new Date().toISOString().split('T')[0],
      notes: form.notes,
      arrival: form.arrival,
      pay,
    };

    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });
      setConfCode(generatedCode);
      setStep(6);
      if (onBookingSuccess) onBookingSuccess();
    } catch (e) {
      console.error('Failed to post booking to Neon DB:', e);
      setConfCode(generatedCode);
      setStep(6);
    } finally {
      setPlacing(false);
    }
  };

  const rangeLabelText = isBn
    ? `${nights} রাত · ${formatDisplayDate(ci, true)} → ${formatDisplayDate(co, true)} · ${adults + children} জন অতিথি`
    : `${nights} NIGHTS · ${formatDisplayDate(ci, false)} → ${formatDisplayDate(co, false)} · ${adults + children} GUESTS`;

  return (
    <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', justifyContent: 'flex-end' }}>
      <button
        type="button"
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(14,17,20,.62)', backdropFilter: 'blur(3px)', cursor: 'default' }}
      ></button>

      <div
        style={{
          position: 'relative',
          background: 'var(--limestone)',
          width: '100%',
          maxWidth: '560px',
          height: '100%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-30px 0 80px -40px rgba(0,0,0,.6)',
        }}
      >
        {/* Header Bar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--limestone)', padding: '22px clamp(20px,4vw,34px) 16px', borderBottom: 'var(--bl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '12.5px', letterSpacing: '.2em', color: 'var(--slate)' }}>
              0{step} / 05
            </p>
            <button
              type="button"
              onClick={onClose}
              style={{ fontFamily: 'var(--fu)', fontSize: '12.5px', letterSpacing: '.14em', color: 'var(--slate)', minHeight: '44px' }}
            >
              <span data-en="1">CLOSE ✕</span>
              <span data-bn="1">বন্ধ করুন ✕</span>
            </button>
          </div>
        </div>

        <div style={{ flex: 1, padding: 'clamp(22px,4vw,34px)' }}>
          {/* STEP 1: Dates & Guests */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-.03em' }}>
                <span data-en="1">Dates and guests</span>
                <span data-bn="1">তারিখ এবং অতিথি</span>
              </h2>
              <p style={{ fontFamily: 'var(--fu)', fontSize: '13px', color: 'var(--lacquer)', marginTop: '12px' }}>
                {rangeLabelText}
              </p>

              <div style={{ marginTop: '30px', borderTop: 'var(--bl)' }}>
                {/* Adults Counter */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: 'var(--bl)' }}>
                  <div>
                    <p style={{ fontSize: '.9375rem', fontWeight: 600 }}>{isBn ? 'প্রাপ্তবয়স্ক' : 'Adults'}</p>
                    <p style={{ fontSize: '.8125rem', color: 'var(--slate)' }}>{isBn ? '১৩ বছর বা তার বেশি' : 'Age 13 and over'}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} style={{ width: '40px', height: '40px', border: 'var(--bl)', borderRadius: '2px' }}>-</button>
                    <span style={{ fontFamily: 'var(--fu)', fontSize: '14px' }}>{adults}</span>
                    <button type="button" onClick={() => setAdults(Math.min(4, adults + 1))} style={{ width: '40px', height: '40px', border: 'var(--bl)', borderRadius: '2px' }}>+</button>
                  </div>
                </div>

                {/* Children Counter */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: 'var(--bl)' }}>
                  <div>
                    <p style={{ fontSize: '.9375rem', fontWeight: 600 }}>{isBn ? 'শিশু' : 'Children'}</p>
                    <p style={{ fontSize: '.8125rem', color: 'var(--slate)' }}>{isBn ? '০ থেকে ১২ বছর' : 'Age 0 to 12'}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button type="button" onClick={() => setChildren(Math.max(0, children - 1))} style={{ width: '40px', height: '40px', border: 'var(--bl)', borderRadius: '2px' }}>-</button>
                    <span style={{ fontFamily: 'var(--fu)', fontSize: '14px' }}>{children}</span>
                    <button type="button" onClick={() => setChildren(Math.min(3, children + 1))} style={{ width: '40px', height: '40px', border: 'var(--bl)', borderRadius: '2px' }}>+</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Choose Room */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-.03em' }}>
                <span data-en="1">Choose a room</span>
                <span data-bn="1">রুম নির্বাচন করুন</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '22px' }}>
                {ROOMS.map((r) => (
                  <div key={r.code} style={{ display: 'grid', gridTemplateColumns: '88px 1fr auto', gap: '16px', alignItems: 'center', padding: '16px 0', borderBottom: 'var(--bl)' }}>
                    <img src={r.img} alt={r.name} width="88" height="88" style={{ width: '88px', height: '88px', objectFit: 'cover' }} />
                    <div>
                      <p style={{ fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--slate)' }}>{r.code}</p>
                      <h3 style={{ fontSize: '.9375rem', fontWeight: 700 }}>{isBn ? r.nameBn : r.name}</h3>
                      <p style={{ fontSize: '.8125rem', color: 'var(--slate)' }}>{isBn ? r.configBn : r.config} · {isBn ? `ধারণক্ষমতা ${r.sleeps} জন` : `Sleeps ${r.sleeps}`}</p>
                      <p style={{ fontFamily: 'var(--fu)', fontSize: '.8125rem', marginTop: '4px' }}>৳{money(r.rate)} / night</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setPickedCode(r.code); setStep(3); }}
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        padding: '11px 16px',
                        background: pickedCode === r.code ? 'var(--ink)' : 'var(--lacquer)',
                        color: '#fff',
                        borderRadius: '2px',
                      }}
                    >
                      {pickedCode === r.code ? (isBn ? 'নির্বাচিত' : 'Selected') : (isBn ? 'নির্বাচন করুন' : 'Select')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Addons */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-.03em' }}>
                <span data-en="1">Add to your stay</span>
                <span data-bn="1">অতিরিক্ত সেবা সমূহ</span>
              </h2>
              <div style={{ marginTop: '22px', borderTop: 'var(--bl)' }}>
                {ADDONS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setSelectedAddons((prev) => ({ ...prev, [a.id]: !prev[a.id] }))}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '100%', padding: '15px 0', borderBottom: 'var(--bl)' }}
                  >
                    <span style={{ width: '18px', height: '18px', border: '1px solid var(--lacquer)', background: selectedAddons[a.id] ? 'var(--lacquer)' : 'transparent', borderRadius: '2px' }}></span>
                    <span style={{ flex: 1, textAlign: 'left' }}>
                      <span style={{ display: 'block', fontSize: '.9375rem', fontWeight: 600 }}>{isBn ? a.labelBn : a.label}</span>
                      <span style={{ display: 'block', fontSize: '.8125rem', color: 'var(--slate)' }}>{isBn ? a.unitBn : a.unit}</span>
                    </span>
                    <span style={{ fontFamily: 'var(--fu)', fontSize: '.875rem' }}>৳{money(a.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Guest Details */}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-.03em' }}>
                <span data-en="1">Your details</span>
                <span data-bn="1">আপনার তথ্য</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
                <label style={{ display: 'block' }}>
                  <span style={{ display: 'block', fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--slate)' }}>{isBn ? 'পূর্ণ নাম' : 'FULL NAME'}</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={isBn ? 'সংরক্ষণকারীর পূর্ণ নাম' : 'Name for the reservation'}
                    style={{ width: '100%', borderBottom: 'var(--bl)', padding: '12px 0', fontSize: '15px' }}
                  />
                  {errors.name && <span style={{ color: 'var(--lacquer)', fontSize: '.8125rem', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
                </label>

                <label style={{ display: 'block' }}>
                  <span style={{ display: 'block', fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--slate)' }}>{isBn ? 'মোবাইল নম্বর' : 'MOBILE'}</span>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    placeholder={isBn ? '০১৭৯৫৮৫৫৫৫৫' : '01XXXXXXXXX'}
                    style={{ width: '100%', borderBottom: 'var(--bl)', padding: '12px 0', fontSize: '15px' }}
                  />
                  {errors.mobile && <span style={{ color: 'var(--lacquer)', fontSize: '.8125rem', marginTop: '4px', display: 'block' }}>{errors.mobile}</span>}
                </label>

                <label style={{ display: 'block' }}>
                  <span style={{ display: 'block', fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--slate)' }}>{isBn ? 'ইমেইল (ঐচ্ছিক)' : 'EMAIL, OPTIONAL'}</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder={isBn ? 'লিখিত বুকিং নিশ্চিতকরণের জন্য' : 'For confirmation'}
                    style={{ width: '100%', borderBottom: 'var(--bl)', padding: '12px 0', fontSize: '15px' }}
                  />
                </label>
              </div>
            </div>
          )}

          {/* STEP 5: Payment Summary */}
          {step === 5 && (
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-.03em' }}>
                <span data-en="1">Payment and confirm</span>
                <span data-bn="1">পেমেন্ট এবং বুকিং নিশ্চিতকরণ</span>
              </h2>
              <div style={{ marginTop: '22px', borderTop: 'var(--bl)', paddingTop: '18px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '11px 16px', fontSize: '.875rem' }}>
                <span>{pickedRoom.code} · {pickedRoom.name}, {nights} nights</span>
                <span style={{ fontFamily: 'var(--fu)' }}>৳{money(getSubtotal())}</span>
                <span>{isBn ? 'অতিরিক্ত সেবা' : 'Add-ons'}</span>
                <span style={{ fontFamily: 'var(--fu)' }}>৳{money(getAddonTotal())}</span>
                <span>{isBn ? 'ভ্যাট ও সার্ভিস চার্জ (১৫%)' : 'VAT & Service (15%)'}</span>
                <span style={{ fontFamily: 'var(--fu)' }}>৳{money(getVat())}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--ink)', fontWeight: 700 }}>
                <span>{isBn ? 'মোট' : 'Total'}</span>
                <span style={{ fontFamily: 'var(--fu)', fontSize: '1.35rem' }}>৳{money(getTotal())}</span>
              </div>

              <p style={{ fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--slate)', marginTop: '28px' }}>PAY WITH</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
                {['bkash', 'nagad', 'card', 'hotel'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPay(method)}
                    style={{
                      padding: '14px',
                      borderRadius: '2px',
                      fontWeight: 600,
                      background: pay === method ? 'var(--ink)' : 'transparent',
                      color: pay === method ? 'var(--limestone)' : 'var(--ink)',
                      border: 'var(--bl)',
                    }}
                  >
                    {method.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Confirmation Screen */}
          {step === 6 && confCode && (
            <div>
              <p style={{ fontFamily: 'var(--fu)', fontSize: '12.5px', color: 'var(--brass)' }}>CONFIRMED</p>
              <h2 style={{ fontSize: '1.7rem', fontWeight: 700, marginTop: '14px' }}>
                Room held under {form.name || 'Guest'}.
              </h2>
              <p style={{ fontFamily: 'var(--fu)', fontSize: '2.4rem', color: 'var(--lacquer)', marginTop: '26px' }}>
                {confCode}
              </p>
              <div style={{ marginTop: '26px', borderTop: 'var(--bl)', paddingTop: '18px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '11px 16px', fontSize: '.875rem' }}>
                <span>Dates</span><span>{ci} → {co}</span>
                <span>Room</span><span>{pickedRoom.code}</span>
                <span>Total</span><span>৳{money(getTotal())}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                style={{ width: '100%', background: 'var(--ink)', color: 'var(--limestone)', padding: '16px', borderRadius: '2px', marginTop: '26px', fontWeight: 700 }}
              >
                Close Booking Summary
              </button>
            </div>
          )}
        </div>

        {/* Bottom Action Footer */}
        {step < 6 && (
          <div style={{ position: 'sticky', bottom: 0, background: 'var(--night)', color: 'var(--limestone)', padding: '16px clamp(20px,4vw,34px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--slate)' }}>{rangeLabelText}</p>
              <p style={{ fontFamily: 'var(--fu)', fontSize: '1.05rem', marginTop: '4px' }}>৳{money(getTotal())}</p>
            </div>
            {step === 1 && (
              <button type="button" onClick={() => setStep(2)} style={{ background: 'var(--lacquer)', color: '#fff', padding: '14px 24px', fontWeight: 700, borderRadius: '2px' }}>
                {isBn ? 'রুম সমূহ দেখুন' : 'See rooms'}
              </button>
            )}
            {step === 2 && (
              <button type="button" onClick={() => setStep(3)} style={{ background: 'var(--lacquer)', color: '#fff', padding: '14px 24px', fontWeight: 700, borderRadius: '2px' }}>
                {isBn ? 'অতিরিক্ত সেবা' : 'Add-ons'}
              </button>
            )}
            {step === 3 && (
              <button type="button" onClick={() => setStep(4)} style={{ background: 'var(--lacquer)', color: '#fff', padding: '14px 24px', fontWeight: 700, borderRadius: '2px' }}>
                {isBn ? 'আপনার তথ্য' : 'Your details'}
              </button>
            )}
            {step === 4 && (
              <button type="button" onClick={() => { if (validate()) setStep(5); }} style={{ background: 'var(--lacquer)', color: '#fff', padding: '14px 24px', fontWeight: 700, borderRadius: '2px' }}>
                {isBn ? 'পেমেন্ট' : 'Payment'}
              </button>
            )}
            {step === 5 && (
              <button type="button" onClick={handleConfirm} disabled={placing} style={{ background: 'var(--lacquer)', color: '#fff', padding: '14px 24px', fontWeight: 700, borderRadius: '2px' }}>
                {placing ? (isBn ? 'সংরক্ষণ করা হচ্ছে...' : 'Reserving...') : (isBn ? 'বুকিং নিশ্চিত করুন' : 'Confirm booking')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
