import { RootReducerProps } from '@/app/store';
import {
  addChildren,
  setShowingSetMaterialModal,
} from '@/store/environment/laboratorySlice';
import { UniqueIdentifier } from '@dnd-kit/core';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddNew from './AddNew';
import { TreeItemProps } from './TreeSortable/types';

export default function MaterialModal({}: {}) {
  const { items, isShowingSetMaterialModal, isShowingSetMaterialModalFor } =
    useSelector((status: RootReducerProps) => status.laboratory);

  const dispatch = useDispatch();

  const handleCreate = (e: any) => {
    e.preventDefault();
    const data: Omit<TreeItemProps & { parentId: UniqueIdentifier }, 'children'> = {
      id: 'New Material',
      type: 'Container',
      parentId: 'Repository 1',
      position: { x: 0, y: 0 },
      status: 'idle',
    };
    dispatch(addChildren(data));
    dispatch(setShowingSetMaterialModal(false));
  };

  return (
    <Transition show={isShowingSetMaterialModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[9999]"
        onClose={() => dispatch(setShowingSetMaterialModal(false))}
      >
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
                <DialogPanel className="pointer-events-auto w-screen max-w-xl">
                  <div className="flex h-full flex-col divide-y divide-neutral-200 bg-white shadow-xl dark:divide-white/5 dark:bg-neutral-800 dark:shadow-black/80">
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <DialogTitle className="text-base font-semibold leading-6 text-neutral-900 dark:text-white">
                            Add New Material
                          </DialogTitle>
                          <div className="ml-3flex h-7 items-center">
                            <button
                              type="button"
                              className="relative rounded-md  text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300"
                              onClick={() =>
                                dispatch(setShowingSetMaterialModal(false))
                              }
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

                      <AddNew />
                    </div>
                    <div className="flex justify-end px-4 py-6">
                      <button
                        type="button"
                        className="rounded-md bg-inherit px-3 py-2 text-sm font-semibold text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 hover:ring-neutral-400 dark:text-white dark:ring-neutral-700 dark:hover:ring-neutral-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleCreate(e)}
                        className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      >
                        Create
                      </button>
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
}
