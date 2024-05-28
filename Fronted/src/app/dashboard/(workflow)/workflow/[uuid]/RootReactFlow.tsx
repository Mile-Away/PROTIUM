import { RootReducerProps } from '@/app/store';
import {
  connectEdges,
  setEdges,
  setNodes,
} from '@/store/workflow/workflowSlice';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactFlow, {
  Connection,
  EdgeChange,
  MiniMap,
  NodeChange,
} from 'reactflow';
import nodeTypes from './nodeTypes';
import { nodeColors } from './nodeTypes';
export default function RootReactFlow() {
  const { nodes, edges } = useSelector(
    (state: RootReducerProps) => state.workflow,
  );

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

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        // fitView
        className=""
      >
        <MiniMap
          maskColor="rgba(0,0,0,0)"
          nodeBorderRadius={5}
          nodeColor={nodeColors}
          className=" rounded-xl border bg-white shadow-lg   dark:border-neutral-800/40 dark:bg-black "
        />
      </ReactFlow>
    </>
  );
}


