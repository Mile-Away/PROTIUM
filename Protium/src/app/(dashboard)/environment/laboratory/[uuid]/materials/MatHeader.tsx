import { CalendarIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { Cog6ToothIcon, InboxIcon } from '@heroicons/react/24/outline';

export default function MatHeader() {
  return (
    <div className="lg:flex lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1">
        <nav className="flex" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-2">
            <li>
              <div className="flex">
                <a
                  href="#"
                  className="text-xs font-medium text-gray-400 hover:text-white"
                >
                  Repo 1
                </a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon
                  className="h-5 w-5 flex-shrink-0 text-gray-500"
                  aria-hidden="true"
                />
                <a
                  href="#"
                  className="ml-2 text-xs font-medium text-gray-400 hover:text-white"
                >
                  Plate 1
                </a>
              </div>
            </li>
          </ol>
        </nav>
        <div className="mt-2 flex items-center  ">
          <InboxIcon className="h-6 w-6 mr-2 dark:text-white" />
          <h2 className=" text-xl font-bold leading-7 text-white sm:truncate sm:text-2xl sm:tracking-tight">
            Plate 1
          </h2>
        </div>
        <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
          {/* <div className="mt-2 flex items-center text-sm text-gray-300">
            <BriefcaseIcon
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500"
              aria-hidden="true"
            />
            Full-time
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-300">
            <MapPinIcon
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500"
              aria-hidden="true"
            />
            Remote
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-300">
            <CurrencyDollarIcon
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500"
              aria-hidden="true"
            />
            $120k – $140k
          </div> */}
          <div className="mt-2 flex items-center text-xs text-gray-400">
            <CalendarIcon
              className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-500"
              aria-hidden="true"
            />
            Use on January 9, 2020
          </div>
        </div>
      </div>
      <div className="mt-5 flex lg:ml-4 lg:mt-0">
        <span className="hidden sm:block">
          <button
            type="button"
            className="inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/10 "
          >
            <Cog6ToothIcon className=" h-5 w-5" aria-hidden="true" />
          </button>
        </span>
      </div>
    </div>
  );
}
