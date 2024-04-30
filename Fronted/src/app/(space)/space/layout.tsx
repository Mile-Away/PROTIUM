import Footer from '@/components/homepage/Footer';
import Navbar from '@/components/navbar/Navbar';

import { Metadata } from 'next';
export const metadata: Metadata = {
  title: {
    template: '%s - DeepModeling Space',
    default: 'DeepModeling Space',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" ">
      <div className="relative flex flex-col">
        <Navbar />

        <main className="border-b-2 border-neutral-100 dark:border-neutral-800">{children}</main>

        <Footer />
      </div>
    </div>
  );
}
