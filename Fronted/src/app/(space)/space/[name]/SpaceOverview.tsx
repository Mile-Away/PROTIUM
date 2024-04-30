'use client';
import { useRouter } from 'next/navigation';

// import { AppContext } from '@/app/providers'
// import { Prose } from '@/components/Prose';

import { ArticleProps } from '@/@types/article';
import Markdown from '@/components/docs/Markdwon';
import { useDictCRUD } from '@/hooks/useCrud';
import { formatTime } from '@/lib/formatDate';
import '@/styles/markdown.css';
import '@/styles/markdown.dark.css';
import '@/styles/markdown.quote.css';
import clsx from 'clsx';
import { useEffect } from 'react';


export default function SpaceOverview({ uuid }: { uuid: string }) {
  let router = useRouter();

  const id = uuid;

  const { dataCRUD, error, isLoading, fetchData } = useDictCRUD<ArticleProps>(
    {} as ArticleProps,
    `/document/article/${id}/`,
  );

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div className="max-w-full flex-1 xl:max-w-[calc(100%-18rem)] 2xl:max-w-[calc(100%-26rem)]">
      <div
        className={clsx(
          // 'sticky left-0 right-0 top-0 z-10',
          ' flex h-16 items-center justify-between bg-white/90 py-10 backdrop-blur-sm dark:bg-neutral-900/80',
        )}
      >
        <div className="flex gap-4">
          <h1 className="text-2xl font-bold">README</h1>
          <time
            dateTime={dataCRUD.updated_at}
            className="flex items-center text-base text-zinc-400 dark:text-zinc-500"
          >
            <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
            <span className="ml-3">
              {formatTime(dataCRUD.updated_at, 'long')}
            </span>
          </time>
        </div>
      </div>
      <div className="markdown w-full">
        <Markdown content={dataCRUD.content} />
      </div>
    </div>
  );
}
