import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';
import { iso, nightsBetween } from '@/lib/format';

export const dynamic = 'force-dynamic';

/** Reservation list. Admin only: it contains guest contact details. */
export async function GET() {
  if (!isAdmin()) {
    return NextResponse.json({ success: false, error: 'Not authorised' }, { status: 401 });
  }
  try {
    const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

/** Create a reservation. Public: this is the booking panel's submit. */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ci = body.ci || iso(new Date());
    const co = body.co || iso(new Date());

    const booking = await prisma.booking.create({
      data: {
        id: body.id || `HV-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        name: String(body.name || 'Anonymous').slice(0, 120),
        mobile: String(body.mobile || 'N/A').slice(0, 40),
        email: body.email ? String(body.email).slice(0, 160) : null,
        room: String(body.room || 'Single Deluxe').slice(0, 120),
        roomCode: body.roomCode ? String(body.roomCode).slice(0, 20) : null,
        rate: Number(body.rate) || 0,
        nights: Number(body.nights) || Math.max(1, nightsBetween(ci, co)),
        adults: Number(body.adults) || 2,
        children: Number(body.children) || 0,
        nrooms: Number(body.nrooms) || 1,
        ci,
        co,
        status: String(body.status || 'Paid'),
        date: body.date || iso(new Date()),
        notes: body.notes ? String(body.notes).slice(0, 500) : null,
        arrival: body.arrival ? String(body.arrival).slice(0, 120) : null,
        addons: body.addons ? String(body.addons).slice(0, 200) : null,
        pay: body.pay ? String(body.pay).slice(0, 30) : 'bkash',
      },
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Failed to create booking:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
