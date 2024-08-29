import { useDictCRUD } from '@/hooks/useCrud';
import { Combobox, Dialog, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import {
  DocumentPlusIcon,
  FolderIcon,
  FolderPlusIcon,
  HashtagIcon,
  TagIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
interface SearchContentProps {
  uuid: string;
  name: string;
  description: string; // 搜索内容的描述
  server: string;
}

// 搜索内容

const quickActions = [
  { name: 'Add new file...', icon: DocumentPlusIcon, shortcut: 'N', url: '#' },
  { name: 'Add new folder...', icon: FolderPlusIcon, shortcut: 'F', url: '#' },
  { name: 'Add hashtag...', icon: HashtagIcon, shortcut: 'H', url: '#' },
  { name: 'Add label...', icon: TagIcon, shortcut: 'L', url: '#' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface SearchProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  showShortcut?: boolean;
  showRecent?: boolean;
}

interface dataCRUDProps {
  count: number;
  next: string;
  previous: string;
  results: SearchContentProps[];
}

export default function Search({
  open,
  setOpen,
  showRecent = true,
  showShortcut = false,
}: SearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const { fetchData, dataCRUD, isLoading, error } = useDictCRUD<dataCRUDProps>(
    {} as dataCRUDProps,
    `/search/channel/${query}`,
  );

  const [projects, setProjects] = useState<SearchContentProps[]>([]);

  useEffect(() => {
    if (query !== '') {
      fetchData();
    }
  }, [query]);

  useEffect(() => {
    setProjects(dataCRUD.results);
  }, [dataCRUD]);

  const recent: SearchContentProps[] = [];

  return (
    <Transition.Root
      show={open}
      as={Fragment}
      afterLeave={() => {
        setQuery('');
        setProjects([]);
      }}
      appear
    >
      <Dialog as="div" className="relative z-[9999]" onClose={setOpen}>
        {/* 背景遮罩 */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-500 bg-opacity-25 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-[9999] w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {/* 搜索面板 */}
            <Dialog.Panel className="mx-auto max-w-2xl transform divide-y divide-neutral-500 divide-opacity-20 overflow-hidden rounded-xl bg-neutral-900 shadow-2xl transition-all">
              <Combobox
                onChange={(item: SearchContentProps) => {
                  if (item.uuid) {
                    router.push(
                      `/dashboard/discussion/${item.server}/${item.uuid}`,
                    );
                    setOpen(false);
                  }
                }}
              >
                {/* 搜索框 */}
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-neutral-500"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className=" form-input h-12 w-full border-0 bg-transparent pl-11 pr-4 text-white focus:ring-0 sm:text-sm"
                    placeholder="Search all discussions..."
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>

                {/* 选项，搜索内容为空时，展示最近搜索，否则展示搜索结果 */}
                {((query === '' && showRecent) || projects?.length > 0) && (
                  <Combobox.Options
                    static
                    className="max-h-80 scroll-py-2 divide-y divide-neutral-500 divide-opacity-20 overflow-y-auto"
                  >
                    {/* 搜索内容 */}
                    <li className="p-2">
                      {showRecent && query === '' && (
                        <h2 className="mb-2 mt-4 px-3 text-xs font-semibold text-neutral-200">
                          Recent searches
                        </h2>
                      )}
                      <ul className="text-sm text-neutral-400">
                        {(query === ''
                          ? showRecent
                            ? recent
                            : []
                          : projects?.length > 0
                          ? projects
                          : []
                        ).map((project) => (
                          <Combobox.Option
                            key={project.uuid}
                            value={project}
                            className={({ active }) =>
                              clsx(
                                'flex cursor-default select-none items-center rounded-md px-3 py-2',
                                active && 'bg-neutral-800 text-white',
                              )
                            }
                          >
                            {({ active }) => (
                              <>
                                <UsersIcon
                                  className={classNames(
                                    'h-6 w-6 flex-none',
                                    active ? 'text-white' : 'text-neutral-500',
                                  )}
                                  aria-hidden="true"
                                />
                                <span className="ml-3 flex-auto truncate">
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: project.name,
                                    }}
                                  />
                                </span>
                                <span className="ml-3 flex-none text-xs font-semibold text-neutral-400">
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: project.description,
                                    }}
                                  />
                                </span>
                                {active && (
                                  <span className="ml-3 flex-none text-neutral-400">
                                    Jump to...
                                  </span>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </ul>
                    </li>

                    {/* 快捷选项 */}
                    {query === '' && showShortcut && (
                      <li className="p-2">
                        <h2 className="sr-only">Quick actions</h2>
                        <ul className="text-sm text-neutral-400">
                          {quickActions.map((action) => (
                            <Combobox.Option
                              key={action.shortcut}
                              value={action}
                              className={({ active }) =>
                                clsx(
                                  'flex cursor-default select-none items-center rounded-md px-3 py-2',
                                  active && 'bg-neutral-800 text-white',
                                )
                              }
                            >
                              {({ active }) => (
                                <>
                                  <action.icon
                                    className={classNames(
                                      'h-6 w-6 flex-none',
                                      active
                                        ? 'text-white'
                                        : 'text-neutral-500',
                                    )}
                                    aria-hidden="true"
                                  />
                                  <span className="ml-3 flex-auto truncate">
                                    {action.name}
                                  </span>
                                  <span className="ml-3 flex-none text-xs font-semibold text-neutral-400">
                                    <kbd className="font-sans">⌘</kbd>
                                    <kbd className="font-sans">
                                      {action.shortcut}
                                    </kbd>
                                  </span>
                                </>
                              )}
                            </Combobox.Option>
                          ))}
                        </ul>
                      </li>
                    )}
                  </Combobox.Options>
                )}

                {/* 没有搜索结果，则显示找不到结果 */}
                {query !== '' && projects?.length === 0 && (
                  <div className="px-6 py-14 text-center sm:px-14">
                    <FolderIcon
                      className="mx-auto h-6 w-6 text-neutral-500"
                      aria-hidden="true"
                    />
                    <p className="mt-4 text-sm text-neutral-200">
                      We couldn't find any projects with that term. Please try
                      again.
                    </p>
                  </div>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
