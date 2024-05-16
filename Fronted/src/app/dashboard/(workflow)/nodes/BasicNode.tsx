import clsx from 'clsx';

import { BasicNodeProps } from '@/@types/workflow';
import CustomHandle from '../handles/CustomHandle';

export default function BasicNode(props: BasicNodeProps) {
  const { id, type, dragging, data, children } = props;

  return (
    <>
      <div
        className={clsx(
          // 'h-fit w-64 select-none rounded-md border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800 ',
          'relative w-64',
          'shadow-lg dark:shadow-black',
          'cursor-auto rounded',
          'transition-all duration-300 ease-in-out',
          dragging && ' opacity-60',
          '',
          data.status === 'running' && 'ring-1 dark:ring-yellow-500',
          data.status === 'failed' && 'ring-1 dark:ring-red-500 ',
          data.status === 'success' && 'ring-1 dark:ring-teal-500 ',
          data.status === 'skipped' && 'opacity-75 ',
        )}
      >
        {/* <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-sky-600 via-sky-600/70 to-blue-600 opacity-10 blur-lg"></div> */}
        {/* <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-sky-600 via-sky-600/70 to-blue-600 opacity-10"></div> */}
        <div className="relative rounded-md bg-neutral-50 ring-1 ring-white/10 backdrop-blur dark:bg-neutral-800">
          {/* <div className="absolute -top-px left-20 right-11 h-px bg-gradient-to-r from-sky-600/0 via-sky-600/70 to-sky-600/0"></div> */}
          {/* <div className="absolute -bottom-px left-11 right-20 h-px bg-gradient-to-r from-blue-700/0 via-blue-700 to-blue-700/0"></div> */}
          <div className="flex flex-col px-3 pb-4 pt-3">
            {/* Carder Header */}
            <div
              className={clsx(
                '-m-3 mb-6 flex cursor-move items-center justify-between rounded p-3 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50',
                'drag-handle',
              )}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 42 10"
                fill="none"
                className="h-2.5 w-auto stroke-slate-500/30"
              >
                <circle
                  className=" fill-red-600"
                  cx="5"
                  cy="5"
                  r="4.5"
                ></circle>
                <circle
                  className="fill-yellow-600"
                  cx="21"
                  cy="5"
                  r="4.5"
                ></circle>
                <circle
                  className="fill-green-600"
                  cx="37"
                  cy="5"
                  r="4.5"
                ></circle>
              </svg>
              <div className="text-xs font-semibold">{data.header}</div>
            </div>

            {/* Edge Control */}
            <CustomHandle handles={data.handles} />

            {/* Card Body */}
            <div className="my-4">{children}</div>

            {/* Card Footer */}
            <div className="mt-4 flex items-center justify-end text-xs">
              {data.footer}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
