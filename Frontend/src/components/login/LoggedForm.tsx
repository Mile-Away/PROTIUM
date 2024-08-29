import { UserProps } from '@/@types/auth-service';
import DropdownMenu from '@/components/dropdownMenu/DropdownMenu';
import { MEDIA_URL } from '@/config';
import { useAuthServiceContext } from '@/context/AuthContext';
import { useDictCRUD } from '@/hooks/useCrud';
import { formatTime } from '@/lib/formatDate';
import { Menu } from '@headlessui/react';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
const statuses = {
  Active: 'text-green-700 bg-green-50 ring-green-600/20',
  // Withdraw: 'text-gray-600 bg-neutral-50 ring-gray-500/10',
  // Overdue: 'text-red-700 bg-red-50 ring-red-600/10',
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const LoggedForm = () => {
  const router = useRouter();
  const { logout } = useAuthServiceContext();
  const { dataCRUD, error, isLoading, fetchData } = useDictCRUD<UserProps>(
    {} as UserProps,
    '/accounts/',
  );

  const navigation = [
    { name: 'Settings', href: '/dashboard/settings' },
    { name: 'Sign out', onClick: () => logout() },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ul
      role="list"
      className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 xl:gap-x-8"
    >
      <li
        key={dataCRUD?.id}
        className="rounded-xl border border-gray-200 dark:border-gray-800"
      >
        <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-neutral-50/10 p-6 dark:border-gray-50/5 dark:bg-neutral-900/10">
          <DropdownMenu itemClassName=" -mt-44">
            <Menu.Button className="-m-2 flex  items-center gap-x-4 rounded-md p-2 transition-all hover:bg-neutral-100/80 hover:ring-1 hover:ring-gray-200/50 dark:hover:bg-neutral-700/50 dark:hover:shadow dark:hover:ring-1 dark:hover:ring-gray-600/50">
              <img
                src={MEDIA_URL + dataCRUD?.avatar}
                alt={dataCRUD?.username}
                className="h-12 w-12 flex-none rounded-lg object-cover ring-1 ring-gray-900/10"
              />
              <div className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
                {dataCRUD?.username}
              </div>
            </Menu.Button>
          </DropdownMenu>
          <button
            type="button"
            onClick={() => router.push('/dashboard/')}
            className="transition-color ml-auto inline-flex items-center gap-x-1.5 rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-indigo-600 duration-150 ease-linear hover:bg-indigo-600 hover:text-white hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-indigo-300 dark:hover:text-white"
          >
            Go
            {/* <ChevronDoubleRightIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" /> */}
            <ArrowRightEndOnRectangleIcon
              className="-mr-0.5 h-5 w-5"
              aria-hidden="true"
            />
            {/* <CursorArrowRaysIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" /> */}
          </button>
        </div>
        <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6 dark:divide-gray-900">
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="text-gray-500 dark:text-gray-400">Data Joined</dt>
            <dd className="text-gray-700 dark:text-gray-200">
              <time dateTime={dataCRUD.date_joined}>
                {formatTime(dataCRUD.date_joined, 'long')}
              </time>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="text-gray-500 dark:text-gray-400">Email</dt>
            <dd className="flex items-start gap-x-2">
              <div className="font-medium text-gray-900 dark:text-white">
                {dataCRUD.email}
              </div>
              <div
                className={classNames(
                  statuses.Active,
                  'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                )}
              >
                {'active'}
              </div>
            </dd>
          </div>
        </dl>
      </li>
    </ul>
  );
};

export default LoggedForm;
