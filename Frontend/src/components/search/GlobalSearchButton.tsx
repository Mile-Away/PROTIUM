import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useState } from 'react';
import SearchGlobal from './SearchGlobal';

const GlobalSearchButton = () => {
  const [openSearch, setOpenSearch] = useState(false);
  return (
    <>
      <div
        className={clsx(
          'relative -m-2 mr-2 flex w-30 cursor-pointer items-center space-x-2 rounded-md bg-inherit px-1 py-1',
          'text-gray-500 hover:text-gray-900  dark:text-gray-400 dark:hover:text-white',
          ' transition-colors duration-200 ease-in-out',
        )}
        onClick={() => setOpenSearch(true)}
      >

        <MagnifyingGlassIcon
          className="pointer-events-none h-7 w-7 "
          aria-hidden="true"
        />
        <span
          id="search-field"
          className=" h-full w-full bg-transparent text-sm"
        >
          Search...
        </span>
      </div>
      <SearchGlobal open={openSearch} setOpen={setOpenSearch} />
    </>
  );
};

export default GlobalSearchButton;
