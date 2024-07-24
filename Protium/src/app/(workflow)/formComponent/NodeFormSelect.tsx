import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useState } from 'react';

interface WorkflowFormSelectItemProps {
  name: string;
}

const NodeFormSelect = ({
  items,
  onSelectedIndexChange,
}: {
  items: WorkflowFormSelectItemProps[];
  onSelectedIndexChange: (index: number) => void;
}) => {
  /* 
  这个组件用于创建所有 Node 中使用的常规选择器
  */

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handlePrevious = () => {
    const newIndex = selectedIndex === 0 ? items.length - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    onSelectedIndexChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = selectedIndex === items.length - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(newIndex);
    onSelectedIndexChange(newIndex);
  };
  return (
    <div className="group flex h-8 w-full items-center justify-between rounded bg-indigo-50 px-2 py-2 hover:shadow hover:shadow-neutral-900/80 dark:bg-black/40">
      <div
        className={clsx(
          '-m-2 cursor-pointer rounded p-1.5 opacity-50 group-hover:opacity-80 dark:text-white ',
          'transition-all duration-300 ease-in-out',
          'hover:scale-125 hover:opacity-100',
        )}
        onClick={handlePrevious}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </div>
      <div className="flex h-auto flex-1 items-center justify-center text-center text-xs font-semibold capitalize">
        <span className="">{items[selectedIndex].name}</span>
      </div>
      <div
        className={clsx(
          '-m-2 cursor-pointer rounded p-1.5 opacity-50 group-hover:opacity-80 dark:text-white ',
          'transition-all duration-300 ease-in-out',
          'hover:scale-125 hover:opacity-100',
        )}
        onClick={handleNext}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </div>
    </div>
  );
};

export default NodeFormSelect;
