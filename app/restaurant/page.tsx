import type { Metadata } from 'next';
import { getMenu, getSettings } from '@/lib/content';
import { RestaurantScreen } from '@/components/restaurant/RestaurantScreen';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sky View Rooftop Restaurant · Hotel Valentino',
  description:
    'Sky View, the rooftop kitchen at Hotel Valentino. Chinese, Japanese and Korean cooking, plus an Italian café pulling Danesi Emerald espresso.',
};

export default async function RestaurantPage() {
  const [menu, settings] = await Promise.all([getMenu(), getSettings()]);
  return <RestaurantScreen menu={menu} hours={settings.restaurantHours} />;
}
