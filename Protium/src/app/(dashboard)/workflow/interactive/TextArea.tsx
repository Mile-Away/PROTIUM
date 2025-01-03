import { BasicNodeProps } from '@/@types/workflow';
import WithStickyFooter from '@/components/overlays/with_sticky_footer';
import { setNodeDataBodyContent } from '@/store/workflow/workflowSlice';
import { useDispatch } from 'react-redux';

export interface TextAreaProps extends BasicNodeProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  idx: number;
}

const TextArea: React.FC<TextAreaProps> = (props) => {
  const { id, open, setOpen, data, idx } = props;

  const dispatch = useDispatch();

  const onContentSave = (content: string) => {
    dispatch(
      setNodeDataBodyContent({
        nodeId: id,
        bodyKey: data.body[idx]?.key,
        source: content,
      }),
    );
  };

  return (
    <WithStickyFooter
      title={data.body[idx]?.title || data?.header}
      initialContent={data.body[idx]?.source}
      onContentSave={onContentSave}
      open={open}
      setOpen={setOpen}
    />
  );
};

export default TextArea;
