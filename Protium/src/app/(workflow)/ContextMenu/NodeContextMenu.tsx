import { ContextMenuButton } from '@/components/elements/buttons/ContextMenuButton';
import clsx from 'clsx';
import { useCallback } from 'react';
import { Node, useReactFlow } from 'reactflow';
import { nodeContextMenuItems } from './contextMenuItems';

import { Dispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
export interface NodeContextMenuProps {
  id: string;
  top: number | undefined;
  left: number | undefined;
  right: number | undefined;
  bottom: number | undefined;
}

export default function NodeContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}: NodeContextMenuProps & React.HTMLProps<HTMLDivElement>) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();

  const node: Node<any> | undefined = getNode(id);

  console.log('node', node?.data.header);
  const duplicateNode = useCallback(() => {
    if (!node) return;
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    addNodes({
      ...node,
      selected: false,
      dragging: false,
      id: `${node.id}-copy`,
      position,
    });
  }, [id, getNode, addNodes]);

  const dispatch = useDispatch();

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);

  const onContextMenuClick = (
    clickEvent: (() => (dispatch: Dispatch) => void) | undefined,
  ) => {
    if (clickEvent) {
      clickEvent()(dispatch);
    }
  };

  return (
    <div
      style={{ top, left, right, bottom }}
      className={clsx(
        'absolute z-[9999] p-1 ',
        'rounded-md border border-neutral-200  dark:border-neutral-700 dark:bg-neutral-800 bg-white',
        'shadow-lg dark:shadow-black',
        'h-fit w-28 min-w-fit',
        'select-none',
      )}
      {...props}
    >
      <div className="flex flex-col items-start justify-around space-y-2 text-xs">
        {nodeContextMenuItems.map((item) => (
          <div key={item.label} className="relative w-full">
            <ContextMenuButton
              className="w-full"
              type="button"
              onClick={() => onContextMenuClick(item.onClick)}
              arrow={item.arrow}
            >
              <div className="flex items-center">
                <item.icon className="mr-1 h-3 w-3" />
                <span>{item.label}</span>
              </div>
            </ContextMenuButton>
          </div>
        ))}
        {node?.data.header && (
          <div className="w-full border-t px-2 pt-2 pb-1 flex justify-end dark:border-neutral-700">
            <span className="text-[0.6rem] font-semibold line-clamp-1">
              Node: {node.data.header}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
