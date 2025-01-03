'use client';
import { SpaceProps } from '@/@types/space';
import { useCRUD } from '@/hooks/useCrud';
import { useAuthService } from '@/services/AuthService';
import {
  BookOpenIcon,
  Cog6ToothIcon,
  NewspaperIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
interface TabProps {
  name: string;
  href: string;
  current: boolean;
  icon: React.ComponentType<React.ComponentPropsWithoutRef<'svg'>>;
}

const SpaceNavigation = ({ name }: { name: string }) => {
  const id = useId();
  const { userInfo } = useAuthService();
  const url = usePathname().split('/')[3]
    ? usePathname().split('/')[3]
    : usePathname().split('/')[2];

  const { fetchData, dataCRUD, isLoading, error } = useCRUD<SpaceProps>(
    [],
    `/server/vs/select/?by_server_name=${name}`,
  );

  useEffect(() => {
    if (name) fetchData();
  }, [name]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [tabs, setTabs] = useState<TabProps[]>([
    {
      name: 'Overview',
      href: '/',
      current: url === '' || url === name,
      icon: BookOpenIcon,
    },
    {
      name: 'Discussion',
      href: 'discussion',
      icon: UsersIcon,
      current: url === 'discussion',
    },
    {
      name: 'Releases',
      href: 'releases',
      icon: NewspaperIcon,
      current: url === 'releases',
    },
    {
      name: 'Setting',
      href: 'setting',
      current: url === 'setting',
      icon: Cog6ToothIcon,
    },
  ]);

  useEffect(() => {
    if (dataCRUD[0]) {
      if (!dataCRUD[0]?.enable_discussion) {
        setTabs((tabs) => tabs.filter((tab) => tab.name !== 'Discussion'));
      }

      if (!dataCRUD[0]?.enable_releases) {
        setTabs((tabs) => tabs.filter((tab) => tab.name !== 'Releases'));
      }

      setIsAdmin(dataCRUD[0]?.admins?.includes(userInfo?.username || ''));
    }
  }, [dataCRUD]);

  useEffect(() => {
    if (isAdmin) {
      setTabs((tabs) => {
        if (!tabs.some((tab) => tab.name === 'Setting')) {
          return [
            ...tabs,
            {
              name: 'Setting',
              href: 'setting',
              current: url === 'setting',
              icon: Cog6ToothIcon,
            },
          ];
        }
        return tabs;
      });
    } else {
      setTabs((tabs) => tabs.filter((tab) => tab.name !== 'Setting'));
    }
  }, [isAdmin]);

  useEffect(() => {
    if (url === '' || url === name) {
      setTabs((tabs) =>
        tabs.map((tab) => ({
          ...tab,
          current: tab.href === '/',
        })),
      );
    } else {
      setTabs((tabs) =>
        tabs.map((tab) => ({
          ...tab,
          current: tab.href === url,
        })),
      );
    }
  }, [url]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setIsAtEnd(
        container.scrollLeft + container.clientWidth >= container.scrollWidth,
      );
    }
  };

  return (
    <div className="sticky inset-0 top-0 z-20 mt-12 bg-white bg-gradient-to-t pt-8 dark:bg-neutral-900 ">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="inert relative w-full overflow-x-auto"
      >
        <nav className=" flex w-fit min-w-full items-center space-x-4 border-b dark:border-neutral-700 lg:space-x-8">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              href={
                tab.href.startsWith('http')
                  ? tab.href
                  : '/space/' + name + '/' + tab.href
              }
              target={tab.href.startsWith('http') ? '_blank' : undefined}
              className={clsx(
                'flex gap-2',
                tab.current
                  ? 'border-indigo-500 text-indigo-600 dark:border-white dark:text-white'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-100',
                'whitespace-nowrap border-b-2 px-1 pb-2 text-sm font-semibold lg:pb-4',
              )}
              aria-current={tab.current ? 'page' : undefined}
            >
              <tab.icon className="h-6 w-6" />
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* 横向遮挡 */}
      {!isAtEnd && (
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-24 bg-gradient-to-r from-transparent to-white dark:from-transparent dark:to-neutral-900" />
      )}
      {/* 纵向渐变 */}
      <div className="absolute bottom-0 left-0 right-0 top-1/2 -z-10 h-20 bg-gradient-to-t from-transparent to-white dark:from-transparent dark:to-neutral-900" />
    </div>
  );
};

export default SpaceNavigation;
