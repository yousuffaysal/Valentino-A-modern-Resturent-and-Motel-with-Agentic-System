'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { css } from '@/lib/css';
import { iso, money, nightsBetween, parse } from '@/lib/format';
import type { BookingRecord, GalleryItem, MenuItem, Room } from '@/lib/defaults';
import { Wordmark } from '@/components/chrome/Wordmark';
import { InvoiceModal } from '@/components/admin/InvoiceModal';

type Tab = 'dashboard' | 'bookings' | 'rooms' | 'menu' | 'gallery' | 'messages' | 'settings';

export interface AdminMessage {
  id: string;
  name: string;
  mobile: string;
  message: string;
  handled: boolean;
  createdAt: string;
}

export interface AdminReservation {
  id: string;
  name: string;
  mobile: string;
  date: string;
  time: string;
  party: number;
  code: string;
}

type AdminRoom = Room & { id: string };
type AdminMenuItem = MenuItem & { id: string };
type AdminGalleryItem = GalleryItem & { id: string };

const TABS: { key: Tab; label: string }[] = [
  { key: 'dashboard', label: 'DASHBOARD' },
  { key: 'bookings', label: 'BOOKINGS' },
  { key: 'rooms', label: 'ROOM MANAGEMENT' },
  { key: 'menu', label: 'SKY VIEW MENU' },
  { key: 'gallery', label: 'GALLERY' },
  { key: 'messages', label: 'MESSAGES' },
  { key: 'settings', label: 'SITE SETTINGS' },
];

const card = css('background:#fff;border:1px solid rgba(22,24,26,.12);padding:24px;border-radius:2px');
const statLabel = css('font-family:var(--fu);font-size:11px;letter-spacing:.15em;color:var(--slate)');
const statValue = css('font-family:var(--fu);font-size:1.8rem;font-weight:700;margin-top:12px;font-variant-numeric:tabular-nums');
const statNote = css('font-size:11px;color:#1F5C4A;margin-top:6px;display:block');
const gridRow = 'display:grid;grid-template-columns:90px 1.5fr 1.2fr 1.3fr 90px 110px 180px;gap:16px;';
const fieldLabel = css('font-family:var(--fu);font-size:10.5px;letter-spacing:.14em;color:var(--slate)');
const fieldInput = css('width:100%;border-bottom:1px solid rgba(22,24,26,.2);padding:6px 0;font-size:14px;background:transparent');
const smallBtn = css('padding:10px 16px;background:var(--ink);color:var(--limestone);font-family:var(--fu);font-size:11.5px;letter-spacing:.1em;border-radius:2px;font-weight:700');
const ghostBtn = css('padding:10px 16px;border:1px solid var(--ink);font-family:var(--fu);font-size:11.5px;letter-spacing:.1em;border-radius:2px;font-weight:700');

const statusStyle = (status: string) =>
  css(
    'font-family:var(--fu);font-size:10px;letter-spacing:.08em;padding:4px 8px;border-radius:2px;font-weight:700;' +
      (status === 'Paid'
        ? 'background:rgba(31,92,74,.1);color:#1F5C4A;'
        : status === 'Confirmed'
          ? 'background:rgba(169,138,85,.1);color:var(--brass);'
          : 'background:rgba(168,30,45,.1);color:var(--lacquer);'),
  );

