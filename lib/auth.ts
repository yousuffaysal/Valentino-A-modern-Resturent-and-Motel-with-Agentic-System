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

export function usingDefaultPassword(): boolean {
  return !process.env.ADMIN_PASSWORD;
}
