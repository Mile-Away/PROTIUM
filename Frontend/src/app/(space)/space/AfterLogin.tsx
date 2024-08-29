'use client';
import { SpaceProps } from '@/@types/space';
import { UserInfoButton } from '@/components/UserInfoButton';
import { MEDIA_URL } from '@/config';
import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

interface AfterLoginProps {
  recommendedSpaces: SpaceProps[];
  searchedSpaces: SpaceProps[];
}

const AfterLogin: React.FC<AfterLoginProps> = ({
  recommendedSpaces,
  searchedSpaces,
}) => {
  return (
    <>
      {/* Personal Recommand */}

      {/* Social Recommand */}
      {/* <div className="my-12">
        <h1 className="mb-8 font-display text-4xl font-semibold text-indigo-600 dark:text-indigo-400">
          What to explore next
        </h1>
        <h2 className="mb-4 text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Our top pick for you
        </h2>
        <div>
          <TopPicker
            title="Django Celery Mastery: Python Asynchronous Task Processing"
            author="By Very Academy"
            updatedDate="Updated July 2023"
            totalHours={8}
            lectures={50}
            level="All Levels"
            rating={4.1}
            ratingCount={178}
            price={11.99}
            originalPrice={74.99}
          />
        </div>
      </div> */}
      <div className="">
        <h2 className="mb-8 text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Recommended for you
        </h2>
        <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {recommendedSpaces.map((space, index) => (
            <Link
              key={index}
              href={`/space/${space.name}`}
              className={clsx(
                'rounded-lg bg-white shadow-md dark:bg-neutral-800',
                'cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl',
                'border dark:border-neutral-700/10',
                'flex flex-col'
              )}
            >
              {space.banner && (
                <img
                  src={`${MEDIA_URL}${space.banner}`}
                  alt={space.name}
                  className="w-full rounded-t-lg object-cover object-center md:h-36"
                />
              )}

              <div className="flex flex-col gap-2 justify-between flex-1 p-4">
                <div className='mb-8'>
                  <div className="mb-2 flex items-center gap-x-2">
                    {space.icon && (
                      <img
                        src={`${MEDIA_URL}${space.icon}`}
                        className="h-5 w-5 rounded"
                        alt={space.name}
                      />
                    )}
                    <h3 className="line-clamp-3 text-lg font-semibold text-neutral-800 dark:text-white">
                      {space.name}
                    </h3>
                  </div>

                  <div>
                    <p className=" line-clamp-3 text-xs dark:text-neutral-400">
                      {space.description}
                    </p>
                  </div>

                  <UserInfoButton
                    username={space.owner}
                    star
                    className="pl-0"
                  />
                </div>

                {/* <div className="mb-2 flex items-center">
                  {renderStarRating(space.rating)}
                  <span className="ml-1 text-sm text-neutral-600 dark:text-neutral-400">
                    ({space.ratingCount})
                  </span>
                </div> */}

                <div className="flex items-center">
                  {
                    <span className="mr-2 rounded-full bg-indigo-600 px-2 py-1 text-xs font-semibold text-white dark:bg-indigo-400 dark:text-neutral-800">
                      Molecule Dynamics
                    </span>
                  }
                  {/* <span className="text-sm text-neutral-600 line-through dark:text-neutral-400">
                  ${course.price}
                </span>
                <span className="ml-2 font-semibold text-indigo-600 dark:text-indigo-400">
                  ${course.salePrice}
                </span> */}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* <h2 className="mb-8 text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Because you searched for{' '}
          <span className=" text-indigo-500 underline">"DeePMD"</span>
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"></div> */}
      </div>
    </>
  );
};

export default AfterLogin;
