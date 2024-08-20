import { NodeTemplateProps } from '@/@types/flociety';
import { MEDIA_URL } from '@/config';
import { formatDate, formatTime } from '@/lib/formatDate';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid';
import {
  EyeIcon,
  Square2StackIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { Fragment } from 'react';

const badgeItems = [
  { name: 'Views: 2', href: '#', icon: EyeIcon },
];

export default function NodeTemplateHeader(props: NodeTemplateProps) {
  const { creator, name, version, created_at } = props;
  return (
    <div className="lg:flex lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1">
        <nav className="flex" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <div className="flex">
                <a
                  href="/flociety/nodes"
                  className="text-sm font-medium text-gray-300 hover:text-white"
                >
                  Nodes
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
                  className="ml-4 text-sm font-medium text-gray-300 hover:text-white"
                >
                  {creator?.username}
                </a>
              </div>
            </li>
          </ol>
        </nav>
        <div className="group flex items-center gap-3">
          <h2 className="mt-2 text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
            {name}
          </h2>
          <Square2StackIcon className="h-5 w-5 text-gray-300 opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100" />
        </div>
        <div className="mt-1 flex flex-col sm:mt-2 sm:flex-row sm:flex-wrap sm:space-x-2">
          <div className="-mx-2 mt-2 flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm text-gray-300 transition-all duration-300 ease-in-out hover:bg-white/5">
            <img
              src={MEDIA_URL + creator?.avatar}
              alt="avatar"
              className="h-4 w-4 rounded-full"
            />
            <span className="w-fit text-xs font-semibold">
              {creator?.username}
            </span>
          </div>
          <div className="-mx-2 mt-2 flex cursor-pointer items-center rounded px-2 py-1 text-sm text-gray-300 transition-all duration-300 ease-in-out hover:bg-white/5">
              <TagIcon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500"
                aria-hidden="true"
              />
              Version: {version}
            </div>
            <div className="-mx-2 mt-2 flex cursor-pointer items-center rounded px-2 py-1 text-sm text-gray-300 transition-all duration-300 ease-in-out hover:bg-white/5">
              <CalendarIcon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500"
                aria-hidden="true"
              />
                Release: {formatTime(created_at, 'YYYY-MM-DD')}
            </div>
          {badgeItems.map((item) => (
            <div className="-mx-2 mt-2 flex cursor-pointer items-center rounded px-2 py-1 text-sm text-gray-300 transition-all duration-300 ease-in-out hover:bg-white/5">
              <item.icon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500"
                aria-hidden="true"
              />
              {item.name}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 flex lg:ml-4 lg:mt-0">
        {/* <span className="hidden sm:block">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
          >
            <PencilIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Edit
          </button>
        </span>
        <span className="ml-3 hidden sm:block">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
          >
            <LinkIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            View
          </button>
        </span> */}
        <span className="sm:ml-3">
          <button
            type="button"
            className="hover:bg-gradient-flow hover:animate-gradient-flow inline-flex items-center rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <StarIcon
              className="-ml-0.5 mr-1.5 h-5 w-5 text-yellow-500"
              aria-hidden="true"
            />
            Starred
          </button>
        </span>

        {/* Dropdown */}
        <Menu as="div" className="relative ml-3 sm:hidden">
          <MenuButton className="inline-flex items-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20">
            More
            <ChevronDownIcon
              className="-mr-1 ml-1.5 h-5 w-5"
              aria-hidden="true"
            />
          </MenuButton>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute left-0 z-10 -ml-1 mt-2 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <MenuItem>
                {({ active }) => (
                  <a
                    href="#"
                    className={clsx(
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700',
                    )}
                  >
                    Edit
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <a
                    href="#"
                    className={clsx(
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700',
                    )}
                  >
                    View
                  </a>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}
