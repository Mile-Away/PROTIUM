'use client';
import { PrimarySite } from '@/config';
import {
  BookOpenIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  FingerPrintIcon,
  NewspaperIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { name: string };
}) {
  const { name } = params;
  const fullPath = usePathname();
  const url = usePathname().split('/').pop();

  const navigation = {
    General: [
      {
        name: 'General',
        href: '',
        icon: Cog6ToothIcon,
        current: url === 'setting',
      },
      {
        name: 'Overview',
        href: 'overview',
        icon: BookOpenIcon,
        current: url === 'overview',
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
      // {
      //   name: 'Docs',
      //   href: 'docs',
      //   icon: DocumentTextIcon,
      //   current: url === 'docs',
      // },
    ],

    Access: [
      {
        name: 'Access',
        href: 'access',
        icon: FingerPrintIcon,
        current: url === 'access',
      },
    ],
  };

  return (
    <div className="relative flex flex-col gap-x-4 py-4 md:flex-row lg:gap-x-16">
      <aside className="top-24 flex h-fit border-b border-neutral-900/5 py-4 dark:border-neutral-50/5 md:sticky md:w-fit lg:block lg:w-64 lg:flex-none lg:border-0">
        <nav className="flex flex-col gap-y-4 divide-y divide-neutral-100 dark:divide-neutral-800">
          <ul
            role="list"
            className="flex flex-col gap-x-3 gap-y-1 whitespace-nowrap"
          >
            {navigation.General.map((item) => (
              <li key={item.name}>
                <Link
                  href={`${PrimarySite}/space/${name}/setting/${item.href}`}
                  className={clsx(
                    item.current
                      ? 'bg-neutral-50 text-indigo-600 dark:bg-neutral-800 dark:text-white'
                      : 'text-neutral-700 hover:bg-neutral-50 hover:text-indigo-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white',
                    'group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6',
                  )}
                >
                  <item.icon
                    className={clsx(
                      item.current
                        ? ' text-inherit'
                        : ' text-inherit group-hover:text-inherit',
                      'h-6 w-6 shrink-0',
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="pt-4">
            {navigation.Access.map((item) => (
              <li key={item.name}>
                <Link
                  href={`${PrimarySite}/space/${name}/setting/${item.href}`}
                  className={clsx(
                    item.current
                      ? 'bg-neutral-50 text-indigo-600 dark:bg-neutral-800 dark:text-white'
                      : 'text-neutral-700 hover:bg-neutral-50 hover:text-indigo-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white',
                    'group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6',
                  )}
                >
                  <item.icon
                    className={clsx(
                      item.current
                        ? ' text-inherit'
                        : ' text-inherit group-hover:text-inherit',
                      'h-6 w-6 shrink-0',
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
