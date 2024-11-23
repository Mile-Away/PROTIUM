import { WorkflowNodeDataHandlesProps } from '@/@types/workflow';
import { RootReducerProps } from '@/app/store';
import {
  connectEdges,
  setContextMenuVisible,
  setContextMenuX,
  setContextMenuY,
  setEdges,
  setNodes,
} from '@/store/workflow/workflowSlice';
import { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactFlow, {
  Connection,
  EdgeChange,
  HandleType,
  MiniMap,
  Node,
  NodeChange,
  useReactFlow,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import NodeContextMenu, {
  NodeContextMenuProps,
} from '../ContextMenu/NodeContextMenu';
import RootContextMenu, {
  PaneContextMenuProps,
} from '../ContextMenu/RootContextMenu';
import nodeTypes, { nodeColors } from '../nodes/nodeTypes';

export default function RootReactFlow() {
  let level = 0;

  const { screenToFlowPosition, getNode, addEdges } = useReactFlow();

  const { nodes, edges, contextMenuVisible } = useSelector(
    (state: RootReducerProps) => state.workflow,
  );

  const [nodeMenu, setNodeMenu] = useState<NodeContextMenuProps | null>(null);
  const [paneMenu, setPaneMenu] = useState<PaneContextMenuProps | null>(null);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const connectingNodeId = useRef<string | null>(null);
  const connectingHandleId = useRef<string | null>(null);
  const connectingHandleType = useRef<HandleType | null>(null);
  const connectingHandleKey = useRef<string | null>(null);
  const connectingHandleRope = useRef<string | null>(null);
  const dispatch = useDispatch();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => dispatch(setNodes(changes)),
    [setNodes],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      dispatch(setEdges(changes));
      // console.log('edges', edges);
    },

    [setEdges],
  );
  const onConnect = useCallback(
    (connection: Connection) => dispatch(connectEdges(connection)),
    [setEdges],
  );

  const onConnectStart = useCallback(
    (
      _: any,
      {
        nodeId,
        handleId,
        handleType,
      }: {
        nodeId: string | null;
        handleId: string | null;
        handleType: HandleType | null;
      },
    ) => {
      connectingNodeId.current = nodeId;
      connectingHandleId.current = handleId;
      connectingHandleType.current = handleType;

      if (nodeId && handleId) {
        connectingHandleKey.current = handleId.split('_').pop()!;

        const node = getNode(nodeId);

        if (node) {
          const handle = node.data.handles.find(
            (handle: WorkflowNodeDataHandlesProps) =>
              handle.key === connectingHandleKey.current,
          );
          if (handle) {
            connectingHandleRope.current = handle.rope;
          }
        }
      }
    },
    [],
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!connectingNodeId.current || !connectingHandleId.current) return;

      const target = event.target as HTMLElement;

      const targetIsPane: boolean =
        target.classList.contains('react-flow__pane');

      const connectingHandleKey = connectingHandleId.current.split('_').pop();

      console.log('connectingHandleKey', connectingHandleKey);

      if (targetIsPane) {
        if ('touches' in event) {
          // TODO: Support touch event
          alert('Not support touch event yet');
        } else {
          let relativeX =
            event.clientX -
            reactFlowWrapper.current?.getBoundingClientRect().left!;
          let relativeY =
            event.clientY -
            reactFlowWrapper.current?.getBoundingClientRect().top!;

          // Add a new node;
          dispatch(setContextMenuX(relativeX));
          dispatch(setContextMenuY(relativeY));

          const endUuid = uuidv4();

          // const nodeKey = Object.keys(NodeMapping).find(
          //   (key) => key === connectingHandleRope.current,
          // );

          // if (nodeKey) {
          //   dispatch<any>(fetchNodeTemplate({ template: nodeKey, id: endUuid }));
          // }

          // // Add Edges;
          // const endType =
          //   connectingHandleType.current === 'target' ? 'source' : 'target';

          // if (endType === 'source') {
          //   dispatch(
          //     connectEdges({
          //       source: endUuid,
          //       sourceHandle: `${endUuid}_${endType}_${connectingHandleKey}`,
          //       target: connectingNodeId.current!,
          //       targetHandle: connectingHandleId.current!,
          //     }),
          //   );
          // } else if (endType === 'target') {
          //   dispatch(
          //     connectEdges({
          //       source: connectingNodeId.current!,
          //       sourceHandle: connectingHandleId.current!,
          //       target: endUuid,
          //       targetHandle: `${endUuid}_${endType}_${connectingHandleKey}`,
          //     }),
          //   );
          // }
        }
      }
    },
    [screenToFlowPosition],
  );

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node<any, string | undefined>) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.

      if (reactFlowWrapper.current) {
        const pane = reactFlowWrapper.current.getBoundingClientRect();

        // 计算相对于容器的 X，Y 坐标
        const relativeX = event.clientX - pane.left;
        const relativeY = event.clientY - pane.top;

        setNodeMenu({
          id: node.id,
          left: event.clientX < pane.width - 200 ? relativeX : undefined,
          right:
            event.clientX >= pane.width - 200
              ? pane.width - relativeX
              : undefined,
          top: event.clientY < pane.height - 200 ? relativeY : undefined,
          bottom:
            event.clientY >= pane.height - 200
              ? pane.height - relativeY
              : undefined,
        });
      }
    },
    [setNodeMenu],
  );

  const onPaneContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (reactFlowWrapper.current) {
        const pane = reactFlowWrapper.current.getBoundingClientRect();

        // 计算相对于容器的 X，Y 坐标
        const relativeX = e.clientX - pane.left;
        const relativeY = e.clientY - pane.top;

        // 更新坐标
        dispatch(setContextMenuX(relativeX));
        dispatch(setContextMenuY(relativeY));
        dispatch(setContextMenuVisible(true));
      }
    },
    [contextMenuVisible],
  );

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => {
    setNodeMenu(null);
    dispatch(setContextMenuVisible(false));
    level = 0;
  }, [setNodeMenu]);

  return (
    <>
      <ReactFlow
        ref={reactFlowWrapper}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        onPaneClick={onPaneClick}
        onNodeClick={onPaneClick}
        onPaneContextMenu={onPaneContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        // zoomOnScroll={false}
        // fitView
        className="z-0"
      >
        <MiniMap
          maskColor="rgba(0,0,0,0)"
          nodeBorderRadius={5}
          nodeColor={nodeColors}
          className="rounded-xl border bg-white shadow-lg   dark:border-neutral-800/40 dark:bg-black "
        />
        {nodeMenu && <NodeContextMenu onClick={onPaneClick} {...nodeMenu} />}
        <RootContextMenu onClick={onPaneClick} level={level} />
      </ReactFlow>
    </>
  );
}
