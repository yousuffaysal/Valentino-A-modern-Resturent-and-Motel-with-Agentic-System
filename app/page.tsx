import { getAttractions, getRooms, getServices, getSettings } from '@/lib/content';
import { HomeScreen } from '@/components/home/HomeScreen';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [rooms, services, attractions, settings] = await Promise.all([
    getRooms(),
    getServices(),
    getAttractions(),
    getSettings(),
  ]);

  return <HomeScreen rooms={rooms} services={services} attractions={attractions} fromRate={settings.fromRate} />;
}
