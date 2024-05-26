import { ArticleProps } from '@/@types/article';
import AutoCompleteCombobox from '@/components/forms/comboboxes/autocompelete_multi_allowadd';
import MultiComboBox from '@/components/forms/comboboxes/autocompelete_multi_allowadd';
import { useState } from 'react';

const SetPinnedArticles = ({ spaceName }: { spaceName: string }) => {
  const [pinnedArticles, setPinnedArticles] = useState<ArticleProps[]>([]);
  return (
    <div className='mt-8'>
      {/* <MultiComboBox
        options={pinnedArticles}
        // setOptions={setPinnedArticles}
        placeholder="Pinned Articles"
      /> */}
      <AutoCompleteCombobox />
    </div>
  );
};

export default SetPinnedArticles;
