import clsx from 'clsx';
import { Node, useReactFlow } from 'reactflow';

import { BasicNodeProps } from '@/@types/workflow';
import { RootReducerProps } from '@/app/store';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { BsDash, BsInfo } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import CustomHandle from '../handles/CustomHandle';

export default function BasicNode(props: BasicNodeProps) {
  const { id, type, dragging, data, children } = props;

  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const node: Node<any> | undefined = getNode(id);


  const { nodes } = useSelector((state: RootReducerProps) => state.workflow);

  const [minimized, setMinimized] = useState(false);

  const template = useMemo(() => {
    return nodes.find((node) => node.id === id)?.template;
  }, [id, nodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);

  const router = useRouter();
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
          minimized ? 'h-10' : 'h-auto',
          data.status === 'running' && 'ring-1 dark:ring-yellow-500/80 ring-yellow-300 before:-z-1 before:animate-gradient-conic before:rounded-lg before:pointer-events-none before:dark:bg-conic-gradient before:absolute before:-top-full before:-left-full before:w-[300%] before:h-[300%]',
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
                  onClick={() => setMinimized(!minimized)}
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

            <CustomHandle handles={data.handles} minimized={minimized} />

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
