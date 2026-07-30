import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * One endpoint for every editable content collection, so the admin panel can
 * manage rooms, menu, gallery, facilities, services, attractions and add-ons
 * without a bespoke route each. Reads are public, writes need the admin cookie.
 *
 *   GET    /api/content/rooms
 *   POST   /api/content/menu          { cat, name, price, desc }
 *   PATCH  /api/content/rooms         { id, rate: 2800 }
 *   DELETE /api/content/gallery?id=…
 */

type FieldType = 'string' | 'int' | 'bool';

interface ModelDef {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delegate: any;
  fields: Record<string, FieldType>;
  /** Client supplies the primary key (add-ons use a slug id). */
  clientId?: boolean;
  orderBy?: Record<string, 'asc' | 'desc'>;
}

const MODELS: Record<string, ModelDef> = {
  rooms: {
    delegate: prisma.room,
    fields: {
      code: 'string', slug: 'string', name: 'string', nameBn: 'string', config: 'string', configBn: 'string',
      sleeps: 'int', rate: 'int', img: 'string', alt: 'string', blurb: 'string', blurbBn: 'string',
      inventory: 'int', active: 'bool', sort: 'int',
    },
    orderBy: { sort: 'asc' },
  },
  menu: {
    delegate: prisma.menuItem,
    fields: { cat: 'string', name: 'string', price: 'int', desc: 'string', active: 'bool', sort: 'int' },
    orderBy: { sort: 'asc' },
  },
  gallery: {
    delegate: prisma.galleryImage,
    fields: { src: 'string', cat: 'string', alt: 'string', active: 'bool', sort: 'int' },
    orderBy: { sort: 'asc' },
  },
  facilities: {
    delegate: prisma.facility,
    fields: { en: 'string', bn: 'string', copy: 'string', active: 'bool', sort: 'int' },
    orderBy: { sort: 'asc' },
  },
  services: {
    delegate: prisma.service,
    fields: { num: 'string', en: 'string', bn: 'string', copy: 'string', img: 'string', active: 'bool', sort: 'int' },
    orderBy: { sort: 'asc' },
  },
  attractions: {
    delegate: prisma.attraction,
    fields: { slug: 'string', name: 'string', dist: 'string', ph: 'string', line: 'string', img: 'string', active: 'bool', sort: 'int' },
    orderBy: { sort: 'asc' },
  },
  addons: {
    delegate: prisma.addon,
    fields: { id: 'string', label: 'string', labelBn: 'string', price: 'int', unit: 'string', unitBn: 'string', active: 'bool', sort: 'int' },
    clientId: true,
    orderBy: { sort: 'asc' },
  },
};

const notAuthorised = () => NextResponse.json({ success: false, error: 'Not authorised' }, { status: 401 });
const unknownModel = () => NextResponse.json({ success: false, error: 'Unknown collection' }, { status: 404 });

function coerce(def: ModelDef, body: Record<string, unknown>, { requireAll }: { requireAll: boolean }) {
  const data: Record<string, unknown> = {};
  for (const [field, type] of Object.entries(def.fields)) {
    if (!(field in body)) {
      if (requireAll && !['active', 'sort', 'inventory'].includes(field)) continue;
      continue;
    }
    const raw = body[field];
    if (type === 'int') data[field] = Number(raw) || 0;
    else if (type === 'bool') data[field] = !!raw;
    else data[field] = String(raw ?? '').slice(0, 2000);
  }
  return data;
}

export async function GET(_req: Request, { params }: { params: { model: string } }) {
  const def = MODELS[params.model];
  if (!def) return unknownModel();
  try {
    const items = await def.delegate.findMany({ orderBy: def.orderBy });
    return NextResponse.json({ success: true, items });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { model: string } }) {
  const def = MODELS[params.model];
  if (!def) return unknownModel();
  if (!isAdmin()) return notAuthorised();
  try {
    const body = await req.json();
    const data = coerce(def, body, { requireAll: true });
    const item = await def.delegate.create({ data });
    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function PATCH(req: Request, { params }: { params: { model: string } }) {
  const def = MODELS[params.model];
  if (!def) return unknownModel();
  if (!isAdmin()) return notAuthorised();
  try {
    const body = await req.json();
    const id = String(body.id ?? '');
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    const data = coerce(def, body, { requireAll: false });
    delete data.id;
    const item = await def.delegate.update({ where: { id }, data });
    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { model: string } }) {
  const def = MODELS[params.model];
  if (!def) return unknownModel();
  if (!isAdmin()) return notAuthorised();
  try {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    await def.delegate.delete({ where: { id } });
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
