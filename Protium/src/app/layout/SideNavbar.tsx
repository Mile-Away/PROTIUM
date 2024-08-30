'use client';
import Logo from '@/@brand/Logo';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dashboardNavi } from './dashboardNav';
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
    <div
      className={classNames(
        isSticky ? 'lg:w-64' : 'lg:w-0.5',
        'z-50 hidden  bg-white transition-all duration-300 ease-in-out dark:bg-neutral-900 lg:fixed lg:inset-y-0 lg:flex lg:flex-col lg:overflow-hidden ',
      )}
    >
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-2 pb-4 dark:border-neutral-700 dark:bg-neutral-800/50">
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

        <div className="flex h-full flex-col">
          <WorkflowList />
        </div>
      </div>

      {isSticky ? (
        // <button
        //   name="button"
        //   title="sticky"
        //   className=""
        //   onClick={() => setIsSticky(false)}
        // >
        //   <PiPushPinSimpleFill className="h-6 w-6 rounded-md p-1 text-neutral-500 opacity-75 transition-all hover:bg-neutral-50 hover:opacity-100 dark:text-neutral-300 dark:hover:bg-neutral-800" />
        // </button>
        <div
          className=" absolute right-0 h-full w-0.5 cursor-col-resize bg-transparent hover:bg-indigo-600 dark:hover:bg-indigo-400"
          onClick={() => setIsSticky(false)}
        ></div>
      ) : (
        // <button
        //   name="button"
        //   title="sticky"
        //   className=""
        //   onClick={() => setIsSticky(true)}
        // >
        //   <PiPushPin className=" h-6 w-6 rounded-md p-1 text-neutral-500 opacity-75 transition-all hover:bg-neutral-50 hover:opacity-100 dark:text-neutral-300 dark:hover:bg-neutral-800" />
        // </button>
        <div
          className=" absolute right-0 h-full w-0.5 cursor-col-resize bg-transparent hover:bg-indigo-600 dark:hover:bg-indigo-400"
          onClick={() => setIsSticky(true)}
        ></div>
      )}
    </div>
  );
};

export default SideNavBar;
