'use client';
import { RootReducerProps } from '@/app/store';
import PrimaryButton from '@/components/elements/buttons/PrimaryButtons';
import { BASE_URL, MEDIA_URL } from '@/config';
import useAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { formatTime } from '@/lib/formatDate';
import { WorkflowProps } from '@/store/workflow/workflowSlice';
import { PlusIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function WorkflowList() {
  const jwtAxios = useAxiosWithInterceptors();

  const router = useRouter();

  const dispatch = useDispatch();

  const { name, uuid } = useSelector(
    (state: RootReducerProps) => state.workflow.workflow,
  );

  const [workflows, setWorkflows] = useState<WorkflowProps[]>([]);

  const fetchWorkflows = async () => {
    try {
      const res = await jwtAxios.get(`${BASE_URL}/workflow/vs/workflow/`);
      setWorkflows(res.data);
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
      setWorkflows([...workflows, res.data]);
      router.push(`/workflow/${res.data.uuid}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateWorkflow = () => {
    createWorkflows();
  };

  return (
    <>
      <div
        className={clsx(
          'inert flex w-full flex-col gap-y-4 px-2',
        )}
      >
        <div
          className={clsx(
            'mb-4 flex w-full items-center justify-between gap-x-2',
          )}
        >
          <span className=" font-display text-sm font-bold">Workflows</span>
          <PrimaryButton
            onClick={handleCreateWorkflow}
            size="sm"
            className="flex items-center gap-1 bg-transparent hover:bg-neutral-300/30 dark:hover:bg-neutral-700/30"
          >
            <PlusIcon className="h-4 w-4 text-gray-400 dark:text-white" />
            <span className=" text-sm">New</span>
          </PrimaryButton>
        </div>
      </div>
      <div className='flex flex-col items-center gap-4 p-1 overflow-y-scroll inert'>
        {workflows
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
              className={clsx(
                'group relative flex h-fit w-full flex-shrink-0 cursor-pointer select-none items-center justify-between rounded shadow-sm ring-1 ring-neutral-50 hover:ring-0 dark:ring-neutral-800/40',
                workflow.uuid === uuid &&
                  ' bg-gradient-to-r  from-sky-100 to-teal-100 dark:from-sky-600  dark:to-indigo-600',
              )}
            >
              <div className="absolute -inset-px -z-10 rounded border border-transparent opacity-0 [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.slate.800)]" />
              <div className="flex h-full w-full flex-col items-start justify-between gap-y-2 px-3 py-4 text-sm">
                <div className="flex w-full items-center justify-between">
                  <span className="line-clamp-1 font-semibold">
                    {workflow.name || 'Untitled'}
                  </span>

                  <img
                    src={`${MEDIA_URL}${workflow.creator.avatar}`}
                    alt="avatar"
                    className="h-5 w-5 rounded-full"
                  />
                </div>
                <div className="text-neutral-200">
                  {workflow.description && (
                    <span className="text-xs font-normal">
                      {workflow.description}
                    </span>
                  )}
                </div>
                <div className="flex w-full items-center justify-between text-2xs text-neutral-500">
                  {/* <span>{formatTime(workflow.created_at)}</span> */}
                  <span
                    className={clsx(
                      "text-nowrap",
                      workflow.uuid === uuid && 'dark:text-neutral-100',
                    )}
                  >
                    {formatTime(workflow.updated_at)}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
