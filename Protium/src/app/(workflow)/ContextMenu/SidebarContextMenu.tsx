import { ContextMenuButton } from '@/components/elements/buttons/ContextMenuButton';
import clsx from 'clsx';

import { RootReducerProps } from '@/app/store';
import { BASE_URL, MEDIA_URL } from '@/config';
import createAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import convertWorkflow from '@/lib/convertWorkflow';
import { setWorkflowList } from '@/store/workflow/workflowSlice';
import { Dispatch } from '@reduxjs/toolkit';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const jwtAxios = createAxiosWithInterceptors();

  const { workflow, nodes, edges, workflowList } = useSelector(
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

  const handleDeleteWorkflow = useCallback(async () => {
    const ensure = window.confirm(
      'Are you sure you want to delete this workflow?',
    );
    if (ensure) {
      try {
        const res = await jwtAxios.delete(
          `${BASE_URL}/workflow/workflow/${id}/`,
        );
        if (res.status === 204) {
          const newWorkflowList = workflowList.filter(
            (item) => item.uuid !== id,
          );
          dispatch(setWorkflowList(newWorkflowList));
        }
        router.push('/');
      } catch (error) {
        console.error(error);
      }
    }
    handleCloseContextMenu(new MouseEvent('click') as any);
  }, [id]);

  const handleDuplicateWorkflow = useCallback(async () => {
    try {
      const content = convertWorkflow({ ...workflow, nodes, edges });

      const res = await jwtAxios.post(`${MEDIA_URL}/v1/workflow/`, content);

      dispatch(setWorkflowList([...workflowList, res.data]));
      router.push(`/workflow/${res.data.uuid}`);
    } catch (error) {
      console.error(error);
    }

    handleCloseContextMenu(new MouseEvent('click') as any);
  }, [id]);

  const handlePublishWorkflow = useCallback(async () => {
    console.log('Publishing workflow', {
      workflow: id,
      title: workflow.name,
    });
    try {
      const res = await jwtAxios.post(
        `${BASE_URL}/flociety/vs/workflows/library/`,
        {
          workflow_uuid: id,
          title: workflow.name,
        },
      );
      alert('Workflow published successfully');

      
      
    } catch (error) {
      alert('Failed to publish workflow, please try again');
      console.error(error);
    }

    handleCloseContextMenu(new MouseEvent('click') as any);
  }, [id]);

  return (
    <div
      className={clsx(
        'fixed z-[9999] p-1',
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
              className={clsx(
                'w-full',
                item.action === 'delete' && 'text-red-500',
              )}
              type="button"
              arrow={item.arrow}
              onClick={() =>
                item.action === 'export'
                  ? handleExportWorkflow()
                  : item.action === 'delete'
                    ? handleDeleteWorkflow()
                    : item.action === 'duplicate'
                      ? handleDuplicateWorkflow()
                      : item.action === 'publish'
                        ? handlePublishWorkflow()
                        : undefined
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
