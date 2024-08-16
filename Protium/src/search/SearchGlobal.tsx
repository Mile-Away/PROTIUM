import createAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { useDictCRUD } from '@/hooks/useCrud';
import usePost from '@/hooks/usePost';
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import {
  CubeTransparentIcon,
  DocumentMagnifyingGlassIcon,
  FolderIcon,
  TagIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';

function highlightKeyword(text: string, keyword: string) {
  if (keyword === '' || !text) return text;
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text
    .split(regex)
    .map((part, index) =>
      regex.test(part) ? <mark key={index}>{part}</mark> : part,
    );
}

// 搜索内容
const quickActions = [
  {
    name: 'in Articles...',
    icon: DocumentMagnifyingGlassIcon,
    shortcut: 'N',
    url: '#',
  },
  { name: 'in Spaces...', icon: CubeTransparentIcon, shortcut: 'F', url: '#' },
  { name: 'in Discussions...', icon: UsersIcon, shortcut: 'H', url: '#' },
  { name: 'in Tutorials...', icon: TagIcon, shortcut: 'L', url: '#' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface SearchDocumentProps {
  uuid: string;
  title: string;
  content: string; // 搜索内容的描述
}

interface SearchChannelProps {
  uuid: string;
  name: string;
  description: string; // 搜索内容的描述
  server: string;
}

interface SearchProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  showShortcut?: boolean;
  showRecent?: boolean;
}

interface dataCRUDProps {
  documents: SearchDocumentProps[];
  channels: SearchChannelProps[];
}

// 类型守卫
function responseDataType(item: SearchChannelProps | SearchDocumentProps): {
  type: 'document' | 'channel';
  data: SearchChannelProps | SearchDocumentProps;
} {
  if ('title' in item) {
    return { type: 'document', data: item as SearchDocumentProps };
  } else {
    return { type: 'channel', data: item as SearchChannelProps };
  }
}

export default function SearchGlobal({
  open,
  setOpen,
  showRecent = true,
  showShortcut = false,
}: SearchProps) {
  const jwtAxios = createAxiosWithInterceptors();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const { fetchData, dataCRUD, isLoading, error } = useDictCRUD<dataCRUDProps>(
    {} as dataCRUDProps,
    `/search/global/${query}`,
  );

  const { postData } = usePost('/search/vs/global-search-history/');

  const [recentSearch, setRecentSearch] = useState<
    (SearchChannelProps | SearchDocumentProps)[]
  >([] as (SearchChannelProps | SearchDocumentProps)[]);

  const [documentResults, setDocumentResults] = useState<SearchDocumentProps[]>(
    [] as SearchDocumentProps[],
  );
  const [channelResults, setChannelResults] = useState<SearchChannelProps[]>(
    [] as SearchChannelProps[],
  );

  const fetchRecentSearch = async () => {
    try {
      const response = await jwtAxios.get(`/search/vs/global-search-history/`);
      setRecentSearch(response.data);
    } catch (error) {
      console.error('Error fetching recent search:', error);
    }
  };

  useEffect(() => {
    fetchRecentSearch();
  }, []);

  useEffect(() => {
    if (query !== '') {
      fetchData();
    }
  }, [query]);

  useEffect(() => {
    setDocumentResults(dataCRUD?.documents || []);
    setChannelResults(dataCRUD?.channels || []);
  }, [dataCRUD]);

  return (
    <Transition
      show={open}
      as={Fragment}
      afterLeave={() => {
        fetchRecentSearch();
        setQuery('');
        setDocumentResults([]);
        setChannelResults([]);
      }}
      appear
    >
      <Dialog as="div" className="relative z-[9999]" onClose={setOpen}>
        {/* 背景遮罩 */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-500 bg-opacity-25 backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-[9999] w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {/* 搜索面板 */}
            <DialogPanel className="mx-auto max-w-2xl transform divide-y divide-neutral-500 divide-opacity-20 overflow-hidden rounded-xl bg-neutral-900 shadow-2xl transition-all">
              <Combobox
                onChange={(item: SearchDocumentProps | SearchChannelProps) => {
                  if (item?.uuid) {
                    if ('name' in item) {
                      postData({
                        query: query,
                        type: 'channel',
                        channel: { uuid: item.uuid },
                      });
                      router.push(
                        `/dashboard/discussion/${item.server}/${item.uuid}`,
                      );
                    } else {
                      postData({
                        query: query,
                        type: 'document',
                        document: { uuid: item.uuid },
                      });
                      router.push(`/articles/detail/${item.uuid}`);
                    }
                    fetchRecentSearch();
                    setQuery('');
                    setChannelResults([]);
                    setDocumentResults([]);
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
                  <ComboboxInput
                    className=" form-input h-12 w-full border-0 bg-transparent pl-11 pr-4 text-white focus:ring-0 sm:text-sm"
                    placeholder="Search ..."
                    // autoComplete="on"
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>

                {/* Document 选项，搜索内容为空时，展示最近搜索，否则展示搜索结果 */}
                {((query === '' && showRecent) ||
                  documentResults?.length > 0 ||
                  channelResults?.length > 0) && (
                  <ComboboxOptions
                    static
                    className="max-h-80 divide-y divide-neutral-500 divide-opacity-20 overflow-y-auto"
                  >
                    {/* 搜索内容 */}
                    <div className="p-2">
                      {showRecent && query === '' && (
                        <h2 className="mb-2 mt-4 px-3 text-xs font-semibold text-neutral-200">
                          Recent searches
                        </h2>
                      )}
                      <ul className="text-sm text-neutral-400">
                        {(query === ''
                          ? showRecent
                            ? recentSearch
                            : []
                          : documentResults?.length > 0 ||
                            channelResults?.length > 0
                          ? [channelResults, documentResults].flat()
                          : []
                        )
                          .filter((item) => item !== null)
                          .map((project) => (
                            <ComboboxOption
                              key={project?.uuid}
                              value={project}
                              className={clsx(
                                'flex cursor-default select-none items-center rounded-md px-3 py-2',
                                'hover:bg-neutral-800 hover:text-white',
                                'group',
                              )}
                            >
                              {project && (
                                <>
                                  {'name' in project ? (
                                    <UsersIcon
                                      className={classNames(
                                        'h-6 w-6 flex-none text-neutral-500 hover:text-white',
                                      )}
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <DocumentMagnifyingGlassIcon
                                      className={classNames(
                                        'h-6 w-6 flex-none text-neutral-500 hover:text-white',
                                      )}
                                      aria-hidden="true"
                                    />
                                  )}

                                  <span className="ml-3 flex-auto truncate">
                                    {'title' in project &&
                                      highlightKeyword(project.title, query)}
                                    {'name' in project &&
                                      highlightKeyword(project.name, query)}
                                  </span>

                                  <span className="ml-3 flex-none text-xs font-semibold text-neutral-400">
                                    {'content' in project &&
                                      highlightKeyword(project.content, query)}
                                    {'description' in project &&
                                      highlightKeyword(
                                        project.description,
                                        query,
                                      )}
                                  </span>
                                </>
                              )}

                              <span className="ml-3 hidden text-neutral-400 group-hover:flex-none">
                                Jump to...
                              </span>
                            </ComboboxOption>
                          ))}
                      </ul>
                    </div>

                    {/* 快捷选项 */}
                    {query === '' && showShortcut && (
                      <div className="p-2">
                        <h2 className="sr-only">Quick actions</h2>
                        <ul className="text-sm text-neutral-400">
                          {quickActions.map((action) => (
                            <ComboboxOption
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
                            </ComboboxOption>
                          ))}
                        </ul>
                      </div>
                    )}
                  </ComboboxOptions>
                )}

                {/* 没有搜索结果，则显示找不到结果 */}
                {query !== '' &&
                  documentResults?.length === 0 &&
                  channelResults?.length === 0 && (
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
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
