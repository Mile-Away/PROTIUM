import { SelectDropdownOptionsProps } from '@/components/SelectDropdown';
import { Listbox, Transition } from '@headlessui/react';
import { BarsArrowUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { Fragment, useState } from 'react';

const MiniSortButton = ({
  selected,
  setSelected,
  options,
}: {
  selected: SelectDropdownOptionsProps;
  setSelected: React.Dispatch<React.SetStateAction<any>>;
  options: SelectDropdownOptionsProps[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only">
            Change published status
          </Listbox.Label>
          <div className="relative z-50">
            <div className="flex rounded-md transition-all">
              <Listbox.Button className="">
                <div
                  className="flex items-center rounded-md p-1 hover:bg-neutral-50 
                 dark:ring-gray-700 dark:hover:bg-neutral-800  sm:ring-gray-300"
                >
                  <BarsArrowUpIcon
                    className=" h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <ChevronDownIcon
                    className="h-4 w-4 text-gray-400 dark:text-white"
                    aria-hidden="true"
                    onClick={() => {
                      setOpen(!open);
                    }}
                  />
                </div>
              </Listbox.Button>
            </div>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in-out duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className="absolute right-0 mt-2 w-fit origin-top-right
               divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg
               ring-1 ring-black ring-opacity-5 justify-items-center focus:outline-none dark:divide-neutral-700
                dark:bg-neutral-800 "
              >
                {options.map((option) => (
                  <Listbox.Option
                    key={option.title}
                    className={({ active }) =>
                      clsx(
                        active
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-900 dark:text-white',
                        ' cursor-pointer select-none px-2 py-3 text-xs font-medium',
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <div className="flex flex-col">
                        <div className="flex justify-between">
                          <p
                            className={
                              selected ? 'font-semibold' : 'font-normal'
                            }
                          >
                            {option.title}
                          </p>
                        </div>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default MiniSortButton;
