'use client';
import { WorkflowProps } from '@/@types/workflow';
import { RootReducerProps } from '@/app/store';
import PrimaryButton from '@/components/elements/buttons/PrimaryButtons';
import { BASE_URL, MEDIA_URL } from '@/config';
import createAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { setWorkflowList } from '@/store/workflow/workflowSlice';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { FolderArrowDownIcon, PlusIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { GoRepoTemplate } from 'react-icons/go';
import { useDispatch, useSelector } from 'react-redux';
import SidebarContextMenu from '../(dashboard)/workflow/ContextMenu/SidebarContextMenu';

const WorkflowList: React.FC = () => {
  const jwtAxios = createAxiosWithInterceptors();
  const url = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { workflowList } = useSelector(
    (state: RootReducerProps) => state.workflow,
  );

  const { name, uuid } = useSelector(
    (state: RootReducerProps) => state.workflow.workflow,
  );

  const [contextMenuPos, setContextMenuPos] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WorkflowProps | null>(null);
  const [expanded, setExpanded] = useState(false);

  const fetchWorkflows = async () => {
    try {
      const res = await jwtAxios.get(
        `/workflow/vs/workflow/?by_user=true`,
      );
      dispatch(setWorkflowList(res.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const createWorkflows = async () => {
    try {
      const res = await jwtAxios.post(`${BASE_URL}/workflow/vs/workflow/`, {
        name: 'Untitled',
      });
      dispatch(setWorkflowList([...workflowList, res.data]));
      router.push(`/workflow/${res.data.uuid}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateWorkflow = () => {
    createWorkflows();
  };

  const handleImportWorkflow = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          const res = await jwtAxios.post(`${MEDIA_URL}/v1/workflow/`, json);
          dispatch(setWorkflowList([...workflowList, res.data]));
          router.push(`/workflow/${res.data.uuid}`);
        } catch (error) {
          alert('Invalid Workflow File');
        }
      };
      reader.readAsText(file);
    }

    // Reset the input value to allow re-uploading the same file
    event.target.value = '';
  };

  const handleCloseContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuVisible(false);
    setSelectedItem(null);
  };

  return (
    <Disclosure
      defaultOpen
      as="div"
      className="-mt-5 flex h-fit flex-col border-t pt-4 dark:border-white/10"
    >
      {contextMenuVisible && (
        <SidebarContextMenu
          id={selectedItem?.uuid || ''}
          top={contextMenuPos.y}
          left={contextMenuPos.x}
          handleCloseContextMenu={handleCloseContextMenu}
        />
      )}
      <div
        className={clsx('inert group/expand flex w-full flex-col gap-y-4 px-2')}
      >
        <div
          className={clsx(
            'mb-4 flex w-full items-center justify-between gap-x-2',
          )}
        >
          <div className=" flex items-center justify-center gap-2">
            <span className=" font-display text-sm font-bold">Workflows</span>
            <DisclosureButton
              onClick={() => setExpanded(!expanded)}
              name="button"
              type="button"
              className="flex items-center rounded bg-transparent p-0.5 opacity-0 transition-opacity duration-300 ease-in-out hover:bg-neutral-300/20 group-hover/expand:opacity-100 dark:hover:bg-neutral-700/20"
            >
              <ChevronDownIcon
                className={clsx(
                  'h-4 w-4 transition-transform duration-300 ease-in-out dark:text-white',
                  expanded && '-rotate-90 transform ',
                )}
              />
            </DisclosureButton>
          </div>
          <div className="flex items-center justify-center">
            <PrimaryButton
              onClick={handleCreateWorkflow}
              size="sm"
              className="flex items-center gap-1 bg-transparent hover:bg-neutral-300/30 dark:hover:bg-neutral-700/30"
            >
              <PlusIcon className="h-4 w-4 dark:text-white" />
              <span className="sr-only">New</span>
            </PrimaryButton>
            <PrimaryButton
              size="sm"
              className="flex items-center gap-1 bg-transparent hover:bg-neutral-300/30 dark:hover:bg-neutral-700/30"
            >
              <label
                htmlFor="import-workflow"
                className=" pointer-events-auto cursor-pointer"
              >
                <FolderArrowDownIcon className="h-4 w-4 dark:text-white" />
              </label>
            </PrimaryButton>
            <input
              id="import-workflow"
              name="import-workflow"
              aria-label="import-workflow"
              type="file"
              accept="application/json"
              onChange={handleImportWorkflow}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>
      <DisclosurePanel
        transition
        className="inert flex origin-top flex-col items-center gap-4 pb-2
      transition duration-200 ease-in-out data-[closed]:-translate-y-6 data-[closed]:opacity-0
      "
      >
        {workflowList
          .slice()
          .sort(
            (a, b) =>
              Date.parse(new Date(b.updated_at).toLocaleString()) -
              Date.parse(new Date(a.updated_at).toLocaleString()),
          )
          .map((workflow, i) => (
            <div
              key={i}
              onClick={() => {
                router.push(`/workflow/${workflow.uuid}`);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenuPos({ x: e.clientX, y: e.clientY });
                setContextMenuVisible(true);
                setSelectedItem(workflow);
              }}
              className={clsx(
                'group relative flex h-fit w-full flex-shrink-0 cursor-pointer select-none items-center justify-between rounded shadow-sm ring-1 ring-neutral-50 hover:ring-0 dark:ring-neutral-800/40',
                workflow.uuid === url.split("/")[2] &&
                  ' bg-gradient-to-r  from-sky-100 to-teal-100 dark:from-sky-600  dark:to-indigo-600',
              )}
            >
              {selectedItem?.uuid === workflow.uuid && (
                <div className="absolute -inset-px -z-10 rounded border border-transparent opacity-100 [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.slate.800)]" />
              )}
              <div className="absolute -inset-px -z-10 rounded border border-transparent opacity-0 [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.slate.800)]" />
              <div className="flex h-full w-full flex-col items-start justify-between gap-y-2 px-3 py-2 text-sm">
                <div className="flex w-full items-center justify-between">
                  <span className="line-clamp-1 text-xs">
                    {workflow.name || 'Untitled'}
                  </span>
                  <div className=" flex items-center justify-center gap-2">
                    {workflow.as_template && (
                      <GoRepoTemplate className="h-4 w-4 text-green-400 dark:text-green-300" />
                    )}
                    <img
                      src={
                        workflow.creator.avatar.startsWith('http')
                          ? workflow.creator.avatar
                          : `${MEDIA_URL}${workflow.creator.avatar}`
                      }
                      alt="avatar"
                      className="h-5 w-5 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </DisclosurePanel>
    </Disclosure>
  );
};

export default WorkflowList;
