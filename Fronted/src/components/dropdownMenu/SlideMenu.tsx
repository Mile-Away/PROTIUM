import Logo from '@/@brand/Logo';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Fragment } from 'react';
interface SlideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SlideMenu: React.FC<SlideMenuProps> = ({ isOpen, onClose, children }) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10 lg:hidden" onClose={onClose}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 top-16 flex max-w-full pr-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300 sm:duration-500"
                enterFrom="-translate-x-full opacity-100"
                enterTo="-translate-x-0 opacity-100"
                leave="transform transition ease-in-out duration-300 sm:duration-500"
                leaveFrom="-translate-x-0 opacity-100"
                leaveTo="-translate-x-full opacity-100"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="inert flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl backdrop-blur-2xl dark:bg-neutral-900/30">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          <Link href="/">
                            <Logo className="h-6 w-auto fill-indigo-800 dark:fill-white " />
                          </Link>
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md  text-gray-400 hover:text-gray-500 focus:outline-none  dark:hover:text-gray-300"
                            onClick={() => onClose()}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {children}
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

export default SlideMenu;
