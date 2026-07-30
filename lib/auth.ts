import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'hv_admin';
const DEFAULT_PASSWORD = 'valentino';

/** Token stored in the cookie: a hash of the current password, never the password. */
export function adminToken(): string {
  const password = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
  return createHash('sha256').update('hv:' + password).digest('hex');
}

export function checkPassword(candidate: string): boolean {
  const expected = Buffer.from(process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD);
  const given = Buffer.from(candidate ?? '');
  if (expected.length !== given.length) return false;
  return timingSafeEqual(expected, given);
}

/** True when the caller holds a valid admin session cookie. */
export function isAdmin(): boolean {
  const value = cookies().get(ADMIN_COOKIE)?.value;
  return !!value && value === adminToken();
}

/*
 * Drives the login hint, which names the fallback password out loud. That is a
 * useful nudge on a dev machine and a handout to anyone who opens /admin on a
 * deployment, so it is limited to non-production builds. Production still falls
 * back to DEFAULT_PASSWORD when ADMIN_PASSWORD is unset — it just stops
 * advertising it, and logs a warning to the server instead.
 */
export function usingDefaultPassword(): boolean {
  if (process.env.ADMIN_PASSWORD) return false;
  if (process.env.NODE_ENV === 'production') {
    console.warn('[auth] ADMIN_PASSWORD is not set — /admin is accepting the built-in default password.');
    return false;
  }
  return true;
}
