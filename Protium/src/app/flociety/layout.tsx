'use client';

import FlocietyNavbar from '@/components/FlocietyNavbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FlocietyNavbar />
      {children}
    </>
  );
}
