import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useState } from 'react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function PublishButton(props: any) {
  const [pubished, setPublished] = useState(true);

  const handlePublish = () => {
    props.onChange(true);
    setPublished(true);
  };

  const handleSave = () => {
    props.onChange(false);
    setPublished(false);
  };

  const publishingOptions = [
    {
      title: 'Publish',
      description: 'This job posting can be viewed by anyone who has the link.',
      current: true,
      onClick: () => handlePublish(),
    },
    {
      title: 'Save',
      description: 'This job posting will not be publicly accessible.',
      current: false,
      onClick: () => handleSave(),
    },
  ];

  const [selected, setSelected] = useState(publishingOptions[0]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only">
            Change published status
          </Listbox.Label>
          <div className="relative">
            <div className="inline-flex divide-x divide-indigo-700 rounded-md shadow-sm">
              <button
                type="submit"
                name={selected.title}
                className="inline-flex items-center gap-x-1.5 rounded-l-md bg-indigo-600 px-3 py-2 text-white shadow-sm hover:bg-indigo-700"
              >
                {/* <CheckIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" /> */}
                <p className="text-sm font-semibold">{selected.title}</p>
              </button>
              <Listbox.Button className="inline-flex items-center rounded-l-none rounded-r-md bg-indigo-600 p-2 hover:bg-indigo-700 focus:outline-none">
                <span className="sr-only">Change published status</span>
                <ChevronDownIcon
                  className="h-5 w-5 text-white"
                  aria-hidden="true"
                />
              </Listbox.Button>
            </div>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black dark:ring-white/10 dark:divide-neutral-700 ring-opacity-5 focus:outline-none">
                {publishingOptions.map((option) => (
                  <Listbox.Option
                    key={option.title}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900 dark:text-white',
                        'cursor-default select-none p-4 text-sm',
                      )
                    }
                    value={option}
                    onClick={option.onClick}
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
                          className={classNames(
                            active ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400',
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
}
