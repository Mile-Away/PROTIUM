import Footer from '@/components/homepage/Footer';
import Navbar from '@/components/navbar/Navbar';
import { PrimarySite } from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(PrimarySite),
  title: 'Manifesto - Protium',
  description:
    'People attracted by Protium for its openness, inclusive, and dedication to advancing scientific computing worldwide.',
  openGraph: {
    images: `/logo/og-image.png`,
    url: `/manifesto`,
  },
  icons: [
    { rel: 'icon', url: '/logo/Logo-BgWhite.svg' },
    {
      rel: 'icon',
      media: '(prefers-color-scheme: dark)',
      url: '/logo/Logo-White.svg',
    },
    { rel: 'apple-touch-icon', url: '/logo/Logo-BgWhite.png' },
    {
      rel: 'apple-touch-icon',
      media: '(prefers-color-scheme: dark)',
      url: '/logo/Logo-White.png',
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-black">
      {/* Header */}
      <Navbar />

      <main className="isolate">{children}</main>
      <Footer />
    </div>
  );
}
