import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';
import { iso } from '@/lib/format';

export const dynamic = 'force-dynamic';

/** Sky View table bookings. Admin only. */
export async function GET() {
  if (!isAdmin()) {
    return NextResponse.json({ success: false, error: 'Not authorised' }, { status: 401 });
  }
  try {
    const reservations = await prisma.tableReservation.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, reservations });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

/** Hold a rooftop table. Public. */
export async function POST(req: Request) {
  try {
    const { name, mobile, date, time, party, code } = await req.json();
    const reservation = await prisma.tableReservation.create({
      data: {
        id: `TR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        name: String(name || 'Guest').slice(0, 120),
        mobile: String(mobile || 'N/A').slice(0, 40),
        date: date || iso(new Date()),
        time: String(time || '19:30'),
        party: Number(party) || 2,
        code: code || `SV-${Math.floor(1000 + Math.random() * 9000)}`,
      },
    });
    return NextResponse.json({ success: true, reservation });
  } catch (error) {
    console.error('Failed to create table reservation:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
