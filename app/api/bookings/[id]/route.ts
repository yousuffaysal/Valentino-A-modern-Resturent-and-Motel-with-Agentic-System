import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const guard = () =>
  isAdmin() ? null : NextResponse.json({ success: false, error: 'Not authorised' }, { status: 401 });

/** Mark paid, confirmed or cancelled from the admin bookings table. */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const denied = guard();
  if (denied) return denied;
  try {
    const { status } = await req.json();
    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: { status: String(status || 'Paid') },
    });
    return NextResponse.json({ success: true, booking });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const denied = guard();
  if (denied) return denied;
  try {
    await prisma.booking.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, id: params.id });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
