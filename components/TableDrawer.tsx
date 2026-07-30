'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface TableDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableDrawer: React.FC<TableDrawerProps> = ({ isOpen, onClose }) => {
  const { isBn } = useLanguage();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('19:30');
  const [party, setParty] = useState(2);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [code, setCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirmTable = async () => {
    if (!name.trim()) return;
    const resCode = `SV-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile, date, time, party, code: resCode }),
      });
      setCode(resCode);
      setStep(3);
    } catch (e) {
      console.error('Failed to post table reservation:', e);
      setCode(resCode);
      setStep(3);
    }
  };

  return (
    <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', justifyContent: 'flex-end' }}>
      <button type="button" onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(14,17,20,.62)', backdropFilter: 'blur(3px)', cursor: 'default' }}></button>

      <div style={{ position: 'relative', background: 'var(--limestone)', width: '100%', maxWidth: '520px', height: '100%', overflowY: 'auto', padding: 'clamp(22px,4vw,34px)', boxShadow: '-30px 0 80px -40px rgba(0,0,0,.6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontFamily: 'var(--fu)', fontSize: '12.5px', color: 'var(--slate)' }}>SKY VIEW · TABLE</p>
          <button type="button" onClick={onClose} style={{ fontFamily: 'var(--fu)', fontSize: '12.5px', color: 'var(--slate)', minHeight: '44px' }}>CLOSE ✕</button>
        </div>

        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '20px' }}>
              <span data-en="1">Reserve a table on the roof</span>
              <span data-bn="1">ছাদে টেবিল রিজার্ভ করুন</span>
            </h2>

            <p style={{ fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--slate)', marginTop: '24px' }}>DATE</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '10px' }}>
              {['Today', 'Tomorrow', 'Day after'].map((d) => (
                <button key={d} type="button" onClick={() => setDate(d)} style={{ padding: '12px', border: 'var(--bl)', borderRadius: '2px', background: date === d ? 'var(--ink)' : 'transparent', color: date === d ? '#fff' : 'var(--ink)' }}>{d}</button>
              ))}
            </div>

            <p style={{ fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--slate)', marginTop: '24px' }}>TIME</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '10px' }}>
              {['18:30', '19:30', '20:30'].map((t) => (
                <button key={t} type="button" onClick={() => setTime(t)} style={{ padding: '12px', border: 'var(--bl)', borderRadius: '2px', background: time === t ? 'var(--ink)' : 'transparent', color: time === t ? '#fff' : 'var(--ink)' }}>{t}</button>
              ))}
            </div>

            <p style={{ fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--slate)', marginTop: '24px' }}>PARTY SIZE</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '10px' }}>
              {[2, 4, 6, 8].map((p) => (
                <button key={p} type="button" onClick={() => setParty(p)} style={{ padding: '12px', border: 'var(--bl)', borderRadius: '2px', background: party === p ? 'var(--ink)' : 'transparent', color: party === p ? '#fff' : 'var(--ink)' }}>{p} Guests</button>
              ))}
            </div>

            <button type="button" onClick={() => setStep(2)} style={{ width: '100%', marginTop: '30px', background: 'var(--lacquer)', color: '#fff', padding: '16px', fontWeight: 700, borderRadius: '2px' }}>
              {isBn ? 'এগিয়ে যান' : 'Continue'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '20px' }}>
              <span data-en="1">Who is the table for</span>
              <span data-bn="1">কার জন্য টেবিল বুকিং</span>
            </h2>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '13px', color: 'var(--lacquer)', marginTop: '12px' }}>
              {date} · {time} · {party} GUESTS
            </p>

            <label style={{ display: 'block', marginTop: '24px' }}>
              <span style={{ display: 'block', fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--slate)' }}>NAME</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', borderBottom: 'var(--bl)', padding: '12px 0', fontSize: '15px' }} />
            </label>

            <label style={{ display: 'block', marginTop: '20px' }}>
              <span style={{ display: 'block', fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--slate)' }}>MOBILE</span>
              <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="01XXXXXXXXX" style={{ width: '100%', borderBottom: 'var(--bl)', padding: '12px 0', fontSize: '15px' }} />
            </label>

            <button type="button" onClick={handleConfirmTable} style={{ width: '100%', marginTop: '30px', background: 'var(--lacquer)', color: '#fff', padding: '16px', fontWeight: 700, borderRadius: '2px' }}>
              {isBn ? 'টেবিল কনফার্ম করুন' : 'Confirm table'}
            </button>
          </div>
        )}

        {step === 3 && code && (
          <div>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '12.5px', color: 'var(--brass)', marginTop: '20px' }}>TABLE HELD</p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '14px' }}>
              See you on the roof, {name}.
            </h2>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '2rem', color: 'var(--lacquer)', marginTop: '22px' }}>{code}</p>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '12.5px', color: 'var(--slate)', marginTop: '14px' }}>{date} · {time} · {party} GUESTS</p>
            <button type="button" onClick={onClose} style={{ width: '100%', marginTop: '30px', background: 'var(--ink)', color: '#fff', padding: '16px', fontWeight: 700, borderRadius: '2px' }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
