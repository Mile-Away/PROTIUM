'use client';
import { RootReducerProps } from '@/app/store';
import MiniSortButton from '@/components/elements/buttons/MiniSortButton';
import PrimaryButton from '@/components/elements/buttons/PrimaryButtons';
import { BASE_URL, MEDIA_URL } from '@/config';
import useAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { formatTime } from '@/lib/formatDate';
import { setWorkflowName, WorkflowProps } from '@/store/workflow/workflowSlice';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { ChevronRightIcon, PlusIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const options = [
  {
    title: 'Default',
    description: 'Sort by oldest creation time',
    current: true,
  },
  {
    title: 'Activity',
    description: 'Sort by latest updated',
    current: false,
  },
  {
    title: 'Created',
    description: 'Sort by most recent creation time',
    current: false,
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const jwtAxios = useAxiosWithInterceptors();
  const url = usePathname();
  const router = useRouter();

  const dispatch = useDispatch();
  const isHome = url === '/dashboard/workflow';

  const [showRecently, setShowRecently] = useState(isHome ? true : false);
  const [sort, setSort] = useState(options[0]);

  const { name, uuid } = useSelector(
    (state: RootReducerProps) => state.workflow.workflow,
  );

  const [workflows, setWorkflows] = useState<WorkflowProps[]>([]);

  const fetchWorkflows = async () => {
    try {
      const res = await jwtAxios.get(`${BASE_URL}/workflow/vs/workflow/`);
      setWorkflows(res.data);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createWorkflows = async () => {
    try {
      const res = await jwtAxios.post(`${BASE_URL}/workflow/vs/workflow/`, {
        name: 'Untitled',
      });
      setWorkflows([...workflows, res.data]);
      setShowRecently(false);
      router.push(`/dashboard/workflow/${res.data.uuid}`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      updateInputWidth(inputRef.current);
    }
  }, [name]);

  useEffect(() => {
    if (isHome) {
      setShowRecently(true);
    }
  }, [url]);

  const handleCreateWorkflow = () => {
    createWorkflows();
  };

  // 更行标题宽度
  const [showInput, setShowInput] = useState(false);
  const inputWidth = useRef(200); // 控制输入框和标题栏的宽度
  const inputRef = useRef<HTMLInputElement>(null);
  function updateInputWidth(inputElement: HTMLInputElement) {
    const inputValue = inputElement.value;
    const tempElement = document.createElement('span');
    tempElement.style.cssText =
      'position: absolute; left: -9999px; white-space: pre; font-family: font-display; font-weight: 500; font-size: 1rem;';
    tempElement.textContent = inputValue;
    document.body.appendChild(tempElement);
    const textWidth = tempElement.getBoundingClientRect().width;
    document.body.removeChild(tempElement);
    inputWidth.current = textWidth + 10;
  }

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateInputWidth(e.target);
    setWorkflows(
      workflows.map((item) =>
        item.uuid === uuid ? { ...item, name: e.target.value } : item,
      ),
    );
    dispatch(setWorkflowName(e.target.value));
  };
  return (
    <>
      <div
        className={clsx(
          'absolute left-4 top-4 z-[30] rounded bg-transparent px-2 py-1 shadow backdrop-blur-2xl ',
          'max-w-96 overflow-hidden transition-all duration-300 ease-in-out',
          ' bg-neutral-100/30 dark:bg-black/10 ',

          showRecently ? 'h-[calc(100%-2rem)] min-w-80' : 'h-10 w-auto',
        )}
      >
        {/* Header */}
        <div
          className={clsx(
            ' relative inline-flex h-8 w-fit items-center  justify-start gap-x-3 px-1 py-1 pr-2',
            'transition-all duration-300 ease-in-out',
          )}
        >
          {!isHome && (
            <div
              onClick={() => setShowRecently(!showRecently)}
              className=" absolute left-0 top-2 -m-2 cursor-pointer rounded p-2 hover:bg-neutral-300/30 dark:hover:bg-neutral-700/30"
            >
              <ChevronRightIcon
                className={clsx(
                  'h-4 w-4 transition-transform duration-300 ease-in-out',
                  showRecently ? 'rotate-90' : 'rotate-0',
                )}
              />
            </div>
          )}
          {showRecently ? (
            <span className="ml-6 font-display text-sm font-semibold">
              My Workflows
            </span>
          ) : showInput ? (
            <input
              ref={inputRef}
              value={name}
              onChange={handleChangeName}
              onBlur={() => setShowInput(false)}
              className="ml-6 max-w-72 bg-transparent font-display text-sm font-semibold focus:outline-none"
              style={{ width: inputWidth.current + 'px' }}
            />
          ) : (
            <span
              onClick={() => setShowInput(true)}
              className="ml-6 line-clamp-1 w-auto cursor-pointer bg-transparent font-display text-sm font-semibold"
            >
              {name}
            </span>
          )}
        </div>

        {/* Body */}
        {(showRecently || isHome) && (
          <div
            className={clsx(
              'inert mt-6 flex h-[calc(100%-3rem)] w-full flex-1 flex-col gap-y-4 overflow-y-scroll px-2',
            )}
          >
            <div
              className={clsx(
                'mb-4 flex w-full items-center justify-between gap-x-2',
              )}
            >
              <PrimaryButton
                onClick={handleCreateWorkflow}
                size="sm"
                className="flex items-center bg-transparent hover:bg-neutral-300/30 dark:hover:bg-neutral-700/30"
              >
                <PlusIcon className="h-4 w-4 text-gray-400 dark:text-white" />
                <span className=" text-sm">New</span>
              </PrimaryButton>
              <div className="flex items-center justify-center gap-x-2">
                <MiniSortButton
                  selected={sort}
                  setSelected={setSort}
                  options={options}
                />
                <div className="cursor-pointer rounded p-1 hover:bg-neutral-800">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 dark:text-neutral-300" />
                </div>
              </div>
            </div>

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
                    router.push(`/dashboard/workflow/${workflow.uuid}`);
                    setShowRecently(false);
                  }}
                  className={clsx(
                    'group relative mb-2 flex h-fit w-full flex-shrink-0 cursor-pointer select-none items-center justify-between rounded shadow-sm ring-1 ring-neutral-50 hover:ring-0 dark:ring-neutral-800/40',
                    workflow.uuid === uuid &&
                      ' bg-gradient-to-r  from-sky-100 to-teal-100 dark:from-sky-600  dark:to-indigo-600',
                  )}
                >
                  <div className="absolute -inset-px -z-10 rounded border-2 border-transparent opacity-0 [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.slate.800)]" />
                  <div className="flex h-full w-full flex-col items-start justify-between gap-y-2 px-3 py-4 text-sm">
                    <div className="flex w-full items-center justify-between">
                      <span className="line-clamp-1 font-semibold">
                        {workflow.name}
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
                          workflow.uuid === uuid && 'dark:text-neutral-100',
                        )}
                      >
                        Updated: {formatTime(workflow.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      {children}
    </>
  );
}
