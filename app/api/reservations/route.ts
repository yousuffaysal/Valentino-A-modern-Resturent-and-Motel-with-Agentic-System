import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, mobile, date, time, party, code } = await req.json();

    const reservation = await prisma.tableReservation.create({
      data: {
        id: `TR-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        name: name || 'Guest',
        mobile: mobile || 'N/A',
        date: date || new Date().toISOString().split('T')[0],
        time: time || '19:30',
        party: Number(party) || 2,
        code: code || `SV-${Math.floor(1000 + Math.random() * 9000)}`,
      },
    });

    return NextResponse.json({ success: true, reservation });
  } catch (error: any) {
    console.error('Failed to create table reservation:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
