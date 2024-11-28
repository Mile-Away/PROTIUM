import MonacoEditor, { DiffEditorProps } from '@monaco-editor/react';

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TabGroup,
  TabPanels,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import React, { Fragment, useEffect, useState } from 'react';

import { ResultsPanelProps } from '@/@types/interactive';

const monacoEditorOptions = {
  minimap: {
    enabled: false,
  },
  automaticLayout: true,
  readOnly: true,
};

const CompileResultsPanel: React.FC<ResultsPanelProps> = (props) => {
  console.log('CompileResultsPanel', props);
  const { id, open, setOpen, data, idx } = props;
  const title = data.body[idx]?.title || data?.header;

  const [code, setCode] = useState<string>('');

  useEffect(() => {
    setCode(data.compile[idx]?.source || '');
  }, [data.compile[idx]?.source]);

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-300 sm:duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300 sm:duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel className="pointer-events-auto w-screen max-w-4xl">
                  <div className="flex h-full flex-col divide-y divide-neutral-200 bg-white shadow-xl dark:divide-neutral-600 dark:bg-neutral-800 dark:shadow-black/80">
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <DialogTitle className="text-base font-semibold leading-6 text-neutral-900 dark:text-white">
                            {title}
                          </DialogTitle>
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
                        <div className=" flex h-full flex-col ">
                          <TabGroup as="div" className="h-full">
                            <TabPanels className="mt-3 h-full flex-1">
                              <MonacoEditor
                                language="bash"
                                value={code}
                                theme="vs-dark"
                                height={'84vh'}
                                options={monacoEditorOptions}

                              />
                            </TabPanels>
                          </TabGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CompileResultsPanel;
