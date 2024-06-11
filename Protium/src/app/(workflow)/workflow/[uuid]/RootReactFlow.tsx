import { RootReducerProps } from '@/app/store';
import {
  connectEdges,
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
import nodeTypes, { nodeColors } from './nodeTypes';

export default function RootReactFlow() {
  const { nodes, edges } = useSelector(
    (state: RootReducerProps) => state.workflow,
  );
  const [menu, setMenu] = useState<NodeContextMenuProps | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

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
      console.log(event.clientX, event.clientY);


      if (ref.current) {
        const pane = ref.current.getBoundingClientRect();

        console.log(pane.left, pane.top, pane.width, pane.height);
        // 计算相对于容器的 X，Y 坐标
        const relativeX = event.clientX - pane.left;
        const relativeY = event.clientY - pane.top;

        setMenu({
          id: node.id,
          top: event.clientY < pane.height - 200 ? relativeX : undefined,
          left: event.clientX < pane.width - 200 ? relativeY : undefined,
          right:
            event.clientX >= pane.width - 200
              ? pane.width - relativeX
              : undefined,
          bottom:
            event.clientY >= pane.height - 200
              ? pane.height - relativeY
              : undefined,
        });
      }
      console.log("You've clicked on a node!");
    },
    [setMenu],
  );

  console.log(menu)

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

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
        {menu && <NodeContextMenu onClick={onPaneClick} {...menu} />}
      </ReactFlow>
    </>
  );
}
