import { BasicNodeProps } from '@/@types/workflow';
import { RootReducerProps } from '@/app/store';
import {
  addHandle,
  deleteHandle,
  setNodeDataBodyContent,
  setSliderOverlay,
  setSliderOverlayVisible,
} from '@/store/workflow/workflowSlice';
import { useDispatch, useSelector } from 'react-redux';
import WorkflowFormSelect from '../formComponent/WorkflowFormSelect';
import TextArea from '../interactive/TextArea';
import BasicNode from './BasicNode';
const potcarSelectItems = [
  {
    name: 'POTCAR - Default',
    value: 'default',
  },
  {
    name: 'POTCAR - Custom',
    value: 'custom',
  },
];

const machineSelectItems = [
  {
    name: 'Machine - Bohrium',
    value: 'bohrium',
  },
  {
    name: 'Machine - LSF',
    value: 'lsf',
  },
];

export default function SolverNode(props: BasicNodeProps) {
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

  const onPotcarSelectedIndexChange = (index: number) => {
    dispatch(
      setNodeDataBodyContent({
        nodeId: id,
        bodyKey: 'potcarSelect',
        source: potcarSelectItems[index].value,
      }),
    );
    if (potcarSelectItems[index].value === 'custom') {
      dispatch(
        addHandle({
          nodeId: id,
          handle: {
            type: 'target',
            key: 'potcar',
            data_source: 'result',
            data_key: 'potcar',
          },
        }),
      );
    } else {
      dispatch(
        deleteHandle({
          nodeId: id,
          handleKey: 'potcar',
        }),
      );
    }
  };

  const onMachineSelectedIndexChange = (index: number) => {
    dispatch(
      setNodeDataBodyContent({
        nodeId: id,
        bodyKey: 'machineSelect',
        source: machineSelectItems[index].value,
      }),
    );
  };

  const jobId = data.results
    .find((item) => item.key === 'vasp')
    ?.source.toString();
  return (
    <BasicNode {...props}>
      <div className="flex flex-col space-y-4 text-xs">
        <WorkflowFormSelect
          items={potcarSelectItems}
          onSelectedIndexChange={onPotcarSelectedIndexChange}
        />
        <WorkflowFormSelect
          items={machineSelectItems}
          onSelectedIndexChange={onMachineSelectedIndexChange}
        />
        <div>
          <div className="flex items-center justify-between">
            <input
              className="h-8 w-full rounded-r border-l-2 bg-transparent pl-2 placeholder:text-xs focus:outline-none dark:border-indigo-600"
              type="text"
              placeholder={`${
                data.body[2]?.source.split('\n')[1]?.slice(0, 20) ||
                'Machine Config'
              } ${
                data.body[2]?.source.split('\n').length > 1 ||
                data.body[2]?.source.split('\n')[0].length > 20
                  ? '...'
                  : ''
              }`}
              onClick={() => {
                dispatch(
                  setSliderOverlay({ nodeId: id, bodyId: data.body[2].id }),
                );
                setOpen(true);
              }}
            />
          </div>
          <TextArea
            {...{
              idx: 2,
              open: shoudleOpen(data.body[2].id),
              setOpen,
              ...props,
            }}
          />
        </div>
        <div className="flex h-32 items-start justify-between rounded bg-black p-2">
          {jobId ? (
            <p>
              Please click{' '}
              <button
                onClick={() => {
                  window.open(`https://bohrium.dp.tech/jobs/detail/${jobId}`);
                }}
                className="pointer-events-auto font-semibold hover:underline dark:text-indigo-300"
              >
                here
              </button>{' '}
              to see task details in Bohrium.
            </p>
          ) : (
            <p>Outputs...</p>
          )}
        </div>
      </div>
    </BasicNode>
  );
}
