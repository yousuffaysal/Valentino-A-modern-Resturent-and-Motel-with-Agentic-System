import type { Metadata } from 'next';
import { ContactScreen } from '@/components/contact/ContactScreen';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact · Hotel Valentino',
  description:
    'Hotel Valentino, Ahsan Bhaban, Guptanka, Main Road, Maijdee Court, Sadar, Noakhali-3800. Reception open 24 hours on +880 1795 855555.',
};

export default function ContactPage() {
  return <ContactScreen />;
}
