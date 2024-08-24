import { BasicNodeProps } from '@/@types/workflow';
import { RootReducerProps } from '@/app/store';
import {
  addHandle,
  deleteHandle,
  setNodeDataBodyContent,
  setSliderOverlayVisible,
} from '@/store/workflow/workflowSlice';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import WorkflowFormSelect from '../formComponent/NodeFormSelect';
import NodeFormTextarea from '../formComponent/NodeFormTextarea';
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
            rope: 'potcar',
            data_source: 'compile',
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

  const jobId = data.compile
    .find((item) => item.type === 'task')
    ?.source?.toString();

  return (
    <BasicNode {...props}>
      <div className="flex flex-col space-y-4 text-xs">
        {data.body.map((item, idx) => (
          <>
            {item.key === 'potcarSelect' && (
              <WorkflowFormSelect
                items={potcarSelectItems}
                onSelectedIndexChange={onPotcarSelectedIndexChange}
              />
            )}
            {item.key === 'machineSelect' && (
              <WorkflowFormSelect
                items={machineSelectItems}
                onSelectedIndexChange={onMachineSelectedIndexChange}
              />
            )}
            {item.type === 'object' && (
              <NodeFormTextarea
                key={item.id}
                nodeId={id}
                bodyItem={item}
                idx={idx}
                {...props}
              />
            )}
          </>
        ))}

        {/* 当有 jobID 时，显示最近的一次任务 */}

        <ul
          className={clsx(
            'flex h-32 items-start justify-between rounded pt-8 ',
            'transition-all duration-300 ease-in-out',
            jobId ? ' opacity-100' : ' opacity-0',
          )}
        >
          <li
            className="group relative col-span-1 flex cursor-pointer rounded-md transition-all duration-300 fade-in-5 hover:shadow-md hover:shadow-black"
            onClick={() =>
              window.open(`https://bohrium.dp.tech/jobs/detail/${jobId}`)
            }
          >
            <div
              className={clsx(
                'bg-green-500',
                'flex w-12 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white',
              )}
            >
              <CheckBadgeIcon className="h-6 w-6" />
            </div>
            <div
              className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r 
                border-t border-neutral-200 bg-white dark:border-neutral-700 dark:bg-white/5"
            >
              <div className="flex-1 truncate px-4 py-2 text-sm">
                <div className="text-sm font-medium text-neutral-900 hover:text-neutral-600 dark:text-neutral-100">
                  Bohrium Job Id: {jobId}
                </div>
                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-300">
                  2024-01-01 17:23:53
                </p>
              </div>
              <div className="flex-shrink-0 pr-2">
                <a
                  href={`https://bohrium.dp.tech/jobs/detail/${jobId}`}
                  target="_blank"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span
                    className="pointer-events-none text-neutral-300 group-hover:text-neutral-400 dark:text-neutral-600 dark:group-hover:text-neutral-200"
                    aria-hidden="true"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </BasicNode>
  );
}
