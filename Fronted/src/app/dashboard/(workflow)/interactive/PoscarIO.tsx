import { BasicNodeProps } from '@/@types/workflow';
import WithStickyFooter from '@/components/overlays/with_sticky_footer';
import { setNodeDataBodyContent } from '@/store/workflow/workflowSlice';
import { useDispatch } from 'react-redux';

export default function PoscarIO(
  props: BasicNodeProps & {
    open: boolean;
    setOpen: (value: boolean) => void;
    idx: number;
  },
) {
  const { id, open, setOpen, data, idx } = props;

  const dispatch = useDispatch();

  const onContentSave = (content: string) => {
    dispatch(
      setNodeDataBodyContent({
        nodeId: id,
        bodyId: data.body[idx].id,
        source: content,
      }),
    );
  };

  return (
    <WithStickyFooter
      title={data.body[idx].title || data.header}
      initialContent={data.body[idx].source}
      onContentSave={onContentSave}
      open={open}
      setOpen={setOpen}
    />
  );
}
