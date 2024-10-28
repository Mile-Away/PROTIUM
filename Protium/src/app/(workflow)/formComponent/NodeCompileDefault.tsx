import { BasicNodeProps, WorkflowNodeCompileProps } from '@/@types/workflow';
import { RootReducerProps } from '@/app/store';
import {
  setSliderOverlay,
  setSliderOverlayVisible,
} from '@/store/workflow/workflowSlice';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { InteractivePanelProps, ResultsPanelProps } from '@/@types/interactive';

import TextArea from '../interactive/TextArea';
import CompileResultsPanel from '../interactive/CompileResults';

const NodeCompileDefault = ({
  nodeId,
  compileItem,
  idx,
  ...props
}: {
  nodeId: string;
  compileItem: WorkflowNodeCompileProps;
  idx: number;
} & BasicNodeProps) => {
  // console.log('NodeCompileDefault', compileItem);
  const { sliderOverlayVisible, sliderOverlay } = useSelector(
    (state: RootReducerProps) => state.workflow,
  );

  const dispatch = useDispatch();

  const ResultsPanel: React.FC<ResultsPanelProps> =
    compileItem.type === 'Parameter' ? CompileResultsPanel : CompileResultsPanel;

  const setOpen = (value: boolean) => {
    dispatch(setSliderOverlayVisible(value));
  };

  const shoudleOpen = (ItemId: string) => {
    console.log('shoudleOpen', sliderOverlayVisible, sliderOverlay);

    return sliderOverlayVisible && sliderOverlay?.compileId === ItemId;
  };

  if (!compileItem.source) return null;

  return (
    <div>
      <div
        onClick={() => {
          dispatch(
            setSliderOverlay({ nodeId: nodeId, compileId: compileItem.id }),
          );
          setOpen(true);
        }}
        className=" h-32 min-w-full max-w-64 cursor-pointer overflow-y-scroll rounded bg-black p-1  hover:bg-white/10"
      >
        <div className="max-h-full p-0.5">
          <p className=" whitespace-pre-wrap break-words text-2xs">
            {compileItem.source}
          </p>
        </div>
      </div>
      <ResultsPanel
        {...{
          idx,
          open: shoudleOpen(compileItem.id),
          setOpen,
          ...props,
        }}
      />
    </div>
  );
};

export default NodeCompileDefault;
