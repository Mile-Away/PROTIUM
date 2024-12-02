'use client';

import LabHeader from './LabHeader';
import SpaceNavigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  params: { uuid: string };
}

export default function Layout({ children, params }: LayoutProps) {
  return (
    <div className="relative mx-auto h-full px-4 py-8  sm:px-6 lg:px-8">
      <div className="flex h-full flex-col">
        <LabHeader />

        <SpaceNavigation params={params} />

        {children}
      </div>
    </div>
  );
}
