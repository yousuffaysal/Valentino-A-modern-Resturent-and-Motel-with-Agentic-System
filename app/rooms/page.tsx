import type { Metadata } from 'next';
import { getRooms } from '@/lib/content';
import { RoomsScreen } from '@/components/rooms/RoomsScreen';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Rooms · Hotel Valentino',
  description: 'Eight room categories in Maijdee Court, from BDT 2,500 a night. Hot water, mini fridge, flat-screen and free Wi-Fi in every room.',
};

export default async function RoomsPage() {
  const rooms = await getRooms();
  return <RoomsScreen rooms={rooms} />;
}
