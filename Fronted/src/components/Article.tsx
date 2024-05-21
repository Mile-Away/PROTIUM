import { ArticleProps } from '@/@types/article';
import { Card } from '@/app/(home)/Card';
import Markdown from '@/components/docs/Markdwon';
import { formatTime } from '@/lib/formatDate';
import '@/styles/markdown.css';
import '@/styles/markdown.dark.css';
import '@/styles/markdown.abstract.css';
import { useTranslation } from 'react-i18next';

export default function Article({ article }: { article: ArticleProps }) {
  const { t } = useTranslation('translation');
  return (
    <Card as="article">
      <Card.Title href={`/articles/detail/${article.uuid}/${article.title}`}>
        {article.title}
      </Card.Title>
      <Card.Eyebrow as="time" dateTime={article.updated_at} decorate>
        {formatTime(article.updated_at)}
      </Card.Eyebrow>

      <div className="markdown-abstract max-w-full">
        <div className="relative mt-2 line-clamp-4 text-sm text-zinc-600 dark:text-zinc-400">
          <Markdown content={article.content} />
        </div>
      </div>

      <Card.Cta>Read Article</Card.Cta>
    </Card>
  );
}
