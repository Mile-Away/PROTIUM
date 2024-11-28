import { RootReducerProps } from '@/app/store';
import { setShowingSetMaterialModal } from '@/store/environment/laboratorySlice';

import { isTreeItem } from '@/store/environment/utils';
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import {
  InformationCircleIcon,
  PaperClipIcon,
} from '@heroicons/react/20/solid';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MatHeader from '../MatHeader';
import MatTabs from '../MatTabs';
import InfoTab from '../tabs/InfoTab';
import LogsTab from '../tabs/LogsTab';
import CreateForm from './CreateForm';

export default function MaterialModal({}: {}) {
  const dispatch = useDispatch();
  const {
    activeItem,
    items,
    isShowingSetMaterialModal,
    isShowingSetMaterialModalFor,
  } = useSelector((status: RootReducerProps) => status.laboratory);

  const isBlankItem = !isTreeItem(isShowingSetMaterialModalFor);

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
                  {/* <CreateForm /> */}
                  {isBlankItem ? (
                    <CreateForm />
                  ) : (
                    <div className="relative h-full bg-white px-8 py-6 shadow-xl dark:divide-white/5 dark:bg-neutral-800 dark:shadow-black/80">
                      <div className="pointer-events-none absolute inset-[35%] block rounded-full bg-white/15 blur-2xl"></div>

                      <MatHeader
                        type={isShowingSetMaterialModalFor.type}
                        dirs={isShowingSetMaterialModalFor.dirs || []}
                        showReady={false}
                      />

                      <MatTabs
                        tabs={[
                          {
                            icon: InformationCircleIcon,
                            name: 'Info',
                            panel: <InfoTab />,
                          },
                          {
                            icon: PaperClipIcon,
                            name: 'Logs',
                            panel: <LogsTab />,
                          },
                        ]}
                      />
                    </div>
                  )}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
