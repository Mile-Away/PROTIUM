import { BasicNodeProps } from '@/@types/workflow';
import { RootReducerProps } from '@/app/store';
import {
  setSliderOverlay,
  setSliderOverlayVisible,
} from '@/store/workflow/workflowSlice';
import { useDispatch, useSelector } from 'react-redux';
import PoscarIO from '../interactive/PoscarIO';
import BasicNode from './BasicNode';
export default function InputNode(props: BasicNodeProps) {
  const { id, type, dragging, data } = props;

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
    <BasicNode {...props}>
      <div className="flex flex-col space-y-4 text-xs">
        {data.body.map((item, idx) => (
          <div key={item.id}>
            <div className="flex items-center justify-between">
              <input
                className="h-8 w-full rounded-r border-l-2 bg-transparent pl-2 placeholder:text-xs focus:outline-none dark:border-indigo-600"
                type="text"
                placeholder={`${data.body[idx].source
                  .split('\n')[0]
                  .slice(0, 20)} ${
                  data.body[idx].source.split('\n').length > 1 ||
                  data.body[idx].source.split('\n')[0].length > 20
                    ? '...'
                    : ''
                }`}
                onClick={() => {
                  dispatch(setSliderOverlay({ nodeId: id, bodyId: item.id }));
                  setOpen(true);
                }}
              />
            </div>
            <PoscarIO
              {...{ idx, open: shoudleOpen(item.id), setOpen, ...props }}
            />
          </div>
        ))}
      </div>
    </BasicNode>
  );
}
