import type { Metadata } from 'next';
import { getGallery } from '@/lib/content';
import { GalleryScreen } from '@/components/gallery/GalleryScreen';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gallery · Hotel Valentino',
  description: 'Photographs of Hotel Valentino: the building, the rooms, the views and the Sky View rooftop kitchen.',
};

export default async function GalleryPage() {
  const items = await getGallery();
  return <GalleryScreen items={items} />;
}
