import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/** Contact form messages. Admin only. */
export async function GET() {
  if (!isAdmin()) {
    return NextResponse.json({ success: false, error: 'Not authorised' }, { status: 401 });
  }
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

/** Send reception a message. Public. */
export async function POST(req: Request) {
  try {
    const { name, mobile, message } = await req.json();
    if (!name || !mobile || !message) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }
    const created = await prisma.contactMessage.create({
      data: {
        name: String(name).slice(0, 120),
        mobile: String(mobile).slice(0, 40),
        message: String(message).slice(0, 2000),
      },
    });
    return NextResponse.json({ success: true, id: created.id });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

/** Mark a message handled. Admin only. */
export async function PATCH(req: Request) {
  if (!isAdmin()) {
    return NextResponse.json({ success: false, error: 'Not authorised' }, { status: 401 });
  }
  try {
    const { id, handled } = await req.json();
    const updated = await prisma.contactMessage.update({
      where: { id: String(id) },
      data: { handled: !!handled },
    });
    return NextResponse.json({ success: true, message: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
