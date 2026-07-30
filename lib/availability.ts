import { prisma } from '@/lib/prisma';
import { getRooms } from '@/lib/content';
import { hash } from '@/lib/format';
import type { Room } from '@/lib/defaults';

export interface RoomAvailability extends Room {
  /** Rooms of this category still free for the requested stay. */
  left: number;
  out: boolean;
}

const CANCELLED = ['Cancelled', 'cancelled', 'Rejected'];

/**
 * Real availability: category inventory minus the reservations that overlap the
 * requested stay. Two stays overlap when `ci < otherCo` and `co > otherCi`, so a
 * checkout and a check-in on the same day do not collide.
 *
 * When the database cannot be reached we fall back to the deterministic pseudo
 * availability the design prototype used, so the panel still behaves sensibly.
 */
export async function getAvailability(
  ci: string | null,
  co: string | null,
  guests = 0,
): Promise<RoomAvailability[]> {
  const rooms = await getRooms();
  const eligible = rooms.filter((r) => r.sleeps >= guests || guests <= 1);

  if (!ci || !co) {
    return eligible.map((r) => ({ ...r, left: r.inventory, out: false }));
  }

  try {
    const overlapping = await prisma.booking.findMany({
      where: {
        status: { notIn: CANCELLED },
        ci: { lt: co },
        co: { gt: ci },
      },
      select: { roomCode: true, room: true, nrooms: true },
    });

    const taken = new Map<string, number>();
    for (const b of overlapping) {
      const code = b.roomCode ?? rooms.find((r) => r.name === b.room)?.code;
      if (!code) continue;
      taken.set(code, (taken.get(code) ?? 0) + Math.max(1, b.nrooms ?? 1));
    }

    return eligible.map((r) => {
      const left = Math.max(0, r.inventory - (taken.get(r.code) ?? 0));
      return { ...r, left, out: left === 0 };
    });
  } catch (error) {
    console.error('[availability] falling back to prototype availability:', (error as Error).message);
    return eligible.map((r) => {
      const h = hash(r.code + ci);
      const left = h % 11 === 0 ? 0 : h % 7 === 0 ? 1 : h % 5 === 0 ? 2 : 5;
      return { ...r, left, out: left === 0 };
    });
  }
}
