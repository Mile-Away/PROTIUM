'use client';
import { SpaceProps } from '@/@types/space';
import Loading from '@/app/loading';
import { useCRUD } from '@/hooks/useCrud';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { useEffect } from 'react';
import SpaceLi from './SpaceLi';

const MySpaceList = () => {
  const { fetchData, dataCRUD, isLoading, error } = useCRUD<SpaceProps>(
    [],
    '/server/vs/select/?by_user=true',
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Disclosure defaultOpen={dataCRUD ? true : false}>
          {({ open }) => (
            <>
              <Disclosure.Button
                className=" flex w-full justify-between rounded-lg
               bg-blue-100 px-4 py-2 text-left text-sm font-medium
                text-blue-900 transition-transform duration-500
                 hover:bg-blue-200 focus:outline-none focus-visible:ring
                  focus-visible:ring-blue-500/75 dark:bg-blue-800
                   dark:text-blue-100"
              >
                <span>Your Spaces</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-blue-500 transition-transform duration-500 dark:text-blue-400`}
                />
              </Disclosure.Button>
              <Transition
                enter="transition duration-150 ease-linear"
                enterFrom="transform -translate-y-4 opacity-0"
                enterTo="transform translate-y-0 opacity-100"
                leave="transition duration-150 ease-linear"
                leaveFrom="transform translate-y-0 opacity-100"
                leaveTo="transform -translate-y-4 opacity-0"
              >
                <Disclosure.Panel className="pb-2 pt-4 text-sm ">
                  {dataCRUD.length > 0 ? (
                    <ul className="duration-500 animate-in slide-in-from-top-2">
                      {dataCRUD.map((space) => (
                        <SpaceLi key={space.uuid} {...space} />
                      ))}
                    </ul>
                  ) : (
                    <p className="px-4 py-3 text-gray-900 duration-500 animate-in slide-in-from-top-2 dark:text-gray-100">
                      None yet.
                    </p>
                  )}
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      )}
    </>
  );
};

export default MySpaceList;
