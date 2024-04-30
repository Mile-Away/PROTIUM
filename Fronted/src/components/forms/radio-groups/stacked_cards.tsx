import { RadioGroup } from '@headlessui/react';
import clsx from 'clsx';
import { useState } from 'react';

export default function StackedCards({ items }: { items: any[] }) {
  const [selected, setSelected] = useState(items[0]);

  return (
    <div className="mt-8">
      <RadioGroup value={selected} onChange={setSelected}>
        <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
        <div className="space-y-4">
          {items.map((item) => (
            <RadioGroup.Option
              key={item.name}
              value={item}
              className={({ active }) =>
                clsx(
                  active
                    ? 'border-indigo-600 ring-1 ring-indigo-600 dark:border-teal-400 dark:ring-teal-400'
                    : 'border-gray-300',
                  'relative block cursor-pointer rounded-lg border bg-white px-6 py-2 shadow-sm focus:outline-none dark:bg-neutral-900 sm:flex sm:justify-between',
                )
              }
            >
              {({ active, checked }) => (
                <>
                  <span className="flex items-center">
                    <span className="flex flex-col text-xs">
                      <RadioGroup.Label
                        as="span"
                        className="font-medium text-gray-900 dark:text-white"
                      >
                        {item.name}
                      </RadioGroup.Label>
                      {/* <RadioGroup.Description as="span" className="text-gray-500">
                      <span className="block sm:inline">
                        {item.ram} / {item.cpus}
                      </span>{' '}
                      <span
                        className="hidden sm:mx-1 sm:inline"
                        aria-hidden="true"
                      >
                        &middot;
                      </span>{' '}
                      <span className="block sm:inline">{item.disk}</span>
                    </RadioGroup.Description> */}
                    </span>
                  </span>
                  {/* <RadioGroup.Description
                  as="span"
                  className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.price}
                  </span>
                  <span className="ml-1 text-gray-500 sm:ml-0">/mo</span>
                </RadioGroup.Description> */}
                  <span
                    className={clsx(
                      active ? 'border' : 'border-2',
                      checked
                        ? 'border-indigo-600 dark:border-teal-400'
                        : 'border-transparent',
                      'pointer-events-none absolute -inset-px rounded-lg',
                    )}
                    aria-hidden="true"
                  />
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
