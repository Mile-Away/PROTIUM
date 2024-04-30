'use client';
import DocList from '@/components/docs/DocList';
import { BASE_URL } from '@/config';
import useAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import {
  BarsArrowUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const tabs = [
  { name: 'All', href: '#', current: true },
  // { name: 'Phone Screening', href: '#', current: false },
  // { name: 'Interview', href: '#', current: false },
  // { name: 'Offer', href: '#', current: false },
  // { name: 'Hired', href: '#', current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Page() {
  const jwtAxios = useAxiosWithInterceptors();
  const router = useRouter();
  const createDoc = () => {
    jwtAxios
      .post(`${BASE_URL}/document/vs/document/`, { title: '' })
      .then((res) => {
        if (res.data) {
          router.push(`/dashboard/manuscript/edit/${res.data.uuid}/`);
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  return (
    <div className="px-4 pt-8 sm:px-8 ">
      <div className="relative border-b border-gray-200 pb-5 dark:border-neutral-700 sm:pb-0">
        <div className="md:flex md:items-center md:justify-between">
          <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Manuscript
          </h3>
          <div className="absolute right-0 top-0 mt-0 flex">
            <div className="">
              <label htmlFor="mobile-search-candidate" className="sr-only">
                Search
              </label>
              <label htmlFor="desktop-search-candidate" className="sr-only">
                Search
              </label>
              <div className="flex rounded-md shadow-sm">
                <div className="relative hidden flex-grow focus-within:z-10 sm:block">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>

                  <input
                    type="text"
                    name="desktop-search-candidate"
                    id="desktop-search-candidate"
                    className="hidden w-full rounded-none
                   rounded-l-md border-0 py-1.5 pl-10 text-sm leading-6
                    text-gray-900 ring-1 ring-inset ring-gray-300
                     placeholder:text-gray-400 focus:outline-none
                      focus:ring-2 focus:ring-inset
                       focus:ring-gray-400 dark:bg-inherit
                        dark:text-white dark:ring-gray-700
                         dark:hover:bg-neutral-800 sm:block"
                    placeholder="Search manuscripts"
                  />
                </div>
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
              onClick={() => createDoc()}
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
      <DocList />
    </div>
  );
}
