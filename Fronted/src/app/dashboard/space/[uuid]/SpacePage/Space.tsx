'use client';
import { SpaceProps } from '@/@types/space';
import Loading from '@/app/loading';
import { UserInfoButton } from '@/components/UserInfoButton';
import { MEDIA_URL } from '@/config';
import { useCRUD } from '@/hooks/useCrud';
import Link from 'next/link';
import { useEffect } from 'react';
import PinnedArticle from './PinnedArticle';
import SpaceDiscussion from './SpaceDiscussion';

interface SpacePageProps {
  uuid: string;
}

const SpacePage: React.FC<SpacePageProps> = ({ uuid }) => {
  const { fetchData, dataCRUD, isLoading, error } = useCRUD<SpaceProps>(
    [],
    `/server/vs/select/?by_serverid=${uuid}`,
  );
  useEffect(() => {
    fetchData();
  }, [uuid]);

  const spaceUUID = uuid;
  const articles = dataCRUD[0]?.pinned_manuscript;

  if (isLoading) return <Loading />;

  return (
    <div className="flex  h-full flex-col">
      {/* 上部分 */}
      <div className="flex flex-col items-center justify-between gap-x-8 gap-y-4 px-4 md:flex-row">
        <div className="md:w-1/2">
          {/* icon 和 标题 */}
          <div className="flex items-center space-x-4">
            <img
              alt="icon"
              src={MEDIA_URL + dataCRUD[0]?.icon}
              className="h-6 w-6"
            />
            <h1 className="inline bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-indigo-400 dark:via-indigo-600 dark:to-indigo-300">
              {dataCRUD[0]?.name}
            </h1>
          </div>
          {/* 描述 */}
          <p className="mt-3 line-clamp-3 text-base tracking-tight text-slate-400">
            {dataCRUD[0]?.description}
          </p>
          {(dataCRUD[0]?.document_url || dataCRUD[0]?.github_url) && (
            <div className="my-8 flex justify-start gap-4">
              {dataCRUD[0]?.document_url && (
                <button
                  className="group inline-flex items-center justify-center rounded-full  bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 hover:text-slate-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 active:bg-slate-800 active:text-slate-300                      dark:bg-indigo-700 dark:hover:bg-indigo-600"
                  onClick={() =>
                    window.open(dataCRUD[0]?.document_url, '_blank')
                  }
                >
                  Read Docs
                </button>
              )}
              {dataCRUD[0]?.github_url && (
                <button
                  onClick={() => window.open(dataCRUD[0]?.github_url, '_blank')}
                  className="group inline-flex items-center justify-center rounded-full px-4 py-2 text-sm text-slate-700                     ring-1 ring-slate-200 hover:text-slate-900 hover:ring-slate-300 focus:outline-none                    focus-visible:outline-blue-600 focus-visible:ring-slate-300                     active:bg-slate-100 active:text-slate-600                     dark:text-slate-100 dark:ring-slate-800                       dark:hover:text-slate-200 dark:hover:ring-slate-700 dark:focus-visible:ring-slate-800 dark:active:bg-slate-800 dark:active:text-slate-200"
                >
                  View on Github
                </button>
              )}
            </div>
          )}
          {/* 成员 */}
          <div className="inert flex flex-nowrap items-center space-x-2 overflow-x-auto">
            <div className="flex-shrink-0">
              <UserInfoButton username={dataCRUD[0]?.owner} star />
            </div>
            {dataCRUD[0]?.members
              .filter((member) => member !== dataCRUD[0]?.owner)
              .map((member) => (
                <div key={member} className="flex-shrink-0">
                  <UserInfoButton key={member} username={member} />
                </div>
              ))}
          </div>
        </div>
        {dataCRUD[0]?.banner && (
          <div className="relative h-fit rounded-2xl bg-[#0A101F]/80 ring-1 ring-white/10 backdrop-blur md:w-1/2">
            <div className="absolute -top-px left-20 right-11 h-px bg-gradient-to-r from-blue-300/0 via-blue-300/70 to-blue-300/0"></div>
            <div className="absolute -bottom-px left-11 right-20 h-px bg-gradient-to-r from-indigo-400/0 via-indigo-400 to-indigo-400/0"></div>
            <img
              alt="banner"
              src={MEDIA_URL + dataCRUD[0]?.banner}
              className=" h-full w-full rounded-2xl object-contain md:object-cover xl:max-h-[256px]"
            />
            {/* <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neutral-900 via-transparent  to-neutral-900"></div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-neutral-900 via-transparent  to-neutral-900"></div> */}
          </div>
        )}
      </div>

      {/* 下半部分 */}
      <div className="relative mt-8 flex w-full flex-col-reverse justify-center p-4 sm:px-2 lg:px-4 xl:flex-row xl:space-x-8">
        <SpaceDiscussion space_uuid={spaceUUID} />

        <PinnedArticle articles={articles} />
      </div>
      {/* Footer */}
      <footer className="mx-4 mt-32 flex-none">
        <div className="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              <Link
                className="transition hover:text-indigo-500 dark:hover:text-indigo-400"
                href="/"
              >
                Home
              </Link>
              <Link
                className="transition hover:text-indigo-500 dark:hover:text-indigo-400"
                href="/about"
              >
                About
              </Link>
              <Link
                className="transition hover:text-indigo-500 dark:hover:text-indigo-400"
                href="#"
              >
                Tutorial
              </Link>
              <Link
                className="transition hover:text-indigo-500 dark:hover:text-indigo-400"
                href="#"
              >
                Projects
              </Link>
            </div>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              &copy; {new Date().getFullYear()} Protium. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SpacePage;
