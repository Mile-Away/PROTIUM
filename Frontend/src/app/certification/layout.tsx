'use client';
import Logo from '@/@brand/Logo';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="absolute left-6 top-4 z-50 flex items-center gap-2">
        <Link href="/" className=" ">
          <Logo className="h-11 w-11 rounded fill-white p-1.5 hover:bg-neutral-800" />
        </Link>
        <span className="font-display text-xl font-bold text-white">
          Certification
        </span>
      </div>
      {children}
    </>
  );
}
