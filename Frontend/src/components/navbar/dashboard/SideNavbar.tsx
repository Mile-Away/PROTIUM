import Logo from '@/@brand/Logo';
import {
  ArrowTopRightOnSquareIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PiPushPin, PiPushPinSimpleFill } from 'react-icons/pi';
import { dashboardNavi } from './dashboardNav';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

interface SideNavBarProps {
  isSticky: boolean;
  setIsSticky: (value: boolean) => void;
}

const SideNavBar: React.FC<SideNavBarProps> = ({ isSticky, setIsSticky }) => {
  const { t } = useTranslation('translation');
  const router = useRouter();
  const url = usePathname();
  const [navigation, setNavigation] = useState(dashboardNavi);

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

  return (
    <div
      className={classNames(
        isSticky ? 'lg:w-72' : 'lg:w-20 lg:hover:w-72',
        'group z-50 hidden  bg-white transition-all duration-300 ease-in-out lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col lg:overflow-hidden ',
      )}
    >
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-5 pb-4 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="mx-[0.32rem] flex h-16 shrink-0 place-content-between items-center overflow-hidden">
          <button
            name="button"
            title="home"
            className="mr-2 h-7 w-7"
            onClick={() => router.push('/')}
          >
            <Logo className="z-10 h-7 w-7 fill-indigo-800 transition-opacity duration-150 ease-in-out hover:opacity-75 dark:fill-white" />
          </button>
          {isSticky ? (
            <button
              name="button"
              title="sticky"
              className=""
              onClick={() => setIsSticky(false)}
            >
              <PiPushPinSimpleFill className="h-6 w-6 rounded-md p-1 text-neutral-500 opacity-75 transition-all hover:bg-neutral-50 hover:opacity-100 dark:text-neutral-300 dark:hover:bg-neutral-800" />
            </button>
          ) : (
            <button
              name="button"
              title="sticky"
              className=""
              onClick={() => setIsSticky(true)}
            >
              <PiPushPin className=" h-6 w-6 rounded-md p-1 text-neutral-500 opacity-75 transition-all hover:bg-neutral-50 hover:opacity-100 dark:text-neutral-300 dark:hover:bg-neutral-800" />
            </button>
          )}
        </div>

        {/* 重点是添加 overflow-hidden */}
        <nav className="flex flex-1 flex-col overflow-hidden">
          <ul role="list" className="flex flex-1 flex-col gap-y-2 ">
            <li className="relative">
              <div className="absolute  mb-4 text-xs font-semibold leading-6 text-gray-400">
                <span
                  className={clsx(
                    'select-none flex-nowrap whitespace-nowrap group-hover:block ',
                    isSticky ? 'block' : 'hidden',
                  )}
                >
                  Workshop
                </span>
              </div>
              <ul role="list" className="-mx-1 mt-8 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : ''}
                      className={classNames(
                        item.current
                          ? 'bg-neutral-50 text-indigo-600 dark:bg-neutral-800 dark:text-white'
                          : 'text-gray-700 hover:bg-neutral-50 hover:text-indigo-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white',
                        'group/link my-1 flex items-center gap-x-3 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold leading-6',
                      )}
                      onClick={() => {
                        const updatedNavigation = navigation.map((navItem) => {
                          if (navItem.name === item.name) {
                            return { ...navItem, current: true };
                          } else {
                            return { ...navItem, current: false };
                          }
                        });
                        setNavigation(updatedNavigation);
                      }}
                    >
                      <item.icon
                        className={classNames(
                          item.current
                            ? 'text-indigo-600 dark:text-inherit'
                            : 'text-gray-400 group-hover/link:text-indigo-600 dark:text-inherit dark:group-hover/link:text-inherit',
                          ' h-6 w-6 shrink-0',
                        )}
                        aria-hidden="true"
                      />
                      {t(item.name)}
                      {item.href.startsWith('http') && (
                        <ArrowTopRightOnSquareIcon
                          className="invisible ml-auto h-4 w-4 text-gray-400
                         group-hover/link:visible group-hover/link:text-indigo-600 dark:text-inherit dark:group-hover/link:text-inherit"
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {/* <li className='relative'>
              <hr className="group-hover:hidden h-0 border-t border-gray-200 dark:border-neutral-700" />
              <div className="absolute  mb-4 text-xs font-semibold leading-6 text-gray-400">
                <span className="  hidden select-none flex-nowrap whitespace-nowrap group-hover:block ">
                  Workshops
                </span>
              </div>
              <ul role="list" className="-mx-1 space-y-1 mt-8">
                {workshopNavi.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-neutral-50 text-indigo-600 dark:bg-neutral-800 dark:text-white'
                          : 'text-gray-700 hover:bg-neutral-50 hover:text-indigo-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white',
                        'group my-1 flex gap-x-3 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold leading-6',
                      )}
                      onClick={() => {
                        const updatedNavigation = navigation.map((navItem) => {
                          if (navItem.name === item.name) {
                            return { ...navItem, current: true };
                          } else {
                            return { ...navItem, current: false };
                          }
                        });
                        setNavigation(updatedNavigation);
                      }}
                    >
                      <item.icon
                        className={classNames(
                          item.current
                            ? 'text-indigo-600 dark:text-inherit'
                            : 'text-gray-400 group-hover:text-indigo-600 dark:text-inherit dark:group-hover:text-inherit',
                          ' h-6 w-6 shrink-0',
                        )}
                        aria-hidden="true"
                      />
                      {t(item.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </li> */}
            <li className="mt-auto">
              <Link
                href="/dashboard/settings"
                className={`${
                  url === '/dashboard/settings'
                    ? 'bg-neutral-100 text-indigo-600 dark:bg-neutral-800 dark:text-white'
                    : ''
                } group -mx-1 flex gap-x-3 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-neutral-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-white`}
              >
                <Cog6ToothIcon
                  className={`${
                    url === '/dashboard/settings'
                      ? 'bg-neutral-100 text-indigo-600 dark:bg-neutral-800 dark:text-white'
                      : ''
                  } h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600 dark:hover:text-white dark:group-hover:bg-inherit dark:group-hover:text-inherit`}
                  aria-hidden="true"
                />
                {t('sidebar.settings')}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SideNavBar;
