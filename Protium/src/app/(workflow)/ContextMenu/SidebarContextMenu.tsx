import { ContextMenuButton } from '@/components/elements/buttons/ContextMenuButton';
import clsx from 'clsx';
import { useReactFlow } from 'reactflow';

import { RootReducerProps } from '@/app/store';
import convertWorkflow from '@/lib/convertWorkflow';
import { Dispatch } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sideContextMenuItems } from './contextMenuItems';

export interface SidebarContextMenuProps {
  id: string;
  top: number;
  left: number;
  right?: number;
  bottom?: number;
  handleCloseContextMenu: (e: React.MouseEvent) => void;
}

export default function SidebarContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  handleCloseContextMenu,
  ...props
}: SidebarContextMenuProps & React.HTMLProps<HTMLDivElement>) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();

  const { workflow, nodes, edges } = useSelector(
    (state: RootReducerProps) => state.workflow,
  );

  const dispatch = useDispatch();

  const onContextMenuClick = (
    clickEvent: (() => (dispatch: Dispatch) => void) | undefined,
  ) => {
    if (clickEvent) {
      clickEvent()(dispatch);
    }
  };

  const handleExportWorkflow = useCallback(() => {
    console.log('>>>>', {
      ...workflow,
      nodes,
      edges,
    });
    const outputs = convertWorkflow({ ...workflow, nodes, edges });

    console.log('exportWorkflow', outputs);

    const blob = new Blob([JSON.stringify(outputs, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflow.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    handleCloseContextMenu(new MouseEvent('click') as any);
  }, [workflow, nodes, edges, handleCloseContextMenu]);

  return (
    <div
      className={clsx(
        'fixed z-[9999] p-1 ',
        'rounded-md border border-neutral-200 bg-white  dark:border-neutral-700 dark:bg-neutral-800',
        'shadow-lg dark:shadow-black',
        'h-fit w-28 min-w-fit',
        'select-none',
      )}
      style={{
        top: top,
        left: left,
      }}
      {...props}
    >
      <div className="flex flex-col items-start justify-around space-y-2 text-xs">
        {sideContextMenuItems.map((item) => (
          <div key={item.label} className="relative w-full">
            <ContextMenuButton
              className="w-full"
              type="button"
              arrow={item.arrow}
              onClick={() =>
                item.action === 'export' ? handleExportWorkflow() : undefined
              }
            >
              <div className="flex items-center">
                <item.icon className="mr-1 h-3 w-3" />
                <span>{item.label}</span>
              </div>
            </ContextMenuButton>
          </div>
        ))}
      </div>
      <div
        className="fixed inset-0 z-[-1] bg-transparent"
        onClick={(e) => handleCloseContextMenu(e)}
        onContextMenu={(e) => handleCloseContextMenu(e)}
      />
    </div>
  );
}
