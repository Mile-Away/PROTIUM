import { WorkflowNodeDataHandlesProps } from '@/@types/workflow';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import { Handle, Position, useNodeId, useStore } from 'reactflow';

const CustomHandle = ({
  handles,
}: {
  handles?: WorkflowNodeDataHandlesProps[];
}) => {
  const {
    connectionNodeId, // 当鼠标开始拖动时，这个 handle 所处的 Node 的 id
    nodeInternals,
    edges,
    connectionEndHandle,
    connectionHandleId,
    connectionStartHandle,
  } = useStore(
    useCallback(
      (store) => ({
        connectionNodeId: store.connectionNodeId,
        nodeInternals: store.nodeInternals,
        edges: store.edges,
        connectionStartHandle: store.connectionStartHandle,
        connectionEndHandle: store.connectionEndHandle,
        connectionHandleId: store.connectionHandleId,
      }),
      [],
    ),
  );

  // console.log('connectionNodeId', connectionNodeId);
  // console.log('nodeInternals', nodeInternals);
  // console.log('edges', edges);
  // console.log('connectionStartHandle', connectionStartHandle);
  // console.log('connectionEndHandle', connectionEndHandle);
  // console.log('connectionHandleId', connectionHandleId);
  const parentId = useNodeId();

  // 是否可以连接
  const isHandleConnectable = useMemo(() => {
    return (key: string) => {
      if (!connectionNodeId) {
        return true;
      }

      if (isConnected) {
        return false;
      }

      // 当且仅当 handleID 中的 key 与 结束组件的 handle 的 key 相等时，才可以连接
      if (connectionStartHandle?.handleId?.split('_').pop() === key) {
        return true;
      }
      return false;
    };
  }, [connectionStartHandle]);

  // 是否正在连接
  const isConnecting = !!connectionNodeId;
  const isConnected = edges.some(
    (edge) =>
      edge.sourceHandle === connectionStartHandle &&
      edge.targetHandle === connectionEndHandle,
  );
  const onConnect = (params: any) => {
    console.log('handle onConnect', params);
  };

  return (
    <div className="-mx-3 flex justify-between">
      {/* Left Container */}
      <div className="flex flex-col">
        {handles &&
          handles
            .filter((handle) => handle.type === 'target')
            .map((handle) => (
              <div
                key={handle.key}
                className={clsx('flex items-center', 'relative mb-2 h-6')}
              >
                <div
                  className={clsx(
                    'flex items-center rounded px-3 py-1.5',
                    isConnecting &&
                      isHandleConnectable(handle.key) &&
                      'animate-pulse bg-neutral-200/50 dark:bg-neutral-700/50',
                  )}
                >
                  <Handle
                    id={`${parentId}_target_${handle.key}`}
                    type="target"
                    position={Position.Left}
                    isConnectable={isHandleConnectable(handle.key)}
                    className="absolute left-0 right-0 top-0 h-full w-full transform-none rounded-none opacity-0"
                  />
                  <svg
                    id="start"
                    aria-hidden="true"
                    viewBox="-5 -5 10 10"
                    fill="none"
                    className={clsx(
                      'h-2.5 w-2.5 stroke-slate-500/30',
                      isConnecting &&
                        isHandleConnectable(handle.key) &&
                        'fill-indigo-600 stroke-black/50 dark:stroke-white/50',
                      handle.hasConnected && 'fill-teal-600',
                    )}
                  >
                    <circle cx="0" cy="0" r="4.5"></circle>
                  </svg>
                  <span className="pl-3 font-display text-2xs font-semibold">
                    {handle.key.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
      </div>
      {/* Right Container */}
      <div className="flex flex-col">
        {handles &&
          handles
            .filter((handle) => handle.type === 'source')
            .map((handle) => (
              <div
                key={handle.key}
                className={clsx('flex items-center', 'relative mb-2 h-6')}
              >
                <div
                  className={clsx(
                    'flex items-center rounded px-3 py-1.5 hover:bg-neutral-100/50 hover:dark:bg-neutral-700/50',
                  )}
                >
                  <span className="pr-3 font-display text-2xs font-semibold">
                    {handle.key.toUpperCase()}
                  </span>
                  <svg
                    id="start"
                    aria-hidden="true"
                    viewBox="-5 -5 10 10"
                    fill="none"
                    className={clsx(
                      'h-2.5 w-2.5 stroke-slate-500/30 hover:stroke-black/50 dark:hover:stroke-white/50',
                      handle.hasConnected && 'fill-teal-600',
                    )}
                  >
                    <circle cx="0" cy="0" r="4.5"></circle>
                  </svg>
                  <Handle
                    id={`${parentId}_source_${handle.key}`}
                    type="source"
                    onConnect={onConnect}
                    position={Position.Right}
                    isConnectable={isHandleConnectable(handle.key)}
                    className={clsx(
                      'absolute left-0 right-0 top-0 h-full w-full transform-none rounded-none opacity-0',
                    )}
                  />
                </div>
              </div>
            ))}
      </div>
    </div>
    // <>
    //   {handles &&
    //     Object.entries(handles).map(([key, value]) => (
    //       <div
    //         key={key}
    //         className={clsx('flex items-center', 'relative mb-2 h-6')}
    //       >
    //         {/* Left Input Control */}
    //         {value.as === 'input' && (
    //           <div
    //             className={clsx(
    //               ' absolute left-0 -mx-3 -my-1.5 flex items-center rounded px-3 py-1.5',
    //               isConnecting &&
    //                 isHandleConnectable(key) &&
    //                 'animate-pulse bg-neutral-200/50 dark:bg-neutral-700/50',
    //             )}
    //           >
    //             <Handle
    //               id={`${parentId}-input-${key}`}
    //               type="target"
    //               position={Position.Left}
    //               isConnectable={isHandleConnectable(key)}
    //               className=" absolute left-0 right-0 top-0 h-full w-full transform-none rounded-none opacity-0 "
    //               // 不能作为连接的起点
    //             />

    //             <svg
    //               id="start"
    //               aria-hidden="true"
    //               viewBox="-5 -5 10 10"
    //               fill="none"
    //               className={clsx(
    //                 'h-2.5 w-2.5  stroke-slate-500/30',

    //                 isConnecting &&
    //                   isHandleConnectable(key) &&
    //                   'fill-teal-600 stroke-black/50 dark:stroke-white/50',
    //               )}
    //             >
    //               <circle cx="0" cy="0" r="4.5"></circle>
    //             </svg>
    //             <span className="pl-3 font-display text-2xs font-semibold">
    //               {/* {key.charAt(0).toUpperCase() + key.slice(1)} */}
    //               {key.toUpperCase()}
    //             </span>
    //           </div>
    //         )}

    //         {/* Right Output Control */}
    //         {value.as === 'output' && (
    //           <div
    //             className={clsx(
    //               ' absolute right-0 -mx-3 -my-1.5 flex items-center rounded px-3 py-1.5 hover:bg-neutral-100/50 hover:dark:bg-neutral-700/50',
    //             )}
    //           >
    //             <span className="pr-3 font-display text-2xs font-semibold">
    //               {key.toUpperCase()}
    //             </span>
    //             <svg
    //               id="start"
    //               aria-hidden="true"
    //               viewBox="-5 -5 10 10"
    //               fill="none"
    //               className="h-2.5 w-2.5  stroke-slate-500/30 hover:stroke-black/50 dark:hover:stroke-white/50"
    //             >
    //               <circle
    //                 className="fill-teal-600"
    //                 cx="0"
    //                 cy="0"
    //                 r="4.5"
    //               ></circle>
    //             </svg>
    //             <Handle
    //               id={`${parentId}-output-${key}`}
    //               type="source"
    //               // 这个属性用来判断是否可以连接，会在鼠标悬浮时始终调用
    //               //   isValidConnection={(connection) => {
    //               //     console.log('isValidConnection', connection);
    //               //     return true;
    //               //   }}
    //               // 这个方法获得连接的对象，只在放开鼠标后调用
    //               onConnect={onConnect}
    //               position={Position.Right}
    //               isConnectable={isHandleConnectable(key)}
    //               className={clsx(
    //                 ' absolute left-0 right-0 top-0 h-full w-full transform-none rounded-none opacity-0',
    //               )}
    //             />
    //           </div>
    //         )}
    //       </div>
    //     ))}
    // </>
  );
};

export default CustomHandle;
