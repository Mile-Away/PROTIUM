import SuccessAlert from '@/components/notification/SuccessAlert';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment, useRef, useState } from 'react';

export default function WithStickyFooter({
  title,
  initialContent,
  onContentSave,
  open,
  setOpen,
}: {
  title: string;
  initialContent?: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  onContentSave: (content: string) => void;
}) {
  const [content, setContent] = useState(initialContent || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedTime, setSavedTime] = useState<Date | null>(null); // 保存时间，用于显示保存状态
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const MIN_CHANGE_TIME = 500; // 最小变更时间为 500ms

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    // 以下代码设置了 500ms 的延迟，在用户停止输入 500ms 后触发 onContentSave
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 设置新的定时器
    timeoutRef.current = setTimeout(() => {
      setIsSaving(true);
      onContentSave(e.target.value);
      setSavedTime(new Date());
      setIsSaving(false);
    }, MIN_CHANGE_TIME);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300 sm:duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300 sm:duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col divide-y divide-neutral-200 bg-white shadow-xl dark:divide-neutral-600 dark:bg-neutral-800 dark:shadow-black/80">
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-neutral-900 dark:text-white">
                            {title}
                          </Dialog.Title>
                          <div className="ml-3flex h-7 items-center">
                            <button
                              type="button"
                              className="relative rounded-md  text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300"
                              onClick={() => setOpen(false)}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <form className=" flex h-full flex-col ">
                          <textarea
                            value={content}
                            onChange={handleChange}
                            className="inert form-textarea h-full w-full overflow-scroll rounded bg-transparent text-sm focus:outline-none focus:ring-0 dark:border-neutral-400 dark:border-opacity-30 dark:focus:border-opacity-100"
                          />
                          {savedTime && (
                            <SuccessAlert
                              className="mt-4 flex items-center justify-end"
                              isLoading={isSaving}
                            >
                              <p className="text-xs font-medium text-green-800 dark:text-green-500">
                                Successfully autosaved at{' '}
                                {savedTime.toLocaleTimeString()}
                              </p>
                            </SuccessAlert>
                          )}
                        </form>
                      </div>
                    </div>

                    {/* <button
                        type="button"
                        className="rounded-md  bg-inherit px-3 py-2 text-sm font-semibold text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 hover:ring-neutral-400 dark:text-white dark:ring-neutral-700 dark:hover:ring-neutral-500"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        onClick={() => {}}
                        className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      >
                        Save
                      </button> */}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
