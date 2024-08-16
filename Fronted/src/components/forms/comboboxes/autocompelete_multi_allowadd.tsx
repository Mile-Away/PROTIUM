import { ArticleProps } from '@/@types/article';
import { MEDIA_URL } from '@/config';
import createAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { formatTime } from '@/lib/formatDate';
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field,
  Label,
} from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default function AutoCompleteCombobox({
  options,
  selected,
  placeholder,
}: {
  options: ArticleProps[];
  selected: ArticleProps[];
  placeholder: string;
}) {
  const [query, setQuery] = useState('');
  // const [selectedOption, setSelectedOption] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState(selected);

  const [restOptions, setRestOptions] = useState(options);

  const [addOptions, setAddOptions] = useState<ArticleProps[]>([]);

  useEffect(() => {
    setRestOptions(options);
    setSelectedOptions(selected);
  }, [options, selected]);

  const jwtAxios = createAxiosWithInterceptors();
  const filteredOptions =
    query === ''
      ? restOptions
      : restOptions.filter((option) => {
          return option.title.toLowerCase().includes(query.toLowerCase());
        });

  const handleSelectOptions = (options: ArticleProps[]) => {
    setSelectedOptions(options);

    const res = jwtAxios.put(`/server/server/DeePMD-kit/`, {
      pinned_manuscript: options.map((option) => option.id),
    });

    console.log(res);
  };

  return (
    <Field>
      <Label className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
        Assigned to
      </Label>
      <Combobox
        immediate
        multiple
        as="div"
        value={selectedOptions}
        onChange={(options) => handleSelectOptions(options)}
        onClose={() => setQuery('')}
        className="relative mt-2"
      >
        <ComboboxInput
          aria-label="Assignees"
          className="form-input w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset
             ring-gray-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-neutral-900
              dark:text-white dark:ring-neutral-700 dark:placeholder:text-neutral-500 dark:focus:ring-neutral-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(option: ArticleProps) => option?.title}
          placeholder={placeholder}
        />

        <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg shadow-black ring-1 ring-black ring-opacity-5 empty:hidden focus:outline-none dark:bg-neutral-900 sm:text-sm">
          {filteredOptions.map((option) => (
            <ComboboxOption
              key={option.id}
              value={option}
              className={clsx(
                'relative mt-1 cursor-pointer select-none py-2 pl-3 pr-9 data-[focus]:bg-indigo-600 data-[selected]:bg-indigo-600 dark:text-white',
              )}
            >
              {({ selected }) => (
                <>
                  <div className="mr-4 flex items-center justify-between">
                    <span
                      className={clsx(
                        'block truncate ',
                        selected && 'font-semibold ',
                      )}
                    >
                      {option.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 dark:text-gray-300">
                        {formatTime(option.updated_at)}
                      </span>
                      <button className="-m-2 flex items-center gap-x-2  rounded-lg px-2 py-2 text-xs font-semibold text-zinc-600  dark:text-zinc-300 ">
                        <img
                          className="h-5 w-5 rounded-full"
                          src={`${MEDIA_URL}${option.avatar}`}
                          alt={option.author}
                        />
                        {option.author}
                      </button>
                    </div>
                  </div>
                  {selected && (
                    <span
                      className={clsx(
                        'absolute inset-y-0 right-0 flex items-center pr-4',
                      )}
                    >
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                </>
              )}
            </ComboboxOption>
          ))}
        </ComboboxOptions>

        {/* 展示已经被选中过的选项 */}

        {selectedOptions.length > 0 && (
          <div className="mt-4 flex w-full flex-col gap-4">
            {selectedOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between rounded-r border-l border-white bg-white/2.5 p-2 px-3"
              >
                <div className=" text-sm">
                  <h1 className="mb-4 font-semibold">{option.title}</h1>
                  <div className="flex items-center">
                    <button className="-m-2 flex items-center gap-x-2  rounded-lg px-2 py-2 text-xs font-semibold text-zinc-600  dark:text-zinc-300 ">
                      <img
                        className="h-5 w-5 rounded-full"
                        src={`${MEDIA_URL}${option.avatar}`}
                        alt={option.author}
                      />
                      {option.author}
                    </button>
                    <span className=" ml-4 text-xs">
                      {formatTime(option.updated_at)}
                    </span>
                  </div>
                </div>
                <div className=" cursor-move hover:text-white">
                  <EllipsisVerticalIcon className="h-6 w-6" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Combobox>
    </Field>
  );
}
