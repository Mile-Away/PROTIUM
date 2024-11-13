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
import {
  ArrowsUpDownIcon,
  BeakerIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';
import { FolderArrowDownIcon, PlusIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const EnvironmentList: React.FC = () => {
  const jwtAxios = createAxiosWithInterceptors();
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
        `${BASE_URL}/workflow/vs/workflow/?by_user=true`,
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
      <DisclosureButton
        className={clsx('inert group/expand flex w-full flex-col gap-y-4 px-2')}
      >
        <div
          className={clsx(
            'mb-4 flex w-full items-center justify-between gap-x-2',
          )}
        >
          <div className=" flex items-center justify-center gap-2">
            <span className=" font-display text-sm font-bold">Environment</span>
            <button
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
            </button>
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
                <ArrowsUpDownIcon className="h-4 w-4 dark:text-white" />
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
      </DisclosureButton>
      <DisclosurePanel
        transition
        className="inert flex origin-top flex-col items-center gap-4 pb-2 transition duration-200 ease-in-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
      >
        <div>
          <button
            type="button"
            onClick={() => router.push('/environment/laboratory')}
            className="relative flex w-full items-center rounded-lg border-2 border-dashed border-gray-300 px-8 py-4 text-center hover:border-gray-400 focus:outline-none dark:border-gray-500 hover:dark:border-gray-300"
          >
            <BeakerIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300" />
            <span className="ml-2 block text-xs font-semibold text-gray-900 dark:text-white">
              Create Laboratory Environment
            </span>
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => router.push('/environment/calculation')}
            className="relative flex w-full items-center rounded-lg border-2 border-dashed border-gray-300 px-8 py-4 text-center hover:border-gray-400 focus:outline-none dark:border-gray-500 hover:dark:border-gray-300"
          >
            {/* <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
              />
            </svg> */}
            <CpuChipIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300" />
            <span className="ml-2 block text-xs font-semibold text-gray-900 dark:text-white">
              Create Calculation Environment
            </span>
          </button>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default EnvironmentList;
