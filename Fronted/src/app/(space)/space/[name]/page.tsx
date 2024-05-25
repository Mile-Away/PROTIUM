'use client';
import { SpaceProps } from '@/@types/space';
import Loading from '@/app/loading';
import { BASE_URL, PrimarySite } from '@/config';
import useAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { useCRUD } from '@/hooks/useCrud';
import { formatTime } from '@/lib/formatDate';
import { TagIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SpaceOverview from './SpaceOverview';
import PinnedArticle from './SpacePage/PinnedArticle';

const Page = ({ params }: { params: { name: string } }) => {
  const { name } = params;
  const { fetchData, dataCRUD, isLoading, error } = useCRUD<SpaceProps>(
    [],
    `/server/vs/select/?by_server_name=${name}`,
  );

  const jwtAxios = useAxiosWithInterceptors();

  const [releaseOverview, setReleaseOverview] = useState<{
    name: string;
    total_count: number;
    url: string;
    published_at: string;
  } | null>();

  const fetchLocalReleases = async () => {
    const res = await jwtAxios.get(
      `${BASE_URL}/integration/vs/github-releases/?server=${name}&overview=true`,
    );
    const data = await res.data;

    setReleaseOverview(data);
  };

  useEffect(() => {
    if (name) {
      fetchData();
      fetchLocalReleases();
    }
  }, [name]);

  const release_url = `${PrimarySite}/space/${name}/releases`;

  const spaceUUID = dataCRUD[0]?.uuid;
  const articles = dataCRUD[0]?.pinned_manuscript;
  const readmeUUID = dataCRUD[0]?.readme?.uuid;

  if (isLoading) return <Loading />;

  return (
    <div>
      {/* 下半部分 */}
      <div className="flex w-full flex-col-reverse justify-center gap-y-8 py-4 xl:h-full xl:flex-row xl:space-x-8">
        <SpaceOverview uuid={readmeUUID} />
        <div
          className={clsx(
            'flex w-full flex-row items-start gap-4 overflow-y-hidden bg-inherit py-6 pl-0.5 xl:sticky xl:right-0 xl:flex-col',
            'xl:top-20 xl:h-[calc(100vh-7rem)] xl:w-64 xl:min-w-[16rem] xl:overflow-y-auto 2xl:w-96 2xl:min-w-[24rem]',
          )}
        >
          {dataCRUD[0]?.enable_releases && releaseOverview && (
            <div className="hidden flex-col xl:flex ">
              <div className=" z-10 flex w-full items-center  gap-4 bg-white pb-6 dark:bg-neutral-900">
                <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Pinned Articles
                </h1>
                <div>
                  <Link
                    href={release_url}
                    className=" -m-1.5 rounded-full p-1.5 text-xs font-semibold dark:bg-neutral-700"
                  >
                    {releaseOverview.total_count.toString()}
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-4 px-4">
                <div className="flex items-start gap-2">
                  <TagIcon className=" mt-1 h-6 w-6 dark:text-teal-500" />
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Link
                        href={release_url}
                        className=" text-xl font-semibold text-indigo-600 hover:text-teal-600 dark:text-white hover:dark:text-teal-400"
                      >
                        {releaseOverview.name}
                      </Link>
                      <div className="rounded-2xl px-2 py-1 text-xs font-semibold text-teal-600 ring-1 ring-teal-600 dark:text-teal-500 dark:ring-teal-500 ">
                        Latest
                      </div>
                    </div>
                    <div className=" text-xs dark:text-neutral-400">
                      {formatTime(
                        releaseOverview.published_at,
                        'YYYY-MM-DD',
                        true,
                      )}
                    </div>
                  </div>
                </div>
                {releaseOverview.total_count > 1 && (
                  <div className="text-sm text-blue-500 hover:underline ">
                    <Link href={release_url}>
                      + {releaseOverview.total_count - 1} releases{' '}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
          <PinnedArticle articles={articles} />
        </div>
      </div>
    </div>
  );
};

export default Page;
