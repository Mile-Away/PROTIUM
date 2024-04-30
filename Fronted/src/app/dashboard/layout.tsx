'use client';
import { Footer } from '../(home)/articles/Footer';
import { HeroPattern } from '@/components/HeroPattern';
import BoardNavbar from '@/components/navbar/dashboard/BoardNavbar';
import SideNavBar from '@/components/navbar/dashboard/SideNavbar';
import { useStickyContext } from '@/context/StickyContext';
import ProtectedRoute from '@/services/ProtectdRoute';
import { usePathname } from 'next/navigation';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const url = usePathname();

  const { isSticky, setIsSticky } = useStickyContext();

  return (
    <ProtectedRoute>
      <div className="h-full w-full">
        <SideNavBar isSticky={isSticky} setIsSticky={setIsSticky} />
        <main
          className={classNames(
            isSticky ? 'lg:pl-72' : 'lg:pl-20',
            'relative h-screen transition-all duration-300 ease-in-out',
          )}
        >
          <div
            className={classNames(
              isSticky ? 'lg:left-72' : 'lg:left-20',
              'fixed left-0 right-0 top-0 z-20 transition-all duration-300 ease-in-out',
            )}
          >
            <BoardNavbar />
          </div>

          {url.match(
            /^\/dashboard(\/space(\/.*)?|\/manuscript|\/discussion(\/.*)?)?$/,
          ) && <HeroPattern />}

          <div
            className={classNames(
              isSticky ? 'lg:left-72' : 'lg:left-20',
              'absolute bottom-0 left-0 right-0 top-16 transition-all duration-300 ease-in-out',
            )}
          >
            {children}

          </div>
        </main>
      </div>

    </ProtectedRoute>
  );
}
