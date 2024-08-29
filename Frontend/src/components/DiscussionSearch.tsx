import Search from '@/components/search/Search';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
const DiscussionSearch = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="relative flex-grow focus-within:z-10">
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
          className=" w-full rounded-md border-0 py-1.5 pl-10 text-sm leading-6
                    text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400
                     hover:bg-neutral-50 focus:outline-none dark:bg-inherit
                        dark:text-white dark:ring-gray-700
                         dark:hover:bg-neutral-800 "
          placeholder="Search discussions"
          onClick={() => setOpen(true)}
        />
      </div>

      <Search open={open} setOpen={setOpen} showRecent={false} />
    </>
  );
};

export default DiscussionSearch;
