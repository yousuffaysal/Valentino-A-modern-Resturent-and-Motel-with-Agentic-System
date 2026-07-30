import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MOCK_SEED_BOOKINGS } from '@/lib/data';

export async function GET() {
  try {
    let bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (bookings.length === 0) {
      // Seed initial mock bookings
      for (const b of MOCK_SEED_BOOKINGS) {
        await prisma.booking.create({
          data: {
            id: b.id,
            name: b.name,
            mobile: b.mobile,
            email: b.email,
            room: b.room,
            rate: b.rate,
            ci: b.ci,
            co: b.co,
            status: b.status,
            date: b.date,
          },
        });
      }
      bookings = await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    console.error('Failed to fetch bookings:', error);
    return NextResponse.json({ success: false, bookings: MOCK_SEED_BOOKINGS, error: error.message });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, name, mobile, email, room, rate, ci, co, status, date, notes, arrival, pay } = body;

    const newBooking = await prisma.booking.create({
      data: {
        id: id || `HV-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        name: name || 'Anonymous Guest',
        mobile: mobile || 'N/A',
        email: email || 'N/A',
        room: room || 'Single Deluxe',
        rate: Number(rate) || 2500,
        ci: ci || new Date().toISOString().split('T')[0],
        co: co || new Date().toISOString().split('T')[0],
        status: status || 'Paid',
        date: date || new Date().toISOString().split('T')[0],
        notes: notes || '',
        arrival: arrival || '',
        pay: pay || 'bkash',
      },
    });

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error: any) {
    console.error('Failed to create booking:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
