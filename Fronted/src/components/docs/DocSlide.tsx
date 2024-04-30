import { useCRUD } from '@/hooks/useCrud';
import { formatTime } from '@/lib/formatDate';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { Fragment, useEffect } from 'react';
import { MdOutlineOpenInNew } from 'react-icons/md';
import PublishStatus from './PublishStatus';

import { DocProps } from '@/@types/maunscript';
import '@/styles/markdown.css';
import '@/styles/markdown.dark.css';
import '@/styles/markdown.quote.css';
import { useRouter } from 'next/navigation';
import Markdown from './Markdwon';

interface DocSlideProps {
  isOpen: boolean;
  onClose: () => void;
  instance_id: number;
}

const DocSlide: React.FC<DocSlideProps> = ({
  isOpen,
  onClose,
  instance_id,
}) => {
  const router = useRouter();
  const url = `/document/vs/document/?by_documentid=${instance_id}`;
  //
  const { dataCRUD, error, isLoading, fetchData } = useCRUD<DocProps>([], url);
  //

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [instance_id]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden ">
          <div className="absolute inset-0 overflow-hidden ">
            <div className="pointer-events-none fixed bottom-0 right-0 top-16 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-[calc(100vh-2.5rem)] sm:max-w-2xl xl:max-w-3xl 2xl:max-w-5xl">
                  <div className=" flex h-full flex-col overflow-y-scroll bg-white shadow-xl dark:bg-neutral-900">
                    <div className="sticky top-0 z-10 w-full bg-indigo-700 px-4 py-6 dark:bg-indigo-900 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-white">
                          {dataCRUD[0]?.title}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center gap-4">
                          <button
                            type="button"
                            className="relative rounded-md bg-inherit text-indigo-200 hover:text-white focus:outline-none "
                            onClick={() =>
                              router.push(
                                `/articles/detail/${dataCRUD[0]?.uuid}/${dataCRUD[0]?.title}`,
                              )
                            }
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">在新标签页打开</span>
                            <MdOutlineOpenInNew
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            type="button"
                            className="relative rounded-md bg-inherit text-indigo-200 hover:text-white focus:outline-none "
                            onClick={() => onClose()}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-1 flex">
                        <div className="mr-4">
                          <p className="text-sm text-indigo-300">
                            {formatTime(dataCRUD[0]?.updated_at, 'long')}
                          </p>
                        </div>

                        <PublishStatus
                          isPublish={dataCRUD[0]?.publish}
                          setWhite={true}
                        />
                      </div>
                    </div>
                    <div className="relative  max-w-full flex-1 px-4 py-6 dark:bg-neutral-800 sm:px-6">
                      <div className="markdown">
                        <Markdown content={dataCRUD[0]?.content} />
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default DocSlide;
