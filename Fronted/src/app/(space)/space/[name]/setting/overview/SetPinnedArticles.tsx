import { ArticleProps } from '@/@types/article';
import { SpaceProps } from '@/@types/space';
import AutoCompleteCombobox from '@/components/forms/comboboxes/AutocompeleteMultiAllowadd';
import createAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { useDictCRUD } from '@/hooks/useCrud';
import { useEffect, useState } from 'react';

const SetPinnedArticles = ({ spaceName }: { spaceName: string }) => {
  const jwtAxios = createAxiosWithInterceptors();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [articles, setArticles] = useState<ArticleProps[]>([]);
  const [pinnedArticles, setPinnedArticles] = useState<ArticleProps[]>([]);

  const { fetchData, dataCRUD, error } = useDictCRUD<SpaceProps>(
    {} as SpaceProps,
    `/server/server/${spaceName}`,
  );

  const fetchPublicArticles = async () => {
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
    fetchPublicArticles();
    fetchData();
  }, []);

  useEffect(() => {
    if (dataCRUD.pinned_manuscript) {
      console.log("PinnedManu", dataCRUD.pinned_manuscript)
      setPinnedArticles(dataCRUD.pinned_manuscript.map((item) => item.document));
    }
  }, [dataCRUD]);

  return (
    <div className="mt-8">
      <AutoCompleteCombobox
        spaceName={spaceName}
        options={articles}
        selected={pinnedArticles}
        placeholder="Enter to search published articles..."
      />
    </div>
  );
};

export default SetPinnedArticles;
