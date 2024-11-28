import Header from '@/components/navbar/Header';

import { type Metadata } from 'next';
import { Footer } from './articles/Footer';
export const metadata: Metadata = {
  title: 'Articles',
  description:
    'Protium Articles - a community for researchers and developers to share knowledge and insights.',
  icons: [
    {
      url: '/favicon.ico',
      rel: 'shortcut icon',
    },
    {
      url: '/favicon.ico',
      rel: 'apple-touch-icon',
    },
    {
      url: '/favicon.ico',
      rel: 'manifest',
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full bg-neutral-50 dark:bg-black">
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
        </div>
      </div>
      <div className="relative flex w-full flex-col">
        <Header />

        <main className="flex-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
