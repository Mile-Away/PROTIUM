import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useState } from 'react';

interface WorkflowFormSelectItemProps {
  name: string;
}

const WorkflowFormSelect = ({
  items,
  onSelectedIndexChange,
}: {
  items: WorkflowFormSelectItemProps[];
  onSelectedIndexChange: (index: number) => void;
}) => {
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
    <div className="flex w-full items-center justify-between rounded bg-indigo-50 px-2 py-2 dark:bg-black">
      <div
        className={clsx(
          '-m-2 cursor-pointer rounded p-1.5 opacity-50 hover:opacity-100 dark:text-white ',
          'transition-all duration-300 ease-in-out',
          'hover:scale-125',
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
          '-m-2 cursor-pointer rounded p-1.5 opacity-50 hover:opacity-100 dark:text-white ',
          'transition-all duration-300 ease-in-out',
          'hover:scale-125',
        )}
        onClick={handleNext}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </div>
    </div>
  );
};

export default WorkflowFormSelect;
