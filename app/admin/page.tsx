import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { isAdmin, usingDefaultPassword } from '@/lib/auth';
import { getSettings } from '@/lib/content';
import { ROOMS, MENU, GALLERY, SEED_BOOKINGS } from '@/lib/defaults';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminScreen } from '@/components/admin/AdminScreen';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin portal · Hotel Valentino',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!isAdmin()) {
    return <AdminLogin defaultPassword={usingDefaultPassword()} />;
  }

  const settings = await getSettings();

  // A database hiccup should still show the portal, just with the seed content.
  let bookings, rooms, menu, gallery, messages, reservations;
  try {
    [bookings, rooms, menu, gallery, messages, reservations] = await Promise.all([
      prisma.booking.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.room.findMany({ orderBy: { sort: 'asc' } }),
      prisma.menuItem.findMany({ orderBy: { sort: 'asc' } }),
      prisma.galleryImage.findMany({ orderBy: { sort: 'asc' } }),
      prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
      prisma.tableReservation.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
    ]);
  } catch (error) {
    console.error('[admin] database unavailable:', (error as Error).message);
    bookings = SEED_BOOKINGS;
    rooms = ROOMS.map((r, i) => ({ ...r, id: 'seed-' + i }));
    menu = MENU.map((m, i) => ({ ...m, id: 'seed-' + i }));
    gallery = GALLERY.map((g, i) => ({ ...g, id: 'seed-' + i }));
    messages = [];
    reservations = [];
  }

  return (
    <AdminScreen
      bookings={bookings.map((b) => ({
        id: b.id,
        name: b.name,
        mobile: b.mobile,
        email: b.email ?? null,
        room: b.room,
        roomCode: 'roomCode' in b ? (b.roomCode as string | null) : null,
        rate: b.rate,
        nrooms: 'nrooms' in b ? (b.nrooms as number) : 1,
        ci: b.ci,
        co: b.co,
        status: b.status,
        date: b.date,
      }))}
      rooms={rooms as never}
      menu={menu as never}
      gallery={gallery as never}
      messages={messages.map((m) => ({
        id: m.id,
        name: m.name,
        mobile: m.mobile,
        message: m.message,
        handled: m.handled,
        createdAt: String(m.createdAt),
      }))}
      reservations={reservations.map((r) => ({
        id: r.id,
        name: r.name,
        mobile: r.mobile,
        date: r.date,
        time: r.time,
        party: r.party,
        code: r.code,
      }))}
      settings={settings}
    />
  );
}
