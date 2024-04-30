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
        className=""
      >
        <MiniMap
          maskColor="rgba(0,0,0,0)"
          nodeBorderRadius={5}
          nodeColor={(n) => {
            if (n.type === 'fileSelect') return '#FFCC0080';
            if (n.type === 'structureInput') return '#FFCCFF80';
            if (n.type === 'solver') return 'rgba(129,140, 248,0.5)';
            return 'rgba(129,140, 248,0.2)';
          }}
          className=" rounded-xl border bg-white shadow-lg   dark:border-neutral-800/40 dark:bg-black "
        />
      </ReactFlow>
    </>
  );
}
