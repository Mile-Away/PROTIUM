'use client';
import { SpaceProps } from '@/@types/space';
import Loading from '@/app/loading';
import { useCRUD } from '@/hooks/useCrud';
import { useEffect } from 'react';
import PinnedArticle from './PinnedArticle';
import SpaceDiscussion from './SpaceDiscussion';
const tabs = [
  { name: 'Overview', href: '#', current: false },
  { name: 'Discussion', href: '#', current: true },
  { name: 'Publications', href: '#', current: false },
  { name: 'Docs', href: '#', current: false },
  { name: 'Settings', href: '#', current: false },
];
interface SpacePageProps {
  name: string;
}

const SpacePage: React.FC<SpacePageProps> = ({ name }) => {
  const { fetchData, dataCRUD, isLoading, error } = useCRUD<SpaceProps>(
    [],
    `/server/vs/select/?by_server_name=${name}`,
  );
  useEffect(() => {
    fetchData();
  }, [name]);

  const spaceUUID = dataCRUD[0]?.uuid;
  const articles = dataCRUD[0]?.pinned_manuscript;

  if (isLoading) return <Loading />;

  return (
    <div>
      {/* 下半部分 */}
      <div className="relative flex w-full flex-col-reverse justify-center py-4 xl:h-full xl:flex-row xl:gap-x-8">
        <SpaceDiscussion space_uuid={spaceUUID} />
        {/* <div
          className="flex w-full flex-col overflow-y-hidden bg-inherit pl-0.5 xl:sticky xl:right-0
    xl:top-0 xl:h-[calc(100vh-7rem)] xl:w-64 xl:overflow-y-auto 2xl:w-96"
        >
          <PinnedArticle articles={articles} />
        </div> */}
      </div>
    </div>
  );
};

export default SpacePage;
