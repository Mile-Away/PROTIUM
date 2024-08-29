'use client';
import { SpaceProps } from '@/@types/space';
import Loading from '@/app/loading';
import { GitHubIcon } from '@/components/SocialIcons';
import { UserInfoButton } from '@/components/UserInfoButton';
import { MEDIA_URL } from '@/config';
import { useCRUD } from '@/hooks/useCrud';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';
const SpaceHero = ({ name }: { name: string }) => {
  const { fetchData, dataCRUD, isLoading, error } = useCRUD<SpaceProps>(
    [],
    `/server/vs/select/?by_server_name=${name}`,
  );
  useEffect(() => {
    if (name) fetchData();
  }, [name]);

  const spaceUUID = dataCRUD[0]?.uuid;
  const articles = dataCRUD[0]?.pinned_manuscript;

  if (isLoading) return <Loading />;
  
  return (
    <div className="relative z-10 flex flex-col items-center justify-between gap-x-8 gap-y-4 rounded-xl bg-neutral-50/40  p-8 shadow dark:bg-black/40 md:flex-row">
      {/* Background */}
      <div
        className="absolute bottom-0 left-1/2 right-0 top-1/2 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
        aria-hidden="true"
      >
        <div
          className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
          }}
        />
      </div>

      <div className="lg:w-1/2">
        {/* icon 和 标题 */}
        <div className="flex items-center space-x-4">
          {dataCRUD[0]?.icon && (
            <img
              alt="icon"
              src={MEDIA_URL + dataCRUD[0]?.icon}
              className="h-10 w-10"
            />
          )}
          <h1 className="inline bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-indigo-400 dark:via-indigo-600 dark:to-indigo-300">
            {dataCRUD[0]?.name}
          </h1>
        </div>
        {/* 描述 */}
        <p className="mt-6 line-clamp-3 text-base text-neutral-800 dark:text-neutral-300">
          {dataCRUD[0]?.description}
        </p>
        {(dataCRUD[0]?.document_url || dataCRUD[0]?.github_url) && (
          <div className="my-8 flex justify-start gap-4">
            {dataCRUD[0]?.document_url && (
              <button
                className="group inline-flex flex-nowrap items-center justify-center rounded-full  bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 hover:text-neutral-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 active:bg-neutral-800 active:text-neutral-300                      dark:bg-indigo-700 dark:hover:bg-indigo-600"
                onClick={() => window.open(dataCRUD[0]?.document_url, '_blank')}
              >
                <DocumentTextIcon className="mr-2 hidden h-5 w-5 sm:block" />
                Read Docs
              </button>
            )}
            {dataCRUD[0]?.github_url && (
              <button
                onClick={() => window.open(dataCRUD[0]?.github_url, '_blank')}
                className="group inline-flex flex-nowrap items-center justify-center
                 rounded-full px-4 py-2 text-sm text-neutral-700       
                   ring-1 ring-neutral-200 hover:text-neutral-900 hover:ring-neutral-300 focus:outline-none                    focus-visible:outline-blue-600 focus-visible:ring-neutral-300                     active:bg-neutral-100 active:text-neutral-600                     dark:text-neutral-100 dark:ring-neutral-800                       dark:hover:text-neutral-200 dark:hover:ring-neutral-700 dark:focus-visible:ring-neutral-800 dark:active:bg-neutral-800 dark:active:text-neutral-200"
              >
                <GitHubIcon className="mr-2 h-5 w-5" />
                View Github
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
        <div className="relative hidden h-fit rounded-xl bg-[#0A101F]/80 ring-1 ring-white/10 backdrop-blur md:w-1/2 lg:block">
          <div className="absolute -top-px left-20 right-11 h-px bg-gradient-to-r from-blue-300/0 via-blue-300/70 to-blue-300/0"></div>
          <div className="absolute -bottom-px left-11 right-20 h-px bg-gradient-to-r from-indigo-400/0 via-indigo-400 to-indigo-400/0"></div>
          <img
            alt="banner"
            src={MEDIA_URL + dataCRUD[0]?.banner}
            className=" h-full w-full rounded-xl object-contain shadow-lg md:object-cover xl:max-h-[312px]"
          />
          {/* <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neutral-900 via-transparent  to-neutral-900"></div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-neutral-900 via-transparent  to-neutral-900"></div> */}
        </div>
      )}
    </div>
  );
};

export default SpaceHero;
