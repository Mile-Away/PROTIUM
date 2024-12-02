'use client';
import Logo from '@/@brand/Logo';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dashboardNavi } from '../layout/dashboardNav';
import EnvironmentList from './EnvironmentList';
import WorkflowList from './WorkflowList';

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
    <div className=" relative">
      <div
        className={classNames(
          isSticky
            ? 'bg-white dark:bg-neutral-900 lg:w-64'
            : 'w-0 bg-transparent',

          'z-10 hidden transition-all duration-300 ease-in-out lg:fixed lg:inset-y-0 lg:flex lg:flex-col lg:overflow-hidden ',
        )}
      >
        <div
          className={clsx(
            'flex grow flex-col gap-y-5 overflow-y-auto px-2 pb-4',
            'scrollbar-w-2',
            isSticky
              ? 'border-r border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-800/50'
              : 'bg-transparent',
          )}
        >
          <div className="mx-[0.32rem] flex h-16 shrink-0 place-content-between items-center overflow-hidden">
            <button
              name="button"
              title="home"
              className="mr-2 h-7 w-7"
              onClick={() => router.push('/')}
            >
              <Logo className="z-10 h-7 w-7 fill-indigo-800 transition-opacity duration-150 ease-in-out hover:opacity-75 dark:fill-white" />
            </button>
          </div>

          <WorkflowList />
          <EnvironmentList />
        </div>

        {isSticky && (
          <div
            className=" absolute right-0 h-full w-0.5 cursor-w-resize bg-transparent hover:bg-indigo-600 dark:hover:bg-indigo-400"
            onClick={() => setIsSticky(false)}
          ></div>
        )}
      </div>

      {!isSticky && (
        <div
          className="fixed left-0 z-50 -mr-2 h-full w-2 cursor-e-resize bg-transparent hover:bg-gradient-to-r hover:from-indigo-600 hover:to-transparent dark:hover:from-indigo-400 dark:hover:to-transparent"
          onClick={() => setIsSticky(true)}
        ></div>
      )}
    </div>
  );
};

export default SideNavBar;
