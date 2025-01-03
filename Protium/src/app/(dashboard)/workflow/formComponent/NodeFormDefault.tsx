import { BasicNodeProps, WorkflowNodeDataBodyProps } from '@/@types/workflow';
import { RootReducerProps } from '@/app/store';
import {
  setSliderOverlay,
  setSliderOverlayVisible,
} from '@/store/workflow/workflowSlice';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { InteractivePanelProps } from '@/@types/interactive';
import InteractivePanel from '../interactive/InteractivePanel';
import TextArea from '../interactive/TextArea';

const NodeFormDefault = ({
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

  const Interactive: React.FC<InteractivePanelProps> =
    bodyItem.type === 'DEFAULT' ? InteractivePanel : TextArea;

  const tabItems = [
    {
      name: 'General',
      jsonSchema: {
        schema: bodyItem.schema?.schema || {},
        uiSchema: bodyItem.schema?.uiSchema || {},
      },
    },
    {
      name: 'Advanced',
    },
  ];

  const setOpen = (value: boolean) => {
    dispatch(setSliderOverlayVisible(value));
  };

  const shoudleOpen = (bodyItemId: string) => {
    return sliderOverlayVisible && sliderOverlay?.bodyId === bodyItemId;
  };

  return (
    <div>
      <div
        className="group flex h-8 w-full cursor-pointer items-center justify-between rounded bg-indigo-50 px-3 py-2 hover:shadow dark:bg-black/40 dark:hover:shadow-neutral-900/80"
        onClick={() => {
          dispatch(setSliderOverlay({ nodeId: nodeId, bodyId: bodyItem.id }));
          setOpen(true);
        }}
      >
        <div
          className="flex-1 rounded-r border-l-2 border-indigo-600 bg-transparent pl-2 text-center font-semibold capitalize placeholder:text-xs placeholder:text-neutral-100 focus:outline-none dark:border-indigo-600"

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
      <Interactive
        {...{
          idx,
          open: shoudleOpen(bodyItem.id),
          setOpen,
          tabItems,
          ...props,
        }}
      />
    </div>
  );
};

export default NodeFormDefault;
