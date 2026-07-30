/**
 * Loads the design defaults into the database. Safe to re-run: content rows are
 * upserted on their natural key, bookings are only inserted when the table is
 * empty so demo data never overwrites real reservations.
 */
import { PrismaClient } from '@prisma/client';
import {
  ADDONS,
  ATTRACTIONS,
  FACILITIES,
  GALLERY,
  MENU,
  ROOMS,
  SEED_BOOKINGS,
  SERVICES,
  SETTINGS,
} from '../lib/defaults';

const prisma = new PrismaClient();

async function main() {
  for (const room of ROOMS) {
    await prisma.room.upsert({ where: { code: room.code }, create: room, update: room });
  }
  console.log(`rooms: ${ROOMS.length}`);

  if ((await prisma.menuItem.count()) === 0) {
    await prisma.menuItem.createMany({ data: MENU.map(({ id, ...m }) => m) });
  }
  console.log(`menu: ${await prisma.menuItem.count()}`);

  if ((await prisma.galleryImage.count()) === 0) {
    await prisma.galleryImage.createMany({ data: GALLERY.map(({ id, ...g }) => g) });
  }
  console.log(`gallery: ${await prisma.galleryImage.count()}`);

  if ((await prisma.facility.count()) === 0) {
    await prisma.facility.createMany({ data: FACILITIES.map(({ id, ...f }) => f) });
  }
  console.log(`facilities: ${await prisma.facility.count()}`);

  if ((await prisma.service.count()) === 0) {
    await prisma.service.createMany({ data: SERVICES.map(({ id, ...s }) => s) });
  }
  console.log(`services: ${await prisma.service.count()}`);

  for (const attraction of ATTRACTIONS) {
    const { id, ...data } = attraction;
    await prisma.attraction.upsert({ where: { slug: attraction.slug }, create: data, update: data });
  }
  console.log(`attractions: ${ATTRACTIONS.length}`);

  for (const addon of ADDONS) {
    await prisma.addon.upsert({ where: { id: addon.id }, create: addon, update: addon });
  }
  console.log(`addons: ${ADDONS.length}`);

  for (const [key, value] of Object.entries(SETTINGS)) {
    await prisma.setting.upsert({ where: { key }, create: { key, value }, update: {} });
  }
  console.log(`settings: ${Object.keys(SETTINGS).length}`);

  if ((await prisma.booking.count()) === 0) {
    for (const b of SEED_BOOKINGS) {
      const nights = Math.max(
        1,
        Math.round((new Date(b.co).getTime() - new Date(b.ci).getTime()) / 86400000),
      );
      await prisma.booking.create({ data: { ...b, nights } });
    }
    console.log(`bookings: ${SEED_BOOKINGS.length} demo rows inserted`);
  } else {
    console.log(`bookings: ${await prisma.booking.count()} existing rows left untouched`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
