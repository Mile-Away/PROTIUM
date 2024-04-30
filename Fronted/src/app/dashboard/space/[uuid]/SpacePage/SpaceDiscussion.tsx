import { DiscussionProps, SpaceProps } from '@/@types/space';
import { useCRUD } from '@/hooks/useCrud';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

import { useEffect, useState } from 'react';
import CreateDiscussion from '../CreateDiscussion/CreateDiscussion';

import SortButton from './SortButton';

import DiscussionList from '@/components/DiscussionList';

import { SelectDropdownOptionsProps } from '@/components/SelectDropdown';

const options: SelectDropdownOptionsProps[] = [
  {
    title: 'Default',
    description: 'Sort by oldest creation time',
    current: true,
  },
  {
    title: 'Activity',
    description: 'Sort by latest conversation timestamp',
    current: false,
  },
  {
    title: 'Created',
    description: 'Sort by most recent creation time',
    current: false,
  },
];

const SpaceDiscussion = ({ space_uuid }: { space_uuid: string }) => {
  // 还需要为列表加上 With badges, button, and actions menu 的 badges，
  const [openCreateDiscussion, setOpenCreateDicussion] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [sort, setSort] = useState(options[0]);
  // const [selected, setSelected] = useState(options[0]);
  let discussions = [] as DiscussionProps[];

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const { fetchData, dataCRUD, isLoading, error } = useCRUD<SpaceProps>(
    [],
    `/server/vs/select/?by_serverid=${space_uuid}`,
  );
  useEffect(() => {
    if (space_uuid) {
      fetchData();
    }
  }, [space_uuid, refresh]);

  if (sort === options[2]) {
    discussions = dataCRUD[0]?.channel_server.sort(
      (a, b) =>
        new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime(),
    );
  } else if (sort === options[1]) {
    discussions = dataCRUD[0]?.channel_server.sort((a, b) => {
      const aTimestamp = a.latest_message
        ? new Date(a.latest_message.timestamp).getTime()
        : 0;
      const bTimestamp = b.latest_message
        ? new Date(b.latest_message.timestamp).getTime()
        : 0;

      return bTimestamp - aTimestamp;
    });
  } else {
    discussions = dataCRUD[0]?.channel_server.sort(
      (a, b) =>
        new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime(),
    );
  }

  return (
    <div className="relative flex-1">
      <div className=" sticky left-0 right-0 top-16 z-10 flex h-8 items-center justify-between bg-white/90 pb-6 pt-10 backdrop-blur-sm dark:bg-neutral-900/80">
        <h1 className="text-xl font-bold ">Discussions</h1>
        <div className="mt-0 flex">
          <div className="flex space-x-2">
            <label htmlFor="mobile-search-candidate" className="sr-only">
              Search
            </label>

            <div className="flex rounded-md shadow-sm">
              {/* <DiscussionSearch /> */}
              <SortButton
                selected={sort}
                setSelected={setSort}
                options={options}
              />
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => setOpenCreateDicussion(true)}
            >
              Create
              <PlusCircleIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <div className="">
        {discussions && discussions.length > 0 ? (
          <DiscussionList space_uuid={space_uuid} discussions={discussions} />
        ) : (
          <p className="mt-8 text-base font-semibold text-gray-400">
            {' '}
            None yet.
          </p>
        )}
      </div>
      <CreateDiscussion
        open={openCreateDiscussion}
        onClose={() => setOpenCreateDicussion(false)}
        server={space_uuid}
        onCreateSuccess={handleRefresh}
      />
    </div>
  );
};

export default SpaceDiscussion;
