import clsx from 'clsx';
import { useReactFlow } from 'reactflow';

import { BasicNodeProps, WorkflowNodeProps } from '@/@types/workflow';
import { RootReducerProps } from '@/app/store';
import { minimizedNode } from '@/store/workflow/workflowSlice';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { BsDash, BsInfo } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import CustomHandle from '../handles/CustomHandle';

export default function BasicNode(props: BasicNodeProps) {

  const { id, type, dragging, data, children} = props;

  const { setNodes, setEdges } = useReactFlow();

  const dispatch = useDispatch();
  const { nodes } = useSelector((state: RootReducerProps) => state.workflow);

  const node = useMemo(() => {
    return nodes.find((node) => node.id === id);
  }, [id, nodes]);


  const template = useMemo(() => {
    return nodes.find((node) => node.id === id)?.template;
  }, [id, nodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);

  const router = useRouter();

  const handleMinimizeNode = useCallback(
    (id: string) => {
      dispatch(minimizedNode(id));
    },
    [id],
  );

  return (
    <>
      <div
        className={clsx(
          // 'h-fit w-64 select-none rounded-md border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800 ',
          'relative w-auto min-w-64 p-[1px]',
          'shadow-lg dark:shadow-black',
          'cursor-auto rounded',
          'transition-transform duration-300 ease-in-out',
          ' overflow-clip',
          dragging && ' opacity-75',
          node?.minimized ? 'h-10' : 'h-auto',
          data.status === 'running' &&
            'before:-z-1 ring-1 ring-yellow-300 before:pointer-events-none before:absolute before:-left-full before:-top-full before:h-[300%] before:w-[300%] before:animate-gradient-conic before:rounded-lg dark:ring-yellow-500/80 before:dark:bg-conic-gradient',
          data.status === 'failed' && 'ring-1 dark:ring-red-500 ',
          data.status === 'success' && 'ring-1 dark:ring-teal-500 ',
          data.status === 'skipped' && 'opacity-60',
        )}
      >
        {/* <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-sky-600 via-sky-600/70 to-blue-600 opacity-10 blur-lg"></div> */}
        {/* <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-sky-600 via-sky-600/70 to-blue-600 opacity-10"></div> */}
        <div className="relative h-full rounded-md bg-neutral-50 ring-1 ring-white/10 backdrop-blur dark:bg-neutral-800">
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
              <div className="group relative h-2.5 w-auto cursor-default">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 42 10"
                  className="h-2.5 w-auto stroke-slate-500/30"
                >
                  <circle
                    className="fill-red-600 transition-all duration-300 ease-in-out hover:scale-110"
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
                <button
                  name="close"
                  type="button"
                  onClick={deleteNode}
                  className="absolute left-0 top-0 flex h-2.5 w-2.5 items-center justify-center opacity-0 transition-all duration-300 ease-in-out hover:scale-125 group-hover:opacity-100"
                >
                  <XMarkIcon className="h-2 w-2 text-black " />
                </button>
                <button
                  name="minimize"
                  type="button"
                  onClick={() => handleMinimizeNode(id)}
                  className="absolute left-4 top-0 flex h-2.5 w-2.5 items-center justify-center opacity-0 transition-all duration-300  ease-in-out hover:scale-125 group-hover:opacity-100"
                >
                  <BsDash className="h-2 w-2 text-black" />
                </button>
                <Link
                  href={`/flociety/nodes/${template}`}
                  target="_blank"
                  className="absolute left-8 top-0 flex h-2.5 w-2.5 items-center justify-center opacity-0 transition-all duration-300  ease-in-out hover:scale-125 group-hover:opacity-100"
                >
                  <BsInfo className="h-2 w-2 text-black" />
                </Link>
              </div>

              <div className="text-xs font-semibold">{data.header}</div>
            </div>

            {/* Edge Control */}

            <CustomHandle handles={data.handles} minimized={node?.minimized} />

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
