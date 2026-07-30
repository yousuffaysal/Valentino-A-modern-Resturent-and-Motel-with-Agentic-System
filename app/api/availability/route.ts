import { NextResponse } from 'next/server';
import { getAvailability } from '@/lib/availability';

export const dynamic = 'force-dynamic';

/** Rooms free for a stay: `/api/availability?ci=2026-08-21&co=2026-08-23&guests=2`. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ci = searchParams.get('ci');
  const co = searchParams.get('co');
  const guests = Number(searchParams.get('guests') || 0);

  const rooms = await getAvailability(ci, co, Number.isFinite(guests) ? guests : 0);
  return NextResponse.json({ success: true, rooms });
}
