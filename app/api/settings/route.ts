import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';
import { getSettings } from '@/lib/content';

export const dynamic = 'force-dynamic';

/** Phone numbers, address lines, social links and the rest of the one-liners. */
export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ success: true, settings });
}

/** Body is a flat `{ key: value }` map; every pair is upserted. */
export async function PATCH(req: Request) {
  if (!isAdmin()) {
    return NextResponse.json({ success: false, error: 'Not authorised' }, { status: 401 });
  }
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const entries = Object.entries(body).filter(([key]) => key && key.length < 64);
    await Promise.all(
      entries.map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          create: { key, value: String(value ?? '').slice(0, 500) },
          update: { value: String(value ?? '').slice(0, 500) },
        }),
      ),
    );
    return NextResponse.json({ success: true, updated: entries.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
