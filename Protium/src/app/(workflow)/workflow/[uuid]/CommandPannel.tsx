import { RootReducerProps } from '@/app/store';
import HoverMessage from '@/components/overlays/hover_message';
import { formatTime } from '@/lib/formatDate';
import useWorkflowWebSocket from '@/services/workflowService';
import { SquaresPlusIcon } from '@heroicons/react/24/outline';
import {
  ChevronDownIcon,
  PauseIcon,
  PlayIcon,
} from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const CommandPannel = ({ params }: { params: { uuid: string } }) => {
  const [isConsoleExpand, setIsConsoleExpand] = useState(true);
  const [isConsoleVisible, setIsConsoleVisible] = useState(true);
  const { workflow, nodes, edges, consoleInfo } = useSelector(
    (state: RootReducerProps) => state.workflow,
  );
  const { saveWorkflow, startWorkflow } = useWorkflowWebSocket(params);

  return (
    <div
      className={clsx(
        'absolute bottom-4 right-56 isolate z-10 min-w-fit rounded-xl border bg-white  shadow-lg dark:border-none dark:bg-black',
        'transition-all duration-500 ease-in-out',
        isConsoleExpand ? 'h-[9.4rem]' : 'h-10',
        isConsoleVisible ? 'left-2' : 'left-1/2',
      )}
    >
      {/* Header */}
      <div
        className={clsx(
          'absolute top-0 h-10  w-full select-none justify-between rounded-t-xl px-4 dark:bg-neutral-800/40',
          'flex items-center',
        )}
      >
        <div className="flex w-fit items-center justify-start space-x-4 font-display text-sm">
          <div
            onClick={() => {
              setIsConsoleVisible(!isConsoleVisible);
            }}
            className=" -m-1.5 cursor-pointer rounded p-1.5 text-neutral-400/80 hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          >
            <ChevronDownIcon
              className={clsx(
                'h-4 w-4',
                'transition-transform duration-300 ease-in-out',
                isConsoleVisible ? ' -rotate-90' : 'rotate-90',
              )}
            />
          </div>
          {isConsoleVisible && (
            <div className='gap-4 flex items-center'>
              <span className=' border-b font-semibold text-neutral-200'>Console</span>
              <span className=' text-gray-400'>Task</span>
            </div>
          )}
        </div>
        <div className="flex gap-x-4">
          <button
            onClick={saveWorkflow}
            className="group relative -m-1.5 cursor-pointer rounded p-1.5 text-indigo-600 hover:bg-neutral-100 dark:text-indigo-400 dark:hover:bg-indigo-500 dark:hover:text-white"
          >
            <SquaresPlusIcon className="h-6 w-6 " />
            <HoverMessage position="top">Save</HoverMessage>
          </button>
          {
            <>
              <button
                onClick={startWorkflow}
                className="group relative -m-1.5 cursor-pointer rounded  p-1.5 text-teal-500 hover:bg-neutral-100 hover:text-teal-600  dark:text-transparent dark:hover:bg-teal-600 dark:hover:text-white "
              >
                <PlayIcon className="h-6 w-6 stroke-teal-500 dark:stroke-teal-400" />
                <HoverMessage position="top">Run</HoverMessage>
              </button>

              <div className="group relative -m-1.5 cursor-pointer rounded  p-1.5 text-amber-600 hover:bg-neutral-100 dark:text-amber-600 dark:hover:bg-amber-600 dark:hover:text-white  ">
                <PauseIcon className="h-6 w-6  " />
                <HoverMessage position="top">Pause</HoverMessage>
              </div>
            </>
          }
          <div
            onClick={() => {
              setIsConsoleExpand(!isConsoleExpand);
            }}
            className=" -m-1.5 cursor-pointer rounded p-1.5 text-neutral-400/80 hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          >
            <ChevronDownIcon
              className={clsx(
                'h-6 w-6',
                ' transition-transform duration-300 ease-in-out',
                isConsoleExpand ? '' : 'rotate-180',
              )}
            />
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="inert mt-10 h-[calc(100%-2.5rem)] px-4 py-4 text-2xs">
        <div className="inert h-full overflow-scroll">
          {consoleInfo.map((item, idx) => (
            <p key={idx}>
              <span className=" mr-2 max-w-32 text-neutral-500 dark:text-neutral-400">
                {formatTime(item.time)}
              </span>
              <span
                className={clsx(
                  'text-neutral-900 dark:text-neutral-100',
                  item.type === 'error' && 'text-red-500 dark:text-red-400',
                  item.type === 'info' && 'text-blue-500 dark:text-blue-400',
                  item.type === 'warning' &&
                    'text-yellow-500 dark:text-yellow-400',
                )}
              >
                {item.message}
              </span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommandPannel;
