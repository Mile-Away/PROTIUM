import { genClickMaterialDir } from '@/app/(dashboard)/environment/laboratory/[uuid]/materials/[...dirs]/TreeSortable/utilities';
import ReSureModal from '@/components/notification/ReSureModal';
import { MaterialStateProps } from '@/store/environment/materialSlice';
import { UniqueIdentifier } from '@dnd-kit/core';
import { Switch } from '@headlessui/react';
import { CalendarIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import {
  BeakerIcon,
  InboxIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function MatHeader({
  showReady = true,
  uuid,
  type,
  dirs,
}: {
  showReady?: boolean;
  uuid?: string;
  type?: MaterialStateProps['items'][0]['type'];
  dirs: UniqueIdentifier[];
}) {
  const currentUrl = usePathname();
  const [ready, setReady] = useState(false);

  const [isOpenMoal, setIsOpenModal] = useState(false);
  const directions = dirs.map((dir) => decodeURIComponent(dir.toString()));

  const handleSwitch = (checked: boolean) => {
    if (checked) {
      setIsOpenModal(true);
    } else {
      setReady(checked);
    }
  };

  const handleResure = async () => {
    setIsOpenModal(false);
    setReady(true);
  }

  return (
    <div className="lg:flex lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1">
        <nav className="flex" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-2">
            {directions.map((dir, idx) => (
              <li key={dir}>
                <div className="flex items-center">
                  {idx === 0 ? null : (
                    <ChevronRightIcon
                      className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500"
                      aria-hidden="true"
                    />
                  )}
                  <Link
                    href={
                      genClickMaterialDir(
                        currentUrl,
                        directions.slice(0, idx + 1),
                      )?.toString() || '#'
                    }
                    className="text-xs font-medium text-gray-400 hover:text-white"
                  >
                    {dir}
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-2 flex items-center">
          {type === 'Plate' ? (
            <InboxIcon className="mr-2 h-6 w-6 dark:text-white" />
          ) : type === 'Repository' ? (
            <Squares2X2Icon className="mr-2 h-6 w-6 dark:text-white" />
          ) : type === 'Container' ? (
            <BeakerIcon className="mr-2 h-6 w-6 dark:text-white" />
          ) : null}
          <h2 className="text-xl font-bold leading-7 text-white sm:truncate sm:text-2xl sm:tracking-tight">
            {directions[directions.length - 1]}
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
      {showReady && (
        <div className="mt-5 flex items-center lg:ml-4 lg:mt-0">
          {ready ? (
            <div className="flex items-center">
              <svg
                className="mr-2 h-2 w-2 text-green-400"
                fill="currentColor"
                viewBox="0 0 8 8"
              >
                <circle cx="4" cy="4" r="4" />
              </svg>
              <span className="mr-2 text-sm font-semibold text-green-400">
                Ready
              </span>
            </div>
          ) : (
            // 添加一个灰色小圆点
            <div className="flex items-center">
              <svg
                className="mr-2 h-2 w-2 text-gray-400"
                fill="currentColor"
                viewBox="0 0 8 8"
              >
                <circle cx="4" cy="4" r="4" />
              </svg>
              <span className="mr-2 text-sm font-semibold text-gray-400">
                Not Ready
              </span>
            </div>
          )}
          <Switch
            checked={ready}
            onChange={(checked) => handleSwitch(checked)}
            className="group relative flex h-6 w-10 cursor-pointer rounded-full
           bg-white/10 p-1 transition-colors duration-200 ease-in-out 
           focus:outline-none data-[checked]:bg-white/10 data-[focus]:outline-1 
           data-[focus]:outline-white"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block size-4 translate-x-0 rounded-full 
            bg-white shadow-lg ring-0 transition duration-200 ease-in-out 
            group-data-[checked]:translate-x-6 group-data-[checked]:bg-green-400"
            />
          </Switch>
          <ReSureModal
            isOpen={isOpenMoal}
            onClose={() => setIsOpenModal(false)}
  
            onResure={handleResure}
          />
        </div>
      )}
    </div>
  );
}
