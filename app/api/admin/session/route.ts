import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, adminToken, checkPassword, isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/** Current session state, used by the admin shell to decide what to render. */
export async function GET() {
  return NextResponse.json({ authenticated: isAdmin() });
}

/** Log in with the desk password. */
export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: '' }));
  if (!checkPassword(String(password ?? ''))) {
    return NextResponse.json({ success: false, error: 'Wrong password.' }, { status: 401 });
  }
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return res;
}

/** Log out. */
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
