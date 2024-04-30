import { ArticleProps } from '@/@types/article';
import { QuickLink } from '@/components/CardLinks';

const CardLinks = [
  {
    title: 'How to use the new feature',
    description: 'A quick guide to get started with the new feature',
    href: '/dashboard',
    icon: 'warning',
  },
  {
    title: 'How to use the new feature',
    description: 'A quick guide to get started with the new feature',
    href: '/dashboard',
    icon: 'warning',
  },
  {
    title: 'How to use the new feature',
    description: 'A quick guide to get started with the new feature',
    href: '/dashboard',
    icon: 'warning',
  },
  {
    title: 'How to use the new feature',
    description: 'A quick guide to get started with the new feature',
    href: '/dashboard',
    icon: 'warning',
  },
];

interface PinnedArticleProps {
  articles: ArticleProps[];
}

const PinnedArticle: React.FC<PinnedArticleProps> = ({ articles }) => {
  return (
    <div
      className="flex w-full flex-col overflow-y-hidden bg-inherit pl-0.5 
      xl:sticky xl:right-0
    xl:top-16 xl:h-[calc(100vh-7rem)] xl:w-64 xl:overflow-y-auto 2xl:w-96"
    >
      <div className="left-0 right-0 top-0 z-10 flex h-8 w-full items-center  bg-white pb-6 pt-10  dark:bg-neutral-900 xl:sticky">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
          Pinned Articles
        </h1>
      </div>
      {articles && articles.length > 0 ? (
        <div className="flex flex-row gap-x-4 overflow-x-auto overflow-y-hidden xl:flex-col xl:overflow-y-auto xl:overflow-x-hidden">
          {articles.map((article) => (
            <QuickLink
              key={article.uuid}
              title={article.title}
              description={article.content}
              href={`/articles/detail/${article.uuid}/${article.title}`}
              icon="lightbulb"
            />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-base font-semibold text-gray-400"> None yet.</p>
      )}
    </div>
  );
};

export default PinnedArticle;
