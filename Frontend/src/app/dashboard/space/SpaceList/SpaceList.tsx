'use client';

import AllSpaceList from './AllSpaceList';
import MySpaceList from './MySpaceList';

export const SpaceList = (props: React.ComponentPropsWithoutRef<'aside'>) => {
  return (
    <aside
      className="fixed bottom-0 top-16 w-full lg:w-fit xl:w-[22rem] overflow-y-auto border-r border-gray-200
    border-opacity-50 px-4 py-6 transition-all duration-300 ease-in-out
     dark:border-neutral-700 inert lg:p-6"
      {...props}
    >
      <nav className="h-full" aria-label="Directory">
        <MySpaceList />
        <AllSpaceList />
      </nav>
    </aside>
  );
};