import { useAuthServiceContext } from '@/context/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import {
  AdjustmentsHorizontalIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  CubeTransparentIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DocumentSite, PrimarySite, WorkflowSite } from '@/config';
import {
  DocumentTextIcon,
  HomeIcon,
  PowerIcon,
} from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  if (classes === undefined) {
    return '';
  }
  return classes.filter(Boolean).join(' ');
}

interface DropdownMenuProps<T> {
  customNavi?: T[];
  children: React.ReactNode;
  itemClassName?: string;
}

interface NavigationProps {
  name: string;
  href?: string;
  onClick?: () => void;
  class?: 'primary' | 'secondary' | 'third';
  icon?: React.ReactNode;
}

export function DropdownMenu({
  customNavi,
  children,
  itemClassName,
}: DropdownMenuProps<NavigationProps>) {
  const { logout } = useAuthServiceContext();
  const { t } = useTranslation('userPanel');

  const navigations: NavigationProps[] = [
    {
      name: 'Dashboard',
      href: `${PrimarySite}/dashboard`,
      class: 'primary',
      icon: <HomeIcon />,
    },
    {
      name: 'Space',
      href: `${PrimarySite}/dashboard/space`,
      class: 'primary',
      icon: <CubeTransparentIcon />,
    },
    {
      name: 'Manuscript',
      href: `${PrimarySite}/dashboard/manuscript`,
      class: 'primary',
      icon: <DocumentTextIcon />,
    },
    {
      name: 'Workflow',
      href: WorkflowSite,
      class: 'primary',
      icon: <AdjustmentsHorizontalIcon />,
    },
    {
      name: 'Docs',
      href: `${DocumentSite}/workflow`,
      class: 'secondary',
      icon: <BookOpenIcon />,
    },
    {
      name: 'Settings',
      href: `${PrimarySite}/dashboard/settings`,
      class: 'secondary',
      icon: <Cog6ToothIcon />,
    },
    {
      name: 'Sign out',
      onClick: () => logout(),
      class: 'third',
      icon: <PowerIcon />,
    },
  ];

  const [navigation, setNavigation] = useState<NavigationProps[]>(
    customNavi ? customNavi : navigations,
  );

  return (
    <Menu as="div" className={'flex justify-end'}>
      {children}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={classNames(
            'font-xs  origin-top-center absolute top-full z-50 -mr-1 w-fit divide-y divide-gray-200 rounded-md bg-white py-1 shadow ring-1 ring-neutral-900/5 focus:outline-none dark:divide-gray-700 dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-neutral-600/50 dark:ring-neutral-50/5 lg:py-2',
            itemClassName ? itemClassName : '',
          )}
        >
          <div className="p-2 pt-0">
            {navigation
              .filter((item) => item.class === 'primary')
              .map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <Link
                      href={item.href || '#'}
                      onClick={item.onClick}
                      className={classNames(
                        active ? 'bg-neutral-50 dark:bg-neutral-900' : '',
                        'flex items-center px-3 py-1 text-sm leading-6 text-neutral-900 dark:text-white',
                      )}
                    >
                      <div className="mr-2 h-4 w-4">{item.icon}</div>

                      {t(item.name)}
                    </Link>
                  )}
                </Menu.Item>
              ))}
          </div>
          <div className="p-2">
            {navigation
              .filter((item) => item.class === 'secondary')
              .map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <Link
                      href={item.href || '#'}
                      onClick={item.onClick}
                      className={classNames(
                        active ? 'bg-neutral-50 dark:bg-neutral-900' : '',
                        'flex items-center px-3 py-1 text-sm leading-6 text-neutral-900 dark:text-white',
                      )}
                    >
                      <div className="mr-2 h-4 w-4">{item.icon}</div>
                      {t(item.name)}
                    </Link>
                  )}
                </Menu.Item>
              ))}
          </div>
          <div className="p-2 pb-0">
            {navigation
              .filter((item) => item.class === 'third')
              .map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <Link
                      href={item.href || '#'}
                      onClick={item.onClick}
                      className={classNames(
                        active ? 'bg-neutral-50 dark:bg-neutral-900' : '',
                        'flex items-center px-3 py-1 text-sm leading-6 text-red-900 dark:text-red-100',
                      )}
                    >
                      <div className="mr-2 h-4 w-4">{item.icon}</div>
                      {t(item.name)}
                    </Link>
                  )}
                </Menu.Item>
              ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
export default DropdownMenu;