'use client';
import { useCRUD } from '@/hooks/useCrud';
import React, { useEffect } from 'react';
import SideInfo from './SideInfo';

import { SpaceProps } from '@/@types/space';

const Layout = ({
  children,
  params,
}: {
  params: { uuid: string[] };
  children: React.ReactNode;
}) => {
  const spaceId = params.uuid[0];

  const { fetchData, dataCRUD, isLoading, error } = useCRUD<SpaceProps>(
    [],
    `/server/vs/select/?by_serverid=${spaceId}&named=true`,
  );

  useEffect(() => {
    if (spaceId) {
      fetchData();
    }
  }, [spaceId]);

  const spaceInfo = dataCRUD[0];

  return (
    <>
      <div className="relative h-full lg:pl-96 ">
        <div className="h-[calc(100vh-5rem)] px-4 pb-10 pt-5 lg:p-6">
          {children}
        </div>
      </div>
      {spaceInfo && <SideInfo spaceInfo={spaceInfo} />}
    </>
  );
};

export default Layout;
