'use client';

import { SpaceProps } from '@/@types/space';
import { useCRUD } from '@/hooks/useCrud';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { useEffect } from 'react';
import SpaceLi from './SpaceLi';

const AllSpaceList = () => {
  const { fetchData, dataCRUD, isLoading, error } = useCRUD<SpaceProps>(
    [],
    '/server/vs/select/',
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Disclosure as="div" className="mt-2" defaultOpen={true}>
      {({ open }) => (
        <>
          {dataCRUD.length > 0 && (
            <>
              <Disclosure.Button
                as="button"
                className="mt-6 flex w-full justify-between rounded-lg
           bg-indigo-100 px-4 py-2 text-left text-sm font-medium text-indigo-900
             hover:bg-indigo-200 focus:outline-none
           focus-visible:ring focus-visible:ring-indigo-500/75 dark:bg-indigo-800 dark:text-indigo-100"
              >
                <span>Popular Spaces ...</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-indigo-500 transition-transform duration-500 dark:text-indigo-400`}
                />
              </Disclosure.Button>
              <Transition
                enter="transition duration-300 ease-linear"
                enterFrom="transform -translate-y-4 opacity-0"
                enterTo="transform translate-y-0 opacity-100"
                leave="transition duration-300 ease-out"
                leaveFrom="transform translate-y-0 opacity-100"
                leaveTo="transform -translate-y-4 opacity-0"
              >
                <Disclosure.Panel className=" pb-2 pt-4 text-sm text-gray-500">
                  {/* 内容 */}

                  <ul className="">
                    {dataCRUD.map((space) => (
                      <SpaceLi key={space.uuid} {...space} />
                    ))}
                  </ul>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </>
      )}
    </Disclosure>
  );
};

export default AllSpaceList;
