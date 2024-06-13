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
  MiniMap,
  Node,
  NodeChange,
} from 'reactflow';
import NodeContextMenu, {
  NodeContextMenuProps,
} from '../../ContextMenu/NodeContextMenu';
import RootContextMenu, { PaneContextMenuProps } from '../../ContextMenu/RootContextMenu';
import nodeTypes, { nodeColors } from './nodeTypes';

export default function RootReactFlow() {
  const { nodes, edges, contextMenuVisible } = useSelector(
    (state: RootReducerProps) => state.workflow,
  );
  const [nodeMenu, setNodeMenu] = useState<NodeContextMenuProps | null>(null);
  const [paneMenu, setPaneMenu] = useState<PaneContextMenuProps | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  let level = 0;
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => dispatch(setNodes(changes)),
    [setNodes],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => dispatch(setEdges(changes)),
    [setEdges],
  );
  const onConnect = useCallback(
    (connection: Connection) => dispatch(connectEdges(connection)),
    [setEdges],
  );

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node<any, string | undefined>) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.

      if (ref.current) {
        const pane = ref.current.getBoundingClientRect();

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

  const onPaneContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (ref.current) {
      const pane = ref.current.getBoundingClientRect();

      // 计算相对于容器的 X，Y 坐标
      const relativeX = e.clientX - pane.left;
      const relativeY = e.clientY - pane.top;

      // 更新坐标
      dispatch(setContextMenuX(relativeX));
      dispatch(setContextMenuY(relativeY));
      dispatch(setContextMenuVisible(true));
    }
  }, [contextMenuVisible]);

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => {
    setNodeMenu(null);
    dispatch(setContextMenuVisible(false));
    level = 0;
  }, [setNodeMenu]);

  return (
    <>
      <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onPaneClick={onPaneClick}
        onNodeClick={onPaneClick}
        onPaneContextMenu={onPaneContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        // fitView
        className=""
      >
        <MiniMap
          maskColor="rgba(0,0,0,0)"
          nodeBorderRadius={5}
          nodeColor={nodeColors}
          className=" rounded-xl border bg-white shadow-lg   dark:border-neutral-800/40 dark:bg-black "
        />
        {nodeMenu && <NodeContextMenu onClick={onPaneClick} {...nodeMenu} />}
        <RootContextMenu onClick={onPaneClick} level={level} />
      </ReactFlow>
    </>
  );
}
