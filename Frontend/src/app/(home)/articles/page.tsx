'use client';
import { ArticleProps } from '@/@types/article';
import Loading from '@/app/loading';
import createAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import '@/styles/markdown.abstract.css';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import Article from '../Article';
import { SimpleLayout } from './SimpleLayout';

export default function Page() {
  const { t } = useTranslation('translation');
  const jwtAxios = createAxiosWithInterceptors();
  const [articles, setArticles] = useState<ArticleProps[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async () => {
    if (!hasMore) return; // 如果没有更多数据了，就不再请求
    else {
      const res = await jwtAxios.get(
        `/document/vs/document/?is_public=true&page=${page}`,
      );
      if (res.data.next) {
        setArticles(articles.concat(res.data.results));
        setPage(page + 1);
      } else {
        setArticles(articles.concat(res.data.results)); // 最后一次时，把最后的数据加进去
        setHasMore(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SimpleLayout title="Protium" intro="article.intro">
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div
          className="card-index flex max-w-3xl flex-col overflow-x-hidden overflow-y-hidden"
          id="scrollableDiv"
        >
          <InfiniteScroll
            style={{ overflow: 'hidden' }}
            dataLength={articles.length}
            next={fetchData}
            hasMore={hasMore}
            loader={
              <div className=" flex w-full items-center justify-center">
                <Loading className="" />
              </div>
            }
            endMessage={
              <div className=" mt-24 border-t border-dashed border-gray-400 pt-4 text-center text-sm opacity-40 dark:text-gray-400">
                {t('bottomLine')}
              </div>
            }
            // scrollableTarget="scrollableDiv"
          >
            {articles.map((article) => (
              <Article
                className="mb-12 pt-4 md:grid md:grid-cols-4 md:items-baseline"
                key={article.uuid}
                article={article}
              />
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </SimpleLayout>
  );
}
