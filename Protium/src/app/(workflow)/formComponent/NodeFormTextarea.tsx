import { BasicNodeProps, WorkflowNodeDataBodyProps } from '@/@types/workflow';
import { RootReducerProps } from '@/app/store';
import {
  setSliderOverlay,
  setSliderOverlayVisible,
} from '@/store/workflow/workflowSlice';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import TextArea from '../interactive/TextArea';

const NodeFormTextarea = ({
  nodeId,
  bodyItem,
  idx,
  ...props
}: {
  nodeId: string;
  bodyItem: WorkflowNodeDataBodyProps;
  idx: number;
} & BasicNodeProps) => {
  const { sliderOverlayVisible, sliderOverlay } = useSelector(
    (state: RootReducerProps) => state.workflow,
  );

  const dispatch = useDispatch();

  const setOpen = (value: boolean) => {
    dispatch(setSliderOverlayVisible(value));
  };

  const shoudleOpen = (bodyItemId: string) => {
    return sliderOverlayVisible && sliderOverlay?.bodyId === bodyItemId;
  };

  return (
    <div>
      <div
        className="group hover:shadow hover:shadow-neutral-900/80 flex h-8 w-full cursor-pointer items-center justify-between rounded bg-indigo-50 px-3 py-2 dark:bg-black/40"
        onClick={() => {
          dispatch(setSliderOverlay({ nodeId: nodeId, bodyId: bodyItem.id }));
          setOpen(true);
        }}
      >
        <div
          className="flex-1 font-semibold capitalize rounded-r border-l-2 bg-transparent pl-2 text-center placeholder:text-xs placeholder:text-neutral-100 focus:outline-none dark:border-indigo-600"

          // placeholder={`${
          //   data.body[idx]?.source.split('\n')[0].slice(0, 20) ||
          //   data.header
          // } ${
          //   data.body[idx]?.source.split('\n').length > 1 ||
          //   data.body[idx]?.source.split('\n')[0].length > 20
          //     ? '...'
          //     : ''
          // }`}
        >
          {bodyItem.title}
        </div>
        <PencilSquareIcon className="h-4 w-auto dark:text-neutral-400 dark:group-hover:text-neutral-100" />
      </div>
      <TextArea
        {...{ idx, open: shoudleOpen(bodyItem.id), setOpen, ...props }}
      />
    </div>
  );
};

export default NodeFormTextarea;