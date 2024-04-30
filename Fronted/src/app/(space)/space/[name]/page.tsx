'use client';
import { SpaceProps } from '@/@types/space';
import Loading from '@/app/loading';
import { useCRUD } from '@/hooks/useCrud';
import clsx from 'clsx';
import { useEffect } from 'react';
import SpaceOverview from './SpaceOverview';
import PinnedArticle from './SpacePage/PinnedArticle';

const Page = ({ params }: { params: { name: string } }) => {
  const { name } = params;
  const { fetchData, dataCRUD, isLoading, error } = useCRUD<SpaceProps>(
    [],
    `/server/vs/select/?by_server_name=${name}`,
  );
  useEffect(() => {
    if (name) {
      fetchData();
    }
  }, [name]);

  const spaceUUID = dataCRUD[0]?.uuid;
  const articles = dataCRUD[0]?.pinned_manuscript;
  const readmeUUID = dataCRUD[0]?.readme;

  if (isLoading) return <Loading />;

  return (
    <div>
      {/* 下半部分 */}
      <div className="flex w-full flex-col-reverse justify-center gap-y-8 py-4 xl:h-full xl:flex-row xl:space-x-8">
        <SpaceOverview uuid={readmeUUID} />
        <div
          className={clsx(
            'flex w-full flex-col overflow-y-hidden bg-inherit pl-0.5 xl:sticky xl:right-0',
            'xl:top-20 xl:h-[calc(100vh-7rem)] xl:w-64 xl:min-w-[16rem] xl:overflow-y-auto 2xl:w-96 2xl:min-w-[24rem]',
          )}
        >
          <PinnedArticle articles={articles} />
        </div>
      </div>
    </div>
  );
};

export default Page;
