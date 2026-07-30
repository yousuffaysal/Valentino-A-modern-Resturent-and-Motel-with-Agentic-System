'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { InvoiceModal } from '@/components/InvoiceModal';
import { money } from '@/lib/data';

export default function AdminPage() {
  const { toggleLang, isBn } = useLanguage();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [activeInvoiceBooking, setActiveInvoiceBooking] = useState<any | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (e) {
      console.error('Failed to fetch admin bookings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Paid' ? 'Pending' : 'Paid';
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchBookings();
    } catch (e) {
      console.error('Failed to update booking status:', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete booking ${id}?`)) return;
    try {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      fetchBookings();
    } catch (e) {
      console.error('Failed to delete booking:', e);
    }
  };

  const handleAddRandomBooking = async () => {
    const names = ['Abrar Fahad', 'Shahriar Kabir', 'Nafisa Islam', 'Mehedi Hasan', 'Jubayer Ahmed'];
    const rooms = ['Single Deluxe', 'Couple Deluxe', 'VIP Suite', 'Honeymoon Suite', 'Deluxe Four Bed'];
    const rates = [2500, 4500, 10000, 8000, 10000];

    const idx = Math.floor(Math.random() * names.length);
    const code = `HV-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: code,
          name: names[idx],
          mobile: `017${Math.floor(10000000 + Math.random() * 90000000)}`,
          email: `${names[idx].toLowerCase().replace(/\s/g, '')}@example.com`,
          room: rooms[idx],
          rate: rates[idx],
          ci: '2026-08-15',
          co: '2026-08-18',
          status: 'Paid',
          date: new Date().toISOString().split('T')[0],
        }),
      });
      fetchBookings();
    } catch (e) {
      console.error('Failed to add random booking:', e);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.mobile.includes(search);
    const matchesFilter = filterStatus === 'ALL' || b.status.toUpperCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.rate || 0), 0);
  const paidCount = bookings.filter((b) => b.status === 'Paid').length;

  return (
    <div style={{ background: '#0E1114', color: '#E9EAE5', minHeight: '100vh', fontFamily: 'var(--fd)' }}>
      {/* Top Bar */}
      <div style={{ padding: '20px var(--gd)', borderBottom: '1px solid rgba(233,234,229,.14)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ color: 'var(--brass)', fontFamily: 'var(--fu)', fontSize: '13px', textDecoration: 'none' }}>
            ← FRONTEND HOME
          </Link>
          <span style={{ color: 'rgba(233,234,229,.3)' }}>|</span>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-.02em' }}>
            Hotel Valentino — Admin Dashboard
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button type="button" onClick={toggleLang} style={{ fontFamily: 'var(--fu)', fontSize: '12.5px', border: '1px solid rgba(255,255,255,.3)', padding: '6px 12px', color: '#fff', borderRadius: '2px' }}>
            <span data-en="1">বাংলা</span>
            <span data-bn="1">EN</span>
          </button>
          <button type="button" onClick={handleAddRandomBooking} style={{ background: 'var(--lacquer)', color: '#fff', padding: '8px 16px', fontSize: '13px', fontWeight: 700, borderRadius: '2px' }}>
            + Add Test Booking
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(20px,4vw,40px) var(--gd)' }}>
        {/* STATS OVERVIEW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(233,234,229,.12)', padding: '24px', borderRadius: '4px' }}>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--brass)', letterSpacing: '.18em' }}>TOTAL REVENUE</p>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '2rem', fontWeight: 700, marginTop: '8px', color: '#fff' }}>৳{money(totalRevenue)}</p>
          </div>

          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(233,234,229,.12)', padding: '24px', borderRadius: '4px' }}>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--brass)', letterSpacing: '.18em' }}>TOTAL BOOKINGS</p>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '2rem', fontWeight: 700, marginTop: '8px', color: '#fff' }}>{bookings.length}</p>
          </div>

          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(233,234,229,.12)', padding: '24px', borderRadius: '4px' }}>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--brass)', letterSpacing: '.18em' }}>PAID BOOKINGS</p>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '2rem', fontWeight: 700, marginTop: '8px', color: '#fff' }}>{paidCount}</p>
          </div>

          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(233,234,229,.12)', padding: '24px', borderRadius: '4px' }}>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '12px', color: 'var(--brass)', letterSpacing: '.18em' }}>OCCUPANCY RATE</p>
            <p style={{ fontFamily: 'var(--fu)', fontSize: '2rem', fontWeight: 700, marginTop: '8px', color: '#fff' }}>
              {bookings.length > 0 ? `${Math.min(100, Math.round((bookings.length / 10) * 100))}%` : '0%'}
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['ALL', 'PAID', 'CONFIRMED', 'PENDING'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '2px',
                  fontFamily: 'var(--fu)',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: filterStatus === st ? 'var(--lacquer)' : 'rgba(255,255,255,.08)',
                  color: '#fff',
                }}
              >
                {st}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, guest name, phone..."
            style={{
              padding: '10px 16px',
              background: 'rgba(255,255,255,.08)',
              border: '1px solid rgba(233,234,229,.2)',
              color: '#fff',
              borderRadius: '2px',
              fontSize: '13.5px',
              width: '300px',
            }}
          />
        </div>

        {/* BOOKINGS GRID TABLE */}
        <div style={{ border: '1px solid rgba(233,234,229,.14)', background: 'rgba(255,255,255,.02)', borderRadius: '4px', overflowX: 'auto' }}>
          {/* Header Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '120px 180px 140px 160px 140px 110px 110px 180px', gap: '12px', padding: '16px 20px', background: 'rgba(255,255,255,.06)', borderBottom: '1px solid rgba(233,234,229,.14)', fontFamily: 'var(--fu)', fontSize: '11.5px', letterSpacing: '.14em', color: 'var(--brass)' }}>
            <div>CODE</div>
            <div>GUEST NAME</div>
            <div>MOBILE</div>
            <div>ROOM</div>
            <div>DATES</div>
            <div>AMOUNT</div>
            <div>STATUS</div>
            <div style={{ textAlign: 'right' }}>ACTIONS</div>
          </div>

          {/* Body Rows */}
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--slate)', fontFamily: 'var(--fu)' }}>
              Loading Neon Database records...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--slate)', fontFamily: 'var(--fu)' }}>
              No booking records found.
            </div>
          ) : (
            filtered.map((b) => (
              <div key={b.id} style={{ display: 'grid', gridTemplateColumns: '120px 180px 140px 160px 140px 110px 110px 180px', gap: '12px', padding: '16px 20px', borderBottom: '1px solid rgba(233,234,229,.08)', alignItems: 'center', fontSize: '13.5px' }}>
                <div style={{ fontFamily: 'var(--fu)', color: 'var(--lacquer)', fontWeight: 700 }}>{b.id}</div>
                <div style={{ fontWeight: 600 }}>{b.name}</div>
                <div style={{ fontFamily: 'var(--fu)', fontSize: '12.5px', color: 'rgba(233,234,229,.7)' }}>{b.mobile}</div>
                <div>{b.room}</div>
                <div style={{ fontFamily: 'var(--fu)', fontSize: '12px', color: 'rgba(233,234,229,.7)' }}>{b.ci} → {b.co}</div>
                <div style={{ fontFamily: 'var(--fu)', fontWeight: 700 }}>৳{money(b.rate)}</div>
                <div>
                  <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '2px', fontSize: '11px', fontWeight: 700, background: b.status === 'Paid' ? 'rgba(31,92,74,.4)' : 'rgba(169,138,85,.4)', color: b.status === 'Paid' ? '#4ECCA3' : '#F0D082' }}>
                    {b.status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => handleToggleStatus(b.id, b.status)} title="Toggle Status" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', padding: '6px 10px', fontSize: '11px', borderRadius: '2px' }}>
                    {b.status === 'Paid' ? 'Set Pending' : 'Set Paid'}
                  </button>
                  <button type="button" onClick={() => setActiveInvoiceBooking(b)} style={{ background: 'var(--lacquer)', color: '#fff', padding: '6px 10px', fontSize: '11px', fontWeight: 700, borderRadius: '2px' }}>
                    Invoice
                  </button>
                  <button type="button" onClick={() => handleDelete(b.id)} style={{ background: 'rgba(255,0,0,.2)', color: '#ff6b6b', padding: '6px 8px', fontSize: '11px', borderRadius: '2px' }}>
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* INVOICE MODAL */}
      {activeInvoiceBooking && (
        <InvoiceModal
          booking={activeInvoiceBooking}
          onClose={() => setActiveInvoiceBooking(null)}
        />
      )}
    </div>
  );
}
