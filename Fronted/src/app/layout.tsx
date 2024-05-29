import Provider from '@/app/providers';
import clsx from 'clsx';
import { type Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

import { PrimarySite } from '@/config';

import '@/styles/tailwind.css';


const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const monaSans = localFont({
  src: '../fonts/Mona-Sans.var.woff2',
  display: 'swap',
  variable: '--font-mona-sans',
  weight: '200 900',
});

/**
 * Metadata for the layout.
 */
export const metadata: Metadata = {
  metadataBase: new URL(PrimarySite),
  title: 'DeepModeling',
  description: 'Define the future of scientific computing together',
  openGraph: {
    title: 'DeepModeling',
    description: 'Define the future of scientific computing together',
    type: 'website',
    images: `/@brand/logo/og-image.png`,
    url: `/`,
  },
  icons: [
    { rel: 'icon', url: '/@brand/logo/Logo-BgWhite.svg' },
    {
      rel: 'icon',
      media: '(prefers-color-scheme: dark)',
      url: '/@brand/logo/Logo-White.svg',
    },
    { rel: 'apple-touch-icon', url: '/@brand/logo/Logo-BgWhite.png' },
    {
      rel: 'apple-touch-icon',
      media: '(prefers-color-scheme: dark)',
      url: '/@brand/logo/Logo-White.png',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={clsx('h-full antialiased', inter.variable, monaSans.variable)}
      suppressHydrationWarning
    >
      <body className="bg-white dark:bg-neutral-900 h-full">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
