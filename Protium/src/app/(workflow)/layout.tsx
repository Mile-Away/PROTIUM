'use client';
import BoardNavbar from '@/app/layout/BoardNavbar';
import SideNavBar from '@/app/layout/SideNavbar';
import { useStickyContext } from '@/context/StickyContext';
import clsx from 'clsx';

const options = [
  {
    title: 'Default',
    description: 'Sort by oldest creation time',
    current: true,
  },
  {
    title: 'Activity',
    description: 'Sort by latest updated',
    current: false,
  },
  {
    title: 'Created',
    description: 'Sort by most recent creation time',
    current: false,
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isSticky, setIsSticky } = useStickyContext();

  return (
    <>
      <div className="h-full w-full">
        <SideNavBar isSticky={isSticky} setIsSticky={setIsSticky} />
        <main
          className={clsx(
            isSticky ? 'lg:pl-64' : 'lg:pl-4 ',
            'relative h-screen transition-all duration-300 ease-in-out',
          )}
        >
          <div
            className={clsx(
              isSticky ? 'lg:left-64' : 'lg:left-4',
              'fixed left-0 right-0 top-0 z-20 transition-all duration-300 ease-in-out',
            )}
          >
            <BoardNavbar />
          </div>

          <div
            className={clsx(
              isSticky ? 'lg:left-64' : 'lg:left-4',
              'absolute bottom-0 left-0 right-0 top-16 transition-all duration-300 ease-in-out',
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </>
  );
}