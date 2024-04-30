import { SelectDropdownOptionsProps } from '@/components/SelectDropdown';
import { Listbox, Transition } from '@headlessui/react';
import {
  BarsArrowUpIcon,
  CheckIcon,
  ChevronDownIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { Fragment, useState } from 'react';

const SortButton = ({
  selected,
  setSelected,
  options,
}: {
  selected: SelectDropdownOptionsProps;
  setSelected: React.Dispatch<React.SetStateAction<SelectDropdownOptionsProps>>;
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
          <div className="relative">
            <div className="inline-flex divide-x divide-indigo-700 rounded-md shadow-sm transition-all">
              <Listbox.Button className="">
                <div
                  className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-md px-3 py-2    
                text-sm font-semibold  ring-1 ring-inset ring-gray-100 hover:bg-neutral-50 
                 dark:ring-gray-700 dark:hover:bg-neutral-800 
                       sm:ring-gray-300"
                >
                  <BarsArrowUpIcon
                    className="-ml-0.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <p className="hidden text-sm text-gray-900 dark:text-white sm:block">
                    {selected.title}
                  </p>

                  <span className="sr-only">Change published status</span>
                  <ChevronDownIcon
                    className="h-5 w-5 text-gray-400 dark:text-white"
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
              <Listbox.Options className="absolute right-0 z-10 mt-2 w-48 sm:w-72
               origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white
               shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
                dark:divide-neutral-700 dark:bg-neutral-800">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.title}
                    className={({ active }) =>
                      clsx(
                        active
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-900 dark:text-white',
                        'cursor-default select-none p-4 text-sm',
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
                          {selected ? (
                            <span
                              className={
                                active ? 'text-white' : 'text-indigo-600'
                              }
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </div>
                        <p
                          className={clsx(
                            active ? 'text-indigo-200' : 'text-gray-500',
                            'mt-2',
                          )}
                        >
                          {option.description}
                        </p>
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

export default SortButton;
