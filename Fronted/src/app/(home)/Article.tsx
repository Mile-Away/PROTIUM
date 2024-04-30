'use client';
import { ArticleProps } from '@/@types/article';
import Markdown from '@/components/docs/Markdwon';
import { MEDIA_URL } from '@/config';
import { formatTime } from '@/lib/formatDate';
import '@/styles/markdown.abstract.css';
import { useRouter } from 'next/navigation';

import { Card } from './Card';

export default function Article({
  article,
  ...props
}: { article: ArticleProps } & React.ComponentPropsWithoutRef<typeof Card>) {
  const router = useRouter();
  const encodedTitle = encodeURIComponent(article.title);

  return (
    <article {...props}>
      <Card className="-m-4  overflow-hidden rounded-lg p-4 md:col-span-3">
        <Card.Title
          href={`/articles/detail/${article.uuid}/${encodedTitle}`}
        >
          {article.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={article.updated_at}
          className="md:hidden"
          decorate
        >
          {formatTime(article.updated_at, 'long')}
        </Card.Eyebrow>
        <div className="markdown-abstract max-w-full">
          <div className="relative mt-2 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
            <Markdown content={article.content} />
          </div>
        </div>
        <Card.Cta>Read article</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={article.updated_at}
        className="mt-1 hidden md:block"
      >
        {formatTime(article.updated_at)}
        <button
          onClick={() => router.push(`/profile/${article.author}`)}
          className="-m-2 mt-4 flex items-center gap-x-2  rounded-lg px-2 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50  dark:text-zinc-300 dark:hover:bg-zinc-800/50"
        >
          <img
            className="h-5 w-5 rounded-full"
            src={`${MEDIA_URL}${article.avatar}`}
            alt={article.author}
          />
          {article.author}
        </button>
      </Card.Eyebrow>
    </article>
  );
}
