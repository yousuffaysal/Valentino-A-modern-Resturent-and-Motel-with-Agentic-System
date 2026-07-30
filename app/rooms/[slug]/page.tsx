import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRooms } from '@/lib/content';
import { RoomDetailScreen } from '@/components/rooms/RoomDetailScreen';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const rooms = await getRooms();
  const room = rooms.find((r) => r.slug === params.slug);
  if (!room) return { title: 'Room not found · Hotel Valentino' };
  return {
    title: `${room.name} · Hotel Valentino`,
    description: room.blurb,
  };
}

export default async function RoomDetailPage({ params }: { params: { slug: string } }) {
  const rooms = await getRooms();
  const room = rooms.find((r) => r.slug === params.slug);
  if (!room) notFound();

  const others = rooms.filter((r) => r.slug !== room.slug).slice(0, 4);
  return <RoomDetailScreen room={room} others={others} />;
}