export function AdminScreen({
  bookings: initialBookings,
  rooms: initialRooms,
  menu: initialMenu,
  gallery: initialGallery,
  messages: initialMessages,
  reservations,
  settings: initialSettings,
}: {
  bookings: BookingRecord[];
  rooms: AdminRoom[];
  menu: AdminMenuItem[];
  gallery: AdminGalleryItem[];
  messages: AdminMessage[];
  reservations: AdminReservation[];
  settings: Record<string, string>;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [bookings, setBookings] = useState(initialBookings);
  const [rooms, setRooms] = useState(initialRooms);
  const [menu, setMenu] = useState(initialMenu);
  const [gallery, setGallery] = useState(initialGallery);
  const [messages, setMessages] = useState(initialMessages);
  const [settings, setSettings] = useState(initialSettings);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flash = useCallback((text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  /* ---------- stats ---------- */
  const live = bookings.filter((b) => b.status !== 'Cancelled');
  const revenue = live.filter((b) => b.status === 'Paid').reduce((sum, b) => sum + b.rate, 0);
  const totalInventory = rooms.reduce((sum, r) => sum + (r.inventory || 0), 0) || 1;
  const todayIso = iso(new Date());
  const occupiedTonight = live
    .filter((b) => b.ci <= todayIso && b.co > todayIso)
    .reduce((sum, b) => sum + Math.max(1, (b as BookingRecord & { nrooms?: number }).nrooms ?? 1), 0);
  const occupancy = Math.min(100, Math.round((occupiedTonight / totalInventory) * 100));

  const weekBars = useMemo(() => {
    const names = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const counts = new Array(7).fill(0);
    live.forEach((b) => {
      const start = parse(b.ci);
      const nights = Math.max(1, nightsBetween(b.ci, b.co));
      for (let i = 0; i < nights; i++) {
        const d = new Date(start.getTime() + i * 86400000);
        counts[d.getDay()] += 1;
      }
    });
    const max = Math.max(1, ...counts);
    // Weeks read Monday first at the desk.
    return [1, 2, 3, 4, 5, 6, 0].map((dow) => ({
      label: names[dow],
      count: counts[dow],
      pct: Math.round((counts[dow] / max) * 100),
    }));
  }, [live]);

  /* ---------- mutations ---------- */
  const patchBooking = async (id: string, status: string) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setBookings((list) => list.map((b) => (b.id === id ? { ...b, status } : b)));
      flash(`${id} marked ${status.toLowerCase()}.`);
    } else flash('That did not save.');
  };

  const deleteBooking = async (id: string) => {
    const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setBookings((list) => list.filter((b) => b.id !== id));
      flash(`${id} cancelled and removed.`);
    } else flash('That did not save.');
  };

  const saveContent = async (model: string, payload: Record<string, unknown>, label: string) => {
    const res = await fetch(`/api/content/${model}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    flash(res.ok ? `${label} saved. The live site is updated.` : 'That did not save.');
    return res.ok;
  };

  const createContent = async (model: string, payload: Record<string, unknown>) => {
    const res = await fetch(`/api/content/${model}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) flash('Added.');
    else flash(data.error || 'That did not save.');
    return data.item;
  };

  const deleteContent = async (model: string, id: string) => {
    const res = await fetch(`/api/content/${model}?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    flash(res.ok ? 'Removed.' : 'That did not save.');
    return res.ok;
  };

  const saveSettings = async () => {
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    flash(res.ok ? 'Settings saved.' : 'That did not save.');
  };

  const logout = async () => {
    await fetch('/api/admin/session', { method: 'DELETE' });
    router.refresh();
  };

  const invoiceBooking = bookings.find((b) => b.id === invoiceId) || null;
  const invoiceRoom = invoiceBooking
    ? rooms.find((r) => r.code === invoiceBooking.roomCode) || rooms.find((r) => r.name === invoiceBooking.room)
    : null;

  return (
    <div data-screen-label="Admin Dashboard" style={css('display:flex;min-height:100vh;background:#F2F3F0;color:var(--ink)')}>
      <aside style={css('width:280px;background:var(--night);color:var(--limestone);display:flex;flex-direction:column;border-right:var(--bl);z-index:90;position:sticky;top:0;height:100vh')}>
        <div style={css('padding:32px 24px;border-bottom:1px solid rgba(233,234,229,.12);display:flex;flex-direction:column')}>
          <Wordmark size="20px" />
          <span style={css('font-family:var(--fu);font-size:10.5px;letter-spacing:.25em;color:var(--brass);margin-top:4px')}>
            ADMIN PORTAL
          </span>
        </div>

        <nav style={css('flex:1;padding:24px 16px;display:flex;flex-direction:column;gap:8px;overflow-y:auto')}>
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              style={css(
                'width:100%;text-align:left;padding:12px 16px;font-family:var(--fu);font-size:13px;letter-spacing:.08em;font-weight:600;border-radius:2px;display:flex;align-items:center;gap:12px;transition:background .2s;' +
                  (tab === t.key
                    ? 'background:rgba(233,234,229,.08);color:#fff;border-left:3px solid var(--lacquer)'
                    : 'color:rgba(233,234,229,.65)'),
              )}
              data-hover-style="background:rgba(233,234,229,.04);color:#fff"
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div style={css('padding:24px;border-top:1px solid rgba(233,234,229,.12);display:flex;flex-direction:column;gap:14px')}>
          <a
            href="/"
            style={css('font-family:var(--fu);font-size:11px;letter-spacing:.1em;color:var(--slate);display:flex;align-items:center;gap:8px')}
            data-hover-style="color:#fff"
          >
            ← BACK TO LIVE SITE
          </a>
          <button
            type="button"
            onClick={logout}
            style={css('font-family:var(--fu);font-size:11px;letter-spacing:.1em;color:var(--slate);text-align:left')}
            data-hover-style="color:#fff"
          >
            LOG OUT
          </button>
        </div>
      </aside>

      <main style={css('flex:1;padding:48px var(--gd);overflow-y:auto;max-height:100vh')}>
        <header style={css('display:flex;justify-content:space-between;align-items:center;margin-bottom:38px;gap:20px;flex-wrap:wrap')}>
          <div>
            <h1 style={css('font-size:1.85rem;font-weight:800;letter-spacing:-.02em;text-transform:capitalize')}>
              {TABS.find((t) => t.key === tab)?.label.toLowerCase()}
            </h1>
            <p style={css('font-size:.875rem;color:var(--slate);margin-top:4px')}>
              Manage and monitor Hotel Valentino&apos;s operations. Bookings count: {bookings.length}
            </p>
          </div>
          <div style={css('font-family:var(--fu);font-size:12.5px;letter-spacing:.1em;color:var(--slate);background:var(--mist);padding:8px 14px;border-radius:2px')}>
            OPERATIONAL STATUS: LIVE
          </div>
        </header>

        {tab === 'dashboard' && (
          <div>
            <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;margin-bottom:38px')}>
              <div style={card}>
                <span style={statLabel}>TOTAL REVENUE</span>
                <h3 style={statValue}>৳{money(revenue)}</h3>
                <span style={statNote}>Paid reservations in the system</span>
              </div>
              <div style={card}>
                <span style={statLabel}>OCCUPANCY TONIGHT</span>
                <h3 style={statValue}>{occupancy}%</h3>
                <span style={css('font-size:11px;color:var(--slate);margin-top:6px;display:block')}>
                  {occupiedTonight} of {totalInventory} rooms in house
                </span>
              </div>
              <div style={card}>
                <span style={statLabel}>ACTIVE BOOKINGS</span>
                <h3 style={statValue}>{live.length}</h3>
                <span style={css('font-size:11px;color:var(--slate);margin-top:6px;display:block')}>
                  Realtime reservation count
                </span>
              </div>
              <div style={card}>
                <span style={statLabel}>SKY VIEW TABLES</span>
                <h3 style={statValue}>{reservations.length}</h3>
                <span style={css('font-size:11px;color:var(--slate);margin-top:6px;display:block')}>
                  Rooftop reservations held
                </span>
              </div>
            </div>

            <div style={css('display:grid;grid-template-columns:2fr 1fr;gap:24px')} data-two-col="2fr 1fr">
              <div style={css('background:#fff;border:1px solid rgba(22,24,26,.12);padding:28px;border-radius:2px')}>
                <h3 style={css('font-size:1.1rem;font-weight:700;margin-bottom:24px')}>Room nights by weekday</h3>
                <div style={css('height:200px;display:flex;align-items:flex-end;gap:18px;padding-bottom:12px;border-bottom:1px solid rgba(22,24,26,.12)')}>
                  {weekBars.map((b) => (
                    <div
                      key={b.label}
                      style={css('flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end')}
                    >
                      <div
                        style={css(
                          'width:100%;height:' +
                            Math.max(4, b.pct) +
                            '%;background:' +
                            (b.pct >= 80 ? 'var(--lacquer)' : 'var(--slate)') +
                            ';border-radius:2px 2px 0 0;position:relative',
                        )}
                        data-hover-style="background:var(--lacquer)"
                      >
                        <span style={css('position:absolute;top:-24px;left:50%;transform:translateX(-50%);font-family:var(--fu);font-size:11px')}>
                          {b.count}
                        </span>
                      </div>
                      <span style={css('font-family:var(--fu);font-size:10px;margin-top:10px;color:var(--slate)')}>
                        {b.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={css('background:#fff;border:1px solid rgba(22,24,26,.12);padding:28px;border-radius:2px;display:flex;flex-direction:column;justify-content:space-between')}>
                <div>
                  <h3 style={css('font-size:1.1rem;font-weight:700;margin-bottom:14px')}>Quick actions</h3>
                  <p style={css('font-size:.8125rem;color:var(--slate);line-height:1.5')}>
                    Everything on this panel writes straight to the database, and the live site picks it up on the next
                    page load.
                  </p>
                </div>
                <div style={css('display:flex;flex-direction:column;gap:10px;margin-top:20px')}>
                  <button type="button" onClick={() => setTab('bookings')} style={css(smallBtnFull)} data-hover-style="background:var(--lacquer);color:#fff">
                    VIEW ALL BOOKINGS
                  </button>
                  <button type="button" onClick={() => setTab('rooms')} style={css(ghostBtnFull)} data-hover-style="background:var(--mist)">
                    MANAGE ROOM PRICES
                  </button>
                  <button type="button" onClick={() => setTab('settings')} style={css(ghostBtnFull)} data-hover-style="background:var(--mist)">
                    EDIT CONTACT DETAILS
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'bookings' && (
          <div style={css('background:#fff;border:1px solid rgba(22,24,26,.12);border-radius:2px;overflow-x:auto')}>
            <div style={css('min-width:980px')}>
              <div style={css(gridRow + 'padding:16px 24px;background:#F2F3F0;border-bottom:1px solid rgba(22,24,26,.12);font-family:var(--fu);font-size:11px;letter-spacing:.1em;color:var(--slate)')}>
                <div>ID</div>
                <div>GUEST</div>
                <div>ROOM</div>
                <div>DATES</div>
                <div>RATE</div>
                <div>STATUS</div>
                <div style={css('text-align:right')}>ACTIONS</div>
              </div>
              {bookings.map((b) => (
                <div
                  key={b.id}
                  style={css(gridRow + 'padding:18px 24px;border-bottom:1px solid rgba(22,24,26,.12);align-items:center;background:#fff;font-size:.875rem')}
                  data-hover-style="background:#fafafa"
                >
                  <div style={css('font-family:var(--fu);font-variant-numeric:tabular-nums;font-weight:700')}>{b.id}</div>
                  <div>
                    <div style={css('font-weight:700')}>{b.name}</div>
                    <div style={css('font-size:11px;color:var(--slate);margin-top:2px')}>{b.mobile}</div>
                  </div>
                  <div>{b.room}</div>
                  <div style={css('font-family:var(--fu);font-variant-numeric:tabular-nums;font-size:12.5px')}>
                    {b.ci} → {b.co}
                  </div>
                  <div style={css('font-family:var(--fu);font-variant-numeric:tabular-nums')}>৳{money(b.rate)}</div>
                  <div>
                    <span style={statusStyle(b.status)}>{b.status}</span>
                  </div>
                  <div style={css('text-align:right;white-space:nowrap')}>
                    <button
                      type="button"
                      onClick={() => setInvoiceId(b.id)}
                      style={css('font-size:12px;color:var(--brass);font-weight:700;margin-right:12px')}
                      data-hover-style="text-decoration:underline"
                    >
                      Invoice
                    </button>
                    {b.status !== 'Paid' && (
                      <button
                        type="button"
                        onClick={() => patchBooking(b.id, 'Paid')}
                        style={css('font-size:12px;color:#1F5C4A;font-weight:700;margin-right:12px')}
                        data-hover-style="text-decoration:underline"
                      >
                        Paid
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteBooking(b.id)}
                      style={css('font-size:12px;color:var(--lacquer);font-weight:700')}
                      data-hover-style="text-decoration:underline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
              {!bookings.length && (
                <p style={css('padding:32px 24px;color:var(--slate);font-size:.9rem')}>No reservations yet.</p>
              )}
            </div>
          </div>
        )}

        {tab === 'rooms' && (
          <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px')}>
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onSave={async (patch) => {
                  const ok = await saveContent('rooms', { id: room.id, ...patch }, room.name);
                  if (ok) setRooms((list) => list.map((r) => (r.id === room.id ? { ...r, ...patch } : r)));
                }}
              />
            ))}
          </div>
        )}

        {tab === 'menu' && (
          <MenuManager
            items={menu}
            onSave={async (item) => {
              const ok = await saveContent('menu', item, item.name as string);
              if (ok) setMenu((list) => list.map((m) => (m.id === item.id ? { ...m, ...(item as unknown as AdminMenuItem) } : m)));
            }}
            onCreate={async (item) => {
              const created = await createContent('menu', item);
              if (created) setMenu((list) => [...list, created]);
            }}
            onDelete={async (id) => {
              if (await deleteContent('menu', id)) setMenu((list) => list.filter((m) => m.id !== id));
            }}
          />
        )}

        {tab === 'gallery' && (
          <GalleryManager
            items={gallery}
            onSave={async (item) => {
              const ok = await saveContent('gallery', item, 'Photo');
              if (ok) setGallery((list) => list.map((g) => (g.id === item.id ? { ...g, ...(item as unknown as AdminGalleryItem) } : g)));
            }}
            onCreate={async (item) => {
              const created = await createContent('gallery', item);
              if (created) setGallery((list) => [...list, created]);
            }}
            onDelete={async (id) => {
              if (await deleteContent('gallery', id)) setGallery((list) => list.filter((g) => g.id !== id));
            }}
          />
        )}

        {tab === 'messages' && (
          <div style={css('display:flex;flex-direction:column;gap:14px')}>
            {messages.map((m) => (
              <div key={m.id} style={css('background:#fff;border:1px solid rgba(22,24,26,.12);padding:20px 24px;border-radius:2px')}>
                <div style={css('display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:baseline')}>
                  <div>
                    <strong>{m.name}</strong>
                    <span style={css('font-family:var(--fu);font-size:12px;color:var(--slate);margin-left:12px')}>
                      {m.mobile}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await fetch('/api/messages', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: m.id, handled: !m.handled }),
                      });
                      if (res.ok) {
                        setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, handled: !x.handled } : x)));
                      }
                    }}
                    style={statusStyle(m.handled ? 'Paid' : 'Pending')}
                  >
                    {m.handled ? 'HANDLED' : 'OPEN'}
                  </button>
                </div>
                <p style={css('font-size:.9rem;line-height:1.6;color:var(--slate);margin-top:12px')}>{m.message}</p>
              </div>
            ))}
            {!messages.length && <p style={css('color:var(--slate)')}>No messages from the contact form yet.</p>}

            <h2 style={css('font-size:1.1rem;font-weight:700;margin-top:24px')}>Sky View table reservations</h2>
            <div style={css('background:#fff;border:1px solid rgba(22,24,26,.12);border-radius:2px;overflow-x:auto')}>
              {reservations.map((r) => (
                <div
                  key={r.id}
                  style={css('display:grid;grid-template-columns:110px 1.4fr 1fr 90px 90px;gap:16px;padding:14px 20px;border-bottom:1px solid rgba(22,24,26,.08);font-size:.875rem;align-items:center;min-width:640px')}
                >
                  <span style={css('font-family:var(--fu);font-weight:700')}>{r.code}</span>
                  <span>
                    {r.name}
                    <span style={css('color:var(--slate);font-size:12px;margin-left:10px')}>{r.mobile}</span>
                  </span>
                  <span style={css('font-family:var(--fu);font-variant-numeric:tabular-nums')}>{r.date}</span>
                  <span style={css('font-family:var(--fu)')}>{r.time}</span>
                  <span style={css('font-family:var(--fu)')}>{r.party} pax</span>
                </div>
              ))}
              {!reservations.length && <p style={css('padding:20px;color:var(--slate)')}>No table reservations yet.</p>}
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div style={css('background:#fff;border:1px solid rgba(22,24,26,.12);padding:28px;border-radius:2px;max-width:760px')}>
            <p style={css('font-size:.875rem;color:var(--slate);line-height:1.6')}>
              These values feed the header, footer, contact page and the AI reception assistant.
            </p>
            <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-top:24px')}>
              {Object.entries(settings).map(([key, value]) => (
                <label key={key} style={css('display:block')}>
                  <span style={fieldLabel}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
                  <input
                    value={value}
                    onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                    style={fieldInput}
                  />
                </label>
              ))}
            </div>
            <button type="button" onClick={saveSettings} style={css('margin-top:28px;' + smallBtn0)}>
              SAVE SETTINGS
            </button>
          </div>
        )}

        {invoiceBooking && (
          <InvoiceModal
            booking={invoiceBooking}
            nightlyRate={invoiceRoom?.rate ?? Math.round(invoiceBooking.rate / 1.15)}
            onClose={() => setInvoiceId(null)}
          />
        )}

        {toast && (
          <div style={css('position:fixed;right:24px;bottom:24px;z-index:950;background:var(--ink);color:var(--limestone);padding:14px 20px;border-radius:2px;font-size:13.5px;box-shadow:0 20px 50px -24px rgba(0,0,0,.6)')}>
            {toast}
          </div>
        )}
      </main>
    </div>
  );
}

const smallBtn0 = 'padding:14px 20px;background:var(--ink);color:var(--limestone);font-family:var(--fu);font-size:12px;letter-spacing:.1em;border-radius:2px;font-weight:700';
const smallBtnFull = 'width:100%;padding:14px;background:var(--ink);color:var(--limestone);font-family:var(--fu);font-size:12px;letter-spacing:.1em;border-radius:2px;font-weight:700';
const ghostBtnFull = 'width:100%;padding:14px;border:1px solid var(--ink);color:var(--ink);font-family:var(--fu);font-size:12px;letter-spacing:.1em;border-radius:2px;font-weight:700';

function RoomCard({ room, onSave }: { room: AdminRoom; onSave: (patch: Partial<AdminRoom>) => Promise<void> }) {
  const [rate, setRate] = useState(room.rate);
  const [inventory, setInventory] = useState(room.inventory);
  const [active, setActive] = useState(room.active);
  const [busy, setBusy] = useState(false);

  const dirty = rate !== room.rate || inventory !== room.inventory || active !== room.active;

  return (
    <div style={css('background:#fff;border:1px solid rgba(22,24,26,.12);border-radius:2px;overflow:hidden;display:flex;flex-direction:column')}>
      <img src={room.img} alt="" style={css('width:100%;height:160px;object-fit:cover')} />
      <div style={css('padding:20px;flex:1;display:flex;flex-direction:column;justify-content:space-between')}>
        <div>
          <h3 style={css('font-size:1.05rem;font-weight:700')}>{room.name}</h3>
          <p style={css('font-size:12px;color:var(--slate);margin-top:4px')}>
            {room.code} · {room.config} · sleeps {room.sleeps}
          </p>
        </div>
        <div style={css('margin-top:20px;padding-top:14px;border-top:1px solid rgba(22,24,26,.12)')}>
          <span style={fieldLabel}>CURRENT BASE RATE</span>
          <div style={css('display:flex;align-items:center;gap:10px;margin-top:8px')}>
            <span style={css('font-family:var(--fu);font-size:15px;color:var(--slate)')}>৳</span>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value) || 0)}
              style={css('font-family:var(--fu);font-size:1.15rem;font-weight:700;width:110px;border-bottom:1px solid var(--slate);padding:2px 0')}
            />
            <span style={css('font-size:11px;color:var(--slate)')}>/ night</span>
          </div>

          <div style={css('display:flex;align-items:center;gap:18px;margin-top:16px;flex-wrap:wrap')}>
            <label style={css('display:flex;align-items:center;gap:8px')}>
              <span style={fieldLabel}>ROOMS IN CATEGORY</span>
              <input
                type="number"
                value={inventory}
                onChange={(e) => setInventory(Number(e.target.value) || 0)}
                style={css('font-family:var(--fu);font-size:14px;width:56px;border-bottom:1px solid var(--slate);padding:2px 0')}
              />
            </label>
            <label style={css('display:flex;align-items:center;gap:8px;font-size:12px;color:var(--slate)')}>
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
              Bookable
            </label>
          </div>

          <button
            type="button"
            disabled={!dirty || busy}
            onClick={async () => {
              setBusy(true);
              await onSave({ rate, inventory, active });
              setBusy(false);
            }}
            style={css(
              'margin-top:18px;width:100%;padding:12px;border-radius:2px;font-family:var(--fu);font-size:11.5px;letter-spacing:.1em;font-weight:700;' +
                (dirty ? 'background:var(--lacquer);color:#fff;' : 'background:var(--mist);color:var(--slate);'),
            )}
          >
            {busy ? 'SAVING…' : dirty ? 'SAVE CHANGES' : 'SAVED'}
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuManager({
  items,
  onSave,
  onCreate,
  onDelete,
}: {
  items: AdminMenuItem[];
  onSave: (item: Record<string, unknown>) => Promise<void>;
  onCreate: (item: Record<string, unknown>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState({ cat: 'Appetizers', name: '', price: 0, desc: '' });

  return (
    <div>
      <div style={css('background:#fff;border:1px solid rgba(22,24,26,.12);padding:24px;border-radius:2px;margin-bottom:24px')}>
        <h3 style={css('font-size:1rem;font-weight:700')}>Add a dish</h3>
        <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-top:16px;align-items:end')}>
          <label>
            <span style={fieldLabel}>CATEGORY</span>
            <input value={draft.cat} onChange={(e) => setDraft({ ...draft, cat: e.target.value })} style={fieldInput} />
          </label>
          <label>
            <span style={fieldLabel}>NAME</span>
            <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} style={fieldInput} />
          </label>
          <label>
            <span style={fieldLabel}>PRICE</span>
            <input
              type="number"
              value={draft.price}
              onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) || 0 })}
              style={fieldInput}
            />
          </label>
          <label>
            <span style={fieldLabel}>DESCRIPTION</span>
            <input value={draft.desc} onChange={(e) => setDraft({ ...draft, desc: e.target.value })} style={fieldInput} />
          </label>
          <button
            type="button"
            onClick={async () => {
              if (!draft.name) return;
              await onCreate({ ...draft, active: true, sort: items.length + 1 });
              setDraft({ cat: draft.cat, name: '', price: 0, desc: '' });
            }}
            style={smallBtn}
          >
            ADD DISH
          </button>
        </div>
      </div>

      <div style={css('display:flex;flex-direction:column;gap:10px')}>
        {items.map((item) => (
          <EditableRow
            key={item.id}
            fields={[
              { key: 'cat', label: 'CATEGORY', width: '160px' },
              { key: 'name', label: 'NAME', width: '1fr' },
              { key: 'price', label: 'PRICE', width: '110px', numeric: true },
              { key: 'desc', label: 'DESCRIPTION', width: '2fr' },
            ]}
            record={item as unknown as Record<string, string | number>}
            onSave={(patch) => onSave({ id: item.id, ...patch })}
            onDelete={() => onDelete(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

function GalleryManager({
  items,
  onSave,
  onCreate,
  onDelete,
}: {
  items: AdminGalleryItem[];
  onSave: (item: Record<string, unknown>) => Promise<void>;
  onCreate: (item: Record<string, unknown>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState({ src: '/img/', cat: 'Building', alt: '' });

  return (
    <div>
      <div style={css('background:#fff;border:1px solid rgba(22,24,26,.12);padding:24px;border-radius:2px;margin-bottom:24px')}>
        <h3 style={css('font-size:1rem;font-weight:700')}>Add a photograph</h3>
        <p style={css('font-size:.8125rem;color:var(--slate);margin-top:6px;line-height:1.6')}>
          Drop the file into <code>public/img</code> or <code>public/uploads</code>, then reference it here, for example{' '}
          <code>/img/lobby-reception.png</code>.
        </p>
        <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-top:16px;align-items:end')}>
          <label>
            <span style={fieldLabel}>IMAGE PATH</span>
            <input value={draft.src} onChange={(e) => setDraft({ ...draft, src: e.target.value })} style={fieldInput} />
          </label>
          <label>
            <span style={fieldLabel}>CATEGORY</span>
            <input value={draft.cat} onChange={(e) => setDraft({ ...draft, cat: e.target.value })} style={fieldInput} />
          </label>
          <label>
            <span style={fieldLabel}>ALT TEXT</span>
            <input value={draft.alt} onChange={(e) => setDraft({ ...draft, alt: e.target.value })} style={fieldInput} />
          </label>
          <button
            type="button"
            onClick={async () => {
              if (!draft.src || !draft.alt) return;
              await onCreate({ ...draft, active: true, sort: items.length + 1 });
              setDraft({ src: '/img/', cat: draft.cat, alt: '' });
            }}
            style={smallBtn}
          >
            ADD PHOTO
          </button>
        </div>
      </div>

      <div style={css('display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px')}>
        {items.map((g) => (
          <div key={g.id} style={css('background:#fff;border:1px solid rgba(22,24,26,.12);border-radius:2px;overflow:hidden')}>
            <img src={g.src} alt={g.alt} style={css('width:100%;height:150px;object-fit:cover')} />
            <div style={css('padding:16px')}>
              <EditableRow
                compact
                fields={[
                  { key: 'cat', label: 'CATEGORY', width: '1fr' },
                  { key: 'alt', label: 'ALT TEXT', width: '1fr' },
                ]}
                record={g as unknown as Record<string, string | number>}
                onSave={(patch) => onSave({ id: g.id, ...patch })}
                onDelete={() => onDelete(g.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditableRow({
  fields,
  record,
  onSave,
  onDelete,
  compact,
}: {
  fields: { key: string; label: string; width: string; numeric?: boolean }[];
  record: Record<string, string | number>;
  onSave: (patch: Record<string, unknown>) => Promise<void>;
  onDelete: () => Promise<void>;
  compact?: boolean;
}) {
  const [values, setValues] = useState(() => {
    const out: Record<string, string | number> = {};
    fields.forEach((f) => (out[f.key] = record[f.key]));
    return out;
  });
  const dirty = fields.some((f) => values[f.key] !== record[f.key]);

  return (
    <div
      style={css(
        (compact
          ? 'display:grid;grid-template-columns:1fr;gap:12px;'
          : 'background:#fff;border:1px solid rgba(22,24,26,.12);border-radius:2px;padding:16px 20px;display:grid;grid-template-columns:' +
            fields.map((f) => f.width).join(' ') +
            ' auto auto;gap:16px;align-items:end;') + '',
      )}
    >
      {fields.map((f) => (
        <label key={f.key}>
          <span style={fieldLabel}>{f.label}</span>
          <input
            type={f.numeric ? 'number' : 'text'}
            value={values[f.key] as string | number}
            onChange={(e) =>
              setValues((v) => ({ ...v, [f.key]: f.numeric ? Number(e.target.value) || 0 : e.target.value }))
            }
            style={fieldInput}
          />
        </label>
      ))}
      <button
        type="button"
        disabled={!dirty}
        onClick={() => onSave(values)}
        style={css(
          'padding:10px 14px;border-radius:2px;font-family:var(--fu);font-size:11px;letter-spacing:.1em;font-weight:700;' +
            (dirty ? 'background:var(--lacquer);color:#fff;' : 'background:var(--mist);color:var(--slate);'),
        )}
      >
        SAVE
      </button>
      <button
        type="button"
        onClick={onDelete}
        style={css('padding:10px 14px;border:1px solid rgba(168,30,45,.4);color:var(--lacquer);border-radius:2px;font-family:var(--fu);font-size:11px;letter-spacing:.1em;font-weight:700')}
      >
        DELETE
      </button>
    </div>
  );
}
