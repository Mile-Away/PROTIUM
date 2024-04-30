'use client';
import { usePathname } from 'next/navigation';
import React from 'react';
import { SpaceList } from './SpaceList/SpaceList';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  return (
    <div className='h-full w-full'>
      <div className="h-full xl:pl-[22rem]  ">
        <div className="h-full px-4 py-10 lg:p-6 ">{children}</div>
      </div>

      <div
        className={`${
          pathname === '/dashboard/space' ? 'block' : 'hidden'
        } xl:block relative`}
      >
        <SpaceList />
      </div>
    </div>
  );
};

export default Layout;
