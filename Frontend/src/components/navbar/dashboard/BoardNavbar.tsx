'use client';
import { UserProps } from '@/@types/auth-service';
import LangSwitch from '@/components/LangSwitch';
import DropdownMenu from '@/components/dropdownMenu/DropdownMenu';
import SlideMenu from '@/components/dropdownMenu/SlideMenu';
import { MEDIA_URL } from '@/config';
import { useDictCRUD } from '@/hooks/useCrud';
import { Menu } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeSwitch } from '../../ThemeSwitch';
import SearchGlobal from '@/components/search/SearchGlobal';
import { dashboardNavi } from './dashboardNav';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}


const BoardNavbar = () => {
  const { t } = useTranslation('translation');
  const url = usePathname();
  const [navigation, setNavigation] = useState(dashboardNavi);
  const [openSearch, setOpenSearch] = useState(false);
  const { fetchData, dataCRUD, error, isLoading } = useDictCRUD(
    {} as UserProps,
    '/accounts/',
  );

  useEffect(() => {
    fetchData();
  }, []);

  // 移动端的导航栏更新
  const updateNavigationCurrent = () => {
    const updatedNavigation = navigation.map((navItem) => {
      const navItemHrefParts = navItem.href.split('/').filter(Boolean);
      const urlParts = url.split('/').filter(Boolean);

      const isDashboard = navItem.name === 'Dashboard';
      const shouldMatchFirstTwoParts = navItemHrefParts.length > 1;

      let isCurrent = false;
      if (isDashboard) {
        isCurrent =
          urlParts.length === 1 && urlParts[0] === navItemHrefParts[0];
      } else if (shouldMatchFirstTwoParts) {
        isCurrent =
          navItemHrefParts[0] === urlParts[0] &&
          navItemHrefParts[1] === urlParts[1];
      } else {
        isCurrent = navItem.href === url;
      }

      return {
        ...navItem,
        current: isCurrent,
      };
    });
    setNavigation(updatedNavigation);
  };

  useEffect(() => {
    updateNavigationCurrent();
  }, [url]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  let { scrollY } = useScroll();
  let bgOpacityLight = useTransform(scrollY, [0, 72], [0.2, 0.9]);
  let bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8]);

  return (
    <motion.div
      className="flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 
     bg-white/[var(--bg-opacity-light)] px-4 shadow-sm backdrop-blur-sm transition
       dark:border-neutral-700 dark:bg-zinc-900/[var(--bg-opacity-dark)] dark:backdrop-blur-xl 
        sm:gap-x-6 sm:px-6 lg:px-8"
      style={
        {
          '--bg-opacity-light': bgOpacityLight,
          '--bg-opacity-dark': bgOpacityDark,
        } as React.CSSProperties
      }
    >
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* 移动端滑出导航栏 */}
      <SlideMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <nav className="flex flex-1 flex-col" aria-label="Sidebar">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-neutral-50 text-indigo-600 dark:bg-neutral-700/50 dark:text-white'
                          : 'text-gray-700 hover:bg-neutral-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-neutral-800 dark:hover:text-white',
                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.current
                            ? 'text-indigo-600 dark:text-white'
                            : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white',
                          'h-6 w-6 shrink-0',
                        )}
                        aria-hidden="true"
                      />
                      {t(item.name)}
                      {/* {item.count ? (
                        <span
                          className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-gray-600 ring-1 ring-inset ring-gray-200 dark:bg-neutral-900 dark:text-white"
                          aria-hidden="true"
                        >
                          {item.count}
                        </span>
                      ) : null} */}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="mt-auto">
              <Link
                href="/dashboard/settings"
                className={`${
                  url === '/dashboard/settings'
                    ? 'bg-neutral-100 text-indigo-600 dark:bg-neutral-800 dark:text-white'
                    : ''
                } "group dark:hover:text-white" -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-neutral-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-neutral-800`}
              >
                <Cog6ToothIcon
                  className={`${
                    url === '/dashboard/settings'
                      ? 'bg-neutral-100 text-indigo-600 dark:bg-neutral-800 dark:text-white'
                      : ''
                  } "h-6 dark:group-hover:text-inherit" w-6 shrink-0 text-gray-400 group-hover:text-indigo-600 dark:hover:text-white dark:group-hover:bg-inherit`}
                  aria-hidden="true"
                />
                {t('sidebar.settings')}
              </Link>
            </li>
            {/* <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">
                Projects
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {secondaryNavigation.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-neutral-50 text-indigo-600'
                          : 'text-gray-700 hover:bg-neutral-50 hover:text-indigo-600',
                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                      )}
                    >
                      <span
                        className={classNames(
                          item.current
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600',
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium',
                        )}
                      >
                        {item.initial}
                      </span>
                      <span className="truncate">{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </li> */}
          </ul>
        </nav>
      </SlideMenu>

      {/* 桌面端 */}
      <div
        className="h-6 w-px bg-neutral-200 dark:bg-neutral-700 lg:hidden"
        aria-hidden="true"
      />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 ">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>

          <MagnifyingGlassIcon
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="dark:text-whte block h-full w-full border-0 bg-inherit py-0 pl-8 
              pr-0 text-gray-900 placeholder:text-gray-400 focus:outline-none 
              focus:ring-0 dark:text-gray-50 dark:placeholder:text-gray-400 sm:text-sm"
            placeholder="Search..."
            type="search"
            name="search"
            onClick={() => setOpenSearch(true)}
          />
        </form>
        <SearchGlobal open={openSearch} setOpen={setOpenSearch} />
        <div className="flex items-center gap-x-3 lg:gap-x-4">
          {/* Separator */}

          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-neutral-200 dark:lg:bg-neutral-700"
            aria-hidden="true"
          />

          {/* Context Buttons */}
          <LangSwitch className="m-0 h-5 w-5" />
          <ThemeSwitch />

          {/* <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            title="View Notifications"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button> */}

          {/* Profile dropdown */}
          <DropdownMenu itemClassName="-mt-1">
            <Menu.Button className="-m-1.5 flex items-center rounded p-1.5 duration-300 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <span className="sr-only">Open user menu</span>
              <img
                className="bg-neutral-5 h-6 w-6 rounded-full"
                src={`${MEDIA_URL}${dataCRUD.avatar}`}
                alt="avatar"
              />
              <span className="hidden lg:flex lg:items-center">
                <span
                  className="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                  aria-hidden="true"
                >
                  {dataCRUD.username}
                </span>
                {/* <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" /> */}
              </span>
            </Menu.Button>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
};

export default BoardNavbar;
