import { WorkflowNodeDataHandlesProps } from '@/@types/workflow';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import { Handle, Position, useNodeId, useStore } from 'reactflow';

const CustomHandle = ({
  minimized,
  handles,
}: {
  minimized?: boolean;
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
      <div
        className={clsx(
          'flex flex-col',
          minimized && 'absolute left-0 top-0 -z-[9999] opacity-0',
        )}
      >
        {handles &&
          handles
            .filter((handle) => handle.type === 'target')
            .map((handle) => (
              <div
                key={handle.key}
                className={clsx(
                  'flex items-center',
                  minimized ? 'absolute' : 'relative mb-2 h-6',
                )}
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
      <div
        className={clsx(
          'flex flex-col',
          minimized && 'absolute right-0 top-0 -z-[9999] opacity-0',
        )}
      >
        {handles &&
          handles
            .filter((handle) => handle.type === 'source')
            .map((handle) => (
              <div
                key={handle.key}
                className={clsx(
                  'flex items-center',
                  minimized ? 'absolute -translate-x-full': 'relative mb-2 h-6',
                )}
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
  );
};

export default CustomHandle;
