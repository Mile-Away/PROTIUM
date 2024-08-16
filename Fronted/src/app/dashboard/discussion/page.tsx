'use client';
import DiscussionSearch from '@/components/DiscussionSearch';
import createAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { BarsArrowUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const tabs = [
  { name: '最近访问', href: '#', current: true },
  { name: '我管理的', href: '#', current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Page() {
  const jwtAxios = createAxiosWithInterceptors();
  const router = useRouter();

  return (
    <div className="px-4 pt-8 sm:px-8 ">
      <div className="relative border-b border-gray-200 pb-5 dark:border-neutral-700 sm:pb-0">
        <div className="md:flex md:items-center md:justify-between">
          <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Discussions
          </h3>
          <div className="absolute right-0 top-0 mt-0 flex">
            <div className="">
              <label htmlFor="mobile-search-candidate" className="sr-only">
                Search
              </label>
              <div className="flex rounded-md shadow-sm">
                <DiscussionSearch />
                <button
                  type="button"
                  className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold 
                  text-gray-900 ring-1 ring-inset ring-gray-100 hover:bg-neutral-50 dark:text-white dark:ring-gray-700 dark:hover:bg-neutral-800 
                  sm:rounded-none sm:rounded-r-md sm:ring-gray-300"
                >
                  <BarsArrowUpIcon
                    className="-ml-0.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  Sort
                  <ChevronDownIcon
                    className="-mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
            <button
              type="button"
              className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  focus-visible:outline-indigo-600"
              onClick={() => {
                alert(
                  'Please go to the specific space to create a discussion.',
                );
              }}
            >
              Create
            </button>
          </div>
        </div>
        <div className="mt-8">
          <div className="inert relative max-w-[100%] overflow-x-auto">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={classNames(
                    tab.current
                      ? 'border-indigo-500 text-indigo-600 dark:border-white dark:text-white'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-100',
                    'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium',
                  )}
                  aria-current={tab.current ? 'page' : undefined}
                >
                  {tab.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      {/* <DiscussionList space_uuid={space_uuid} discussions={discussions} /> */}
      <div>
        <p className="mt-8 text-base font-semibold text-gray-400">
          This feature is under development, please check back later.
        </p>
      </div>
    </div>
  );
}
