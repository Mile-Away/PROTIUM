'use client';
import { SpaceProps } from '@/@types/space';
import { useCRUD } from '@/hooks/useCrud';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MessageInterface from './MessageInterface';
import SideDiscussionInfo from './SideDiscussionInfo';

const DiscussionPage = ({ params }: { params: { uuid: string[] } }) => {
  const router = useRouter();
  const spaceId = params.uuid[0];
  const discussionId = params.uuid[1];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSideOpen, setDesktopSideOpen] = useState(true);

  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };


  const { fetchData, dataCRUD, isLoading, error } = useCRUD<SpaceProps>(
    [],
    `/server/vs/select/?by_serverid=${spaceId}&named=true`,
  );

  useEffect(() => {
    if (discussionId) {
      fetchData();
    }
  }, [spaceId, refresh]);

  const discussion = dataCRUD[0]?.channel_server.find(
    (channel) => channel.uuid.toString() === discussionId,
  );

  const discussionName = discussion?.name;
  const discussionDescription = discussion?.description;
  const discussionOwner = discussion?.owner;
  const discussionAdmins = discussion?.admins;

  return (
    <div className="h-full">
      <div
        className={clsx(
          'h-full transition-all duration-300 ease-in-out',
          desktopSideOpen ? 'xl:mr-80' : 'mr-0',
        )}
      >
        <div className="sticky z-10 flex h-8 items-center justify-between bg-transparent pb-4 ">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back to articles"
            className="rounded-fullshadow-md group flex h-6 w-6 items-center justify-center"
          >
            <ArrowLeftIcon className="h-5 w-5 fill-zinc-500 transition group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-400" />
          </button>
          <span className="ml-2 flex gap-6 font-bold text-slate-900 dark:text-slate-50">
            {dataCRUD[0]?.name}
            <span aria-hidden="true" className="text-slate-400">
              /
            </span>
            {discussionName && discussionName}
          </span>
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Go back to articles"
            className="rounded-fullshadow-md group flex h-6 w-6 items-center justify-center xl:hidden "
          >
            <EllipsisVerticalIcon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-900 dark:fill-zinc-500 dark:group-hover:fill-zinc-200" />
          </button>
          <button
            type="button"
            onClick={() => setDesktopSideOpen(!desktopSideOpen)}
            aria-label="Go back to articles"
            className="rounded-fullshadow-md group hidden h-6 w-6 items-center justify-center xl:flex "
          >
            <EllipsisVerticalIcon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-900 dark:fill-zinc-500 dark:group-hover:fill-zinc-200" />
          </button>
        </div>
        <MessageInterface discussionUUID={discussionId} />
      </div>
      <SideDiscussionInfo
        isDesktopOpen={desktopSideOpen}
        onDesktopClose={() => setDesktopSideOpen(false)}
        isMobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
        channelUUID={discussionId}
        serverUUID={spaceId}
        discussionName={discussionName!}
        description={discussionDescription!}
        owner={discussionOwner!}
        admins={discussionAdmins!}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default DiscussionPage;
