import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import {
  ADDONS,
  ATTRACTIONS,
  FACILITIES,
  GALLERY,
  MENU,
  ROOMS,
  SERVICES,
  SETTINGS,
  type Addon,
  type Attraction,
  type Facility,
  type GalleryItem,
  type MenuItem,
  type Room,
  type Service,
} from '@/lib/defaults';

/**
 * Every content getter reads the database first and falls back to the design
 * defaults when the table is empty or the database is unreachable. That keeps
 * the site identical to the signed-off design out of the box, while letting the
 * admin panel take over any part of it once the row exists.
 */
async function withFallback<T>(load: () => Promise<T[]>, fallback: T[], label: string): Promise<T[]> {
  try {
    const rows = await load();
    if (rows.length) return rows;
    return fallback;
  } catch (error) {
    console.error(`[content] ${label} fell back to design defaults:`, (error as Error).message);
    return fallback;
  }
}

export const getRooms = cache(async (): Promise<Room[]> => {
  const rows = await withFallback(
    () => prisma.room.findMany({ where: { active: true }, orderBy: { sort: 'asc' } }),
    ROOMS,
    'rooms',
  );
  return rows.map((r) => ({
    code: r.code,
    slug: r.slug,
    name: r.name,
    nameBn: r.nameBn,
    config: r.config,
    configBn: r.configBn,
    sleeps: r.sleeps,
    rate: r.rate,
    img: r.img,
    alt: r.alt,
    blurb: r.blurb,
    blurbBn: r.blurbBn,
    inventory: r.inventory ?? 4,
    active: r.active ?? true,
    sort: r.sort ?? 0,
  }));
});

export const getAllRooms = cache(async (): Promise<Room[]> => {
  const rows = await withFallback(
    () => prisma.room.findMany({ orderBy: { sort: 'asc' } }),
    ROOMS,
    'rooms (all)',
  );
  return rows as Room[];
});

export const getMenu = cache(async (): Promise<MenuItem[]> => {
  const rows = await withFallback(
    () => prisma.menuItem.findMany({ where: { active: true }, orderBy: { sort: 'asc' } }),
    MENU,
    'menu',
  );
  return rows.map((m) => ({ id: (m as MenuItem).id, cat: m.cat, name: m.name, price: m.price, desc: m.desc, sort: m.sort }));
});

export const getGallery = cache(async (): Promise<GalleryItem[]> => {
  const rows = await withFallback(
    () => prisma.galleryImage.findMany({ where: { active: true }, orderBy: { sort: 'asc' } }),
    GALLERY,
    'gallery',
  );
  return rows.map((g) => ({ id: (g as GalleryItem).id, src: g.src, cat: g.cat, alt: g.alt, sort: g.sort }));
});

export const getFacilities = cache(async (): Promise<Facility[]> => {
  const rows = await withFallback(
    () => prisma.facility.findMany({ where: { active: true }, orderBy: { sort: 'asc' } }),
    FACILITIES,
    'facilities',
  );
  return rows.map((f) => ({ id: (f as Facility).id, en: f.en, bn: f.bn, copy: f.copy, sort: f.sort }));
});

export const getServices = cache(async (): Promise<Service[]> => {
  const rows = await withFallback(
    () => prisma.service.findMany({ where: { active: true }, orderBy: { sort: 'asc' } }),
    SERVICES,
    'services',
  );
  return rows.map((s) => ({ id: (s as Service).id, num: s.num, en: s.en, bn: s.bn, copy: s.copy, img: s.img, sort: s.sort }));
});

export const getAttractions = cache(async (): Promise<Attraction[]> => {
  const rows = await withFallback(
    () => prisma.attraction.findMany({ where: { active: true }, orderBy: { sort: 'asc' } }),
    ATTRACTIONS,
    'attractions',
  );
  return rows.map((a) => ({ id: (a as Attraction).id, slug: a.slug, name: a.name, dist: a.dist, ph: a.ph, line: a.line, img: a.img, sort: a.sort }));
});

export const getAddons = cache(async (): Promise<Addon[]> => {
  const rows = await withFallback(
    () => prisma.addon.findMany({ where: { active: true }, orderBy: { sort: 'asc' } }),
    ADDONS,
    'addons',
  );
  return rows.map((a) => ({ id: a.id, label: a.label, labelBn: a.labelBn, price: a.price, unit: a.unit, unitBn: a.unitBn, sort: a.sort }));
});

export type Settings = typeof SETTINGS;

export const getSettings = cache(async (): Promise<Settings> => {
  try {
    const rows = await prisma.setting.findMany();
    const merged = { ...SETTINGS };
    for (const row of rows) merged[row.key] = row.value;
    return merged;
  } catch (error) {
    console.error('[content] settings fell back to design defaults:', (error as Error).message);
    return { ...SETTINGS };
  }
});

/** Everything the shared site chrome and the booking panel need in one call. */
export const getSiteData = cache(async () => {
  const [rooms, addons, settings] = await Promise.all([getRooms(), getAddons(), getSettings()]);
  return { rooms, addons, settings };
});
