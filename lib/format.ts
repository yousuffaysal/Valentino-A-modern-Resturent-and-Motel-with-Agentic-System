export const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];
export const MON3 = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
export const MON3_BN = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];
export const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** Local-date ISO key, `YYYY-MM-DD`, without timezone drift. */
export const iso = (d: Date) =>
  d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

export const parse = (s: string) => {
  const p = s.split('-');
  return new Date(+p[0], +p[1] - 1, +p[2]);
};

/** `21 AUG` / `২১ আগস্ট` */
export const fmt = (s: string | null | undefined, isBn = false) => {
  if (!s) return null;
  const d = parse(s);
  const months = isBn ? MON3_BN : MON3;
  return String(d.getDate()).padStart(2, '0') + ' ' + months[d.getMonth()];
};

export const money = (n: number) => Math.round(n).toLocaleString('en-US');

/** Stable 32-bit string hash, used for confirmation codes and fallback availability. */
export const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

export const nightsBetween = (ci?: string | null, co?: string | null) => {
  if (!ci || !co) return 0;
  return Math.round((parse(co).getTime() - parse(ci).getTime()) / 86400000);
};

export const today = () => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
};

export const VAT_RATE = 0.15;
