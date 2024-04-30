import { ArticleProps } from '@/@types/article';
import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useState } from 'react';

export default function Example({
  options,
  placeholder,
}: {
  options: ArticleProps[];
  placeholder: string;
}) {
  const [query, setQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState<ArticleProps | null>(
    null,
  );

  const [selectedOptions, setSelectedOptions] = useState<ArticleProps[]>([]);

  const [restOptions, setRestOptions] = useState<ArticleProps[]>(options);

  const [addOptions, setAddOptions] = useState<ArticleProps[]>([]);

  const filteredOptions =
    query === ''
      ? restOptions
      : restOptions.filter((option) => {
          return option.title.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div>
      <Combobox as="div" value={selectedOption} onChange={setSelectedOption}>
        <Combobox.Label className="block text-sm font-medium dark:text-white leading-6 text-gray-900">
          Assigned to
        </Combobox.Label>
        <div className="relative mt-2">
          <Combobox.Input
            className="form-input w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset
             ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 placeholder:text-neutral-400 dark:placeholder:text-neutral-500
              dark:ring-neutral-700 dark:focus:ring-neutral-600 dark:bg-neutral-900 dark:text-white sm:text-sm sm:leading-6"
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(option: ArticleProps) => option?.title}
            placeholder={placeholder}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>

          {filteredOptions.length > 0 && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-900 sm:text-sm">
              {filteredOptions.map((option) => (
                <Combobox.Option
                  key={option.id}
                  value={option}
                  className={({ active }) =>
                    clsx(
                      'relative cursor-default select-none py-2 pl-3 pr-9',
                      active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                    )
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <span
                        className={clsx(
                          'block truncate',
                          selected && 'font-semibold',
                        )}
                      >
                        {option.title}
                      </span>

                      {selected && (
                        <span
                          className={clsx(
                            'absolute inset-y-0 right-0 flex items-center pr-4',
                            active ? 'text-white' : 'text-indigo-600',
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>

      {/* 展示已经被选中过的选项 */}
      <div></div>
    </div>
  );
}
