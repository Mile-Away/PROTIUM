'use client';
import { useCRUD } from '@/hooks/useCrud';
import { CheckCircleIcon, CheckIcon, HashtagIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import AfterLogin from './AfterLogin';
import Carousel from './Carousel';
import { ChevronDoubleRightIcon } from '@heroicons/react/20/solid';

export default function Page() {
  const { fetchData, dataCRUD, isLoading, error } = useCRUD(
    [],
    '/server/vs/select/',
  );

  useEffect(() => {
    fetchData();
  }, []);

  const labels = [
    {
      name: 'Molecule Dynamics',
      href: '#',
    },
    {
      name: 'Density Functional Theory',
      href: '#',
    },
    {
      name: 'Workflows',
      href: '#',
    },
  ];

  return (
    <div className=" mx-16 my-24 flex flex-col items-center dark:bg-neutral-900">
      <div className="my-8">
        <Carousel
          images={['/banner.jpg', '/hero4-horizen.png', '/banner.jpg']}
        />
      </div>
      <div className="my-8 flex gap-8">
        <div
          rel="sidebar"
          className="my-12 flex h-full flex-col items-start gap-2 p-2 sm:w-64"
        >
          <h2 className="text-md mb-4 font-bold text-neutral-800 dark:text-neutral-100">
            按标签浏览
          </h2>
          {labels.map((label) => (
            <button className="sliderbtn group h-auto w-full px-2 py-3">
              <div className="-pl-1 z-10 inline-flex w-full items-center justify-between">
                <div className="flex items-center justify-start gap-x-2">
                  <HashtagIcon className="h-3 w-3" />
                  <span className=" line-clamp-1 text-start text-sm">
                    {label.name}
                  </span>
                </div>

                <ChevronDoubleRightIcon className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 " />
              </div>
            </button>
          ))}
        </div>
        <div className=" flex-1">
          <AfterLogin recommendedSpaces={dataCRUD} searchedSpaces={dataCRUD} />
        </div>
      </div>
    </div>
  );
}
