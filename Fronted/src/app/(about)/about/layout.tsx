import { PrimarySite } from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(PrimarySite),
  title: 'About - DeepModeling',
  description:
    'People attracted by DeepModeling for its openness, inclusive, and dedication to advancing scientific computing worldwide.',
  openGraph: {
    title: 'About - DeepModeling',
    type: 'website',
    images: `/logo/og-image.png`,
    url: `/about`,
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
  return <>{children}</>;
}
