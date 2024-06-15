'use client';
import { RootReducerProps } from '@/app/store';
import useAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { setWorkflowName } from '@/store/workflow/workflowSlice';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const WorkflowTitleLabel = (
    {handleSaveWorkflow}: {handleSaveWorkflow: () => void},
) => {
  const jwtAxios = useAxiosWithInterceptors();
  const url = usePathname();
  const router = useRouter();

  const dispatch = useDispatch();
  const isHome = url === '/workflow';

  const { name, uuid } = useSelector(
    (state: RootReducerProps) => state.workflow.workflow,
  );

  // const [workflows, setWorkflows] = useState<WorkflowProps[]>([]);

  useEffect(() => {
    if (inputRef.current) {
      updateInputWidth(inputRef.current);
    }
  }, [name]);

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
    dispatch(setWorkflowName(e.target.value));

  };

  return (
    <div
      className={clsx(
        'absolute left-4 top-4 z-[30] rounded bg-transparent px-2 py-1 shadow backdrop-blur-2xl ',
        'overflow-hidden transition-all duration-500 ease-in-out',
        ' bg-neutral-100/30 dark:bg-black/10 ',
        showInput ? '' : 'max-w-96 ',
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
            //   onClick={() => setShowRecently(!showRecently)}
            className=" absolute left-0 top-2 -m-2 cursor-pointer rounded p-2 hover:bg-neutral-300/30 dark:hover:bg-neutral-700/30"
          >
            <ChevronRightIcon
              className={clsx(
                'h-4 w-4 transition-transform duration-300 ease-in-out',
              )}
            />
          </div>
        )}
        {showInput ? (
          <input
            ref={inputRef}
            value={name}
            onChange={handleChangeName}
            onBlur={() => {
              if (!name) {
                dispatch(setWorkflowName('Untitled'));
              }
              handleSaveWorkflow();
              setShowInput(false);
            }}
            className="ml-6 min-w-24 bg-transparent font-display text-sm font-semibold focus:outline-none"
            style={{ width: inputWidth.current + 'px' }}
          />
        ) : (
          <span
            onClick={() => {
              setShowInput(true);
              if (inputRef.current) {
                updateInputWidth(inputRef.current);
              }
            }}
            className="ml-6 line-clamp-1 w-auto cursor-pointer bg-transparent font-display text-sm font-semibold"
          >
            {name || 'Untitled'}
          </span>
        )}
      </div>
    </div>
  );
};

export default WorkflowTitleLabel;