import { useDictCRUD } from '@/hooks/useCrud';
import { EyeIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';

interface ArticleViewProps {
  id: number;
  view: number;
  document: string;
}
const ArticleView = ({ uuid }: { uuid: string }) => {
  const { fetchData, dataCRUD, isLoading, error } = useDictCRUD(
    {} as ArticleViewProps,
    `/document/article/activity/${uuid}/`,
  );

  useEffect(() => {
    if (uuid) {
      fetchData();
    }
  }, [uuid]);

  return (
    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300">
      <EyeIcon className="h-4 w-4" />

      <span className=" select-none text-xs ">{dataCRUD.view}</span>
    </div>
  );
};

export default ArticleView;
