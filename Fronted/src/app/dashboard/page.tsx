'use client';
import { PageProps } from '@/@types/article';

import { Footer } from '@/app/(home)/articles/Footer';
import Loading from '@/app/loading';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';

import { useDictCRUD } from '@/hooks/useCrud';

import Article from '@/components/Article';
import { ArrowUpRightIcon, HandThumbUpIcon } from '@heroicons/react/20/solid';
import { type ImageProps } from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 7.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
      />
      <path
        d="m4 6 6.024 5.479a2.915 2.915 0 0 0 3.952 0L20 6"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  );
}

function Newsletter() {
  return (
    <form
      action="/thank-you"
      className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40"
    >
      <h2 className="mt-8 flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <MailIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Join DeepModeling</span>
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Join DeepModeling to participate in building the tutorial and gain the
        rewards. <br />
        <span className="mt-2 block">
          Send your email address and we will contact you as soon as possible.
        </span>
      </p>
      <div className="mt-6 flex">
        <input
          type="email"
          placeholder="Email address"
          aria-label="Email address"
          required
          className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400 dark:focus:ring-teal-400/10 sm:text-sm"
        />
        <Button type="submit" name="Join" className="ml-4 flex-none">
          Join
        </Button>
      </div>
    </form>
  );
}

interface Role {
  company: string;
  title: string;
  logo: ImageProps['src'];
  start: string | { label: string; dateTime: string };
  end: string | { label: string; dateTime: string };
}

const Page = () => {
  const { t } = useTranslation('translation');
  const { dataCRUD, error, isLoading, fetchData } = useDictCRUD<PageProps>(
    {} as PageProps,
    '/document/vs/document/?is_public=true&page_size=5',
  );

  useEffect(() => {
    fetchData();
  }, []);

  const articles = dataCRUD.results || [];

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Container className="mt-12">
            <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
              <div className="flex flex-col gap-16">
                <div className="flex items-end  justify-between text-lg font-bold">
                  <span>{t('Recently Published Articles')}</span>

                  <Link
                    href="/articles"
                    className="-m-2 flex items-center rounded-xl px-3 py-2 text-sm text-gray-600 opacity-70 hover:bg-sky-50 hover:text-teal-600 hover:opacity-100 dark:text-white dark:hover:bg-neutral-800 dark:hover:text-teal-400"
                  >
                    <span className="mr-1 hidden sm:flex">{t('Read')}</span>
                    <span>{t('More')}</span>
                    <ArrowUpRightIcon className="ml-2 h-5 w-5 sm:flex" />
                  </Link>
                </div>
                {articles.map((article) => (
                  <Article key={article.uuid} article={article} />
                ))}
              </div>

              <div className="space-y-10 lg:pl-16 xl:pl-24">
                <div className=" relative">
                  <div className="pointer-events-none relative w-full select-none rounded-xl bg-white opacity-40 shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.20),_0px_1px_0px_0px_rgba(255,_255,_255,_0.06)_inset] forced-colors:outline">
                    <Newsletter />
                  </div>
                  <div className="absolute left-3 top-3 rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-sm/6 font-semibold text-indigo-700 backdrop-blur-[12px] dark:text-indigo-400">
                    Coming soon
                  </div>
                </div>

                <div className="relative">
                  <div className="pointer-events-none relative h-full w-full select-none rounded-xl bg-white opacity-40 shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.20),_0px_1px_0px_0px_rgba(255,_255,_255,_0.06)_inset] forced-colors:outline">
                    <form
                      action="/thank-you"
                      className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40"
                    >
                      <h2 className="mt-8 flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        <HandThumbUpIcon className="h-4 w-4 flex-none" />
                        <span className="ml-3">Recently Tutorial</span>
                      </h2>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        Waiting for your tutorial to be published.
                        <br />
                        <span className="mt-2 block">
                          你可以将你发布的文档绑定到教程的不同章节，帮助用户更好地理解教程，当用户阅读你的文档时，你也将获得相应的奖励。
                        </span>
                      </p>
                      <div className="mt-6 flex">
                        <input
                          type="email"
                          placeholder="Bind your document to tutorial"
                          aria-label="Email address"
                          required
                          className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400 dark:focus:ring-teal-400/10 sm:text-sm"
                        />
                        <Button
                          type="submit"
                          name="Join"
                          className="ml-4 flex-none"
                        >
                          Bind
                        </Button>
                      </div>
                    </form>
                  </div>
                  <div className="absolute left-3 top-3 rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-sm/6 font-semibold text-indigo-700 backdrop-blur-[12px] dark:text-indigo-400">
                    Coming soon
                  </div>
                </div>
              </div>
            </div>
          </Container>
          <Footer />
        </>
      )}
    </>
  );
};

export default Page;
