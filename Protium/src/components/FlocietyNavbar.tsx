'use client';
import Link from 'next/link';
/* eslint-disable @next/next/no-img-element */
import Logo, { FlocietyLogo } from '@/@brand/Logo';
import DropdownMenu from '@/components/DropdownMenu';
import LangSwitch from '@/components/LangSwitch';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { MEDIA_URL } from '@/config';
import { useAuthServiceContext } from '@/context/AuthContext';
import { Dialog, Menu, MenuButton, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const NavbarMenu = () => {
  const url = usePathname();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState<number | null>(null);

  return (
    <div className="ml-8">
      <div className="flex gap-x-4">
        <Link
          href={'/flociety/workflows'}
          className={clsx(
            'select-none rounded p-2',
            'text-xl font-semibold transition-all duration-300 ease-in-out',
            'dark:hover:bg-white/10 hover:bg-gray-50 text-gray-600',
            // 如果 url 最开始是 /flociety/nodes, 则 'text-indigo-600' : 'text-gray-900',
            url.startsWith('/flociety/workflows')
              ? 'bg-gradient-to-r from-purple-600 via-sky-500 to-teal-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-sky-500 dark:to-teal-400'
              : 'dark:text-white/50 dark:hover:text-white',
          )}
        >
          Workflows
        </Link>
        <Link
          href={'/flociety/nodes'}
          className={clsx(
            'select-none rounded p-2',
            'text-xl font-semibold transition-all duration-300 ease-in-out',
            'dark:hover:bg-white/10 hover:bg-gray-50 text-gray-600',
            // 如果 url 最开始是 /flociety/nodes, 则 'text-indigo-600' : 'text-gray-900',
            url.startsWith('/flociety/nodes')
              ? ' bg-gradient-to-r from-purple-600 via-pink-500 to-orange-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-500 dark:to-fuchsia-400'
              : 'dark:text-white/50 dark:hover:text-white',
          )}
        >
          Nodes
        </Link>
      </div>
    </div>
  );
};

const FlocietyNavbar = () => {
  const { isLogged, userInfo, checkIsLogged } = useAuthServiceContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Workflows', href: '/about' },
    { name: 'Nodes', href: '/manifesto' },
  ];

  useEffect(() => {
    checkIsLogged();
  }, []);

  return (
    <div className="relative flex w-full justify-center">
      <header className="absolute top-0 z-50 mx-auto w-full">
        <nav
          className=" flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex items-center">
            <Link
              href="/flociety"
              className="z-50 pointer-events-none -m-1.5 flex items-center rounded-md fill-indigo-800 p-1.5 transition-opacity duration-150 ease-in-out hover:bg-neutral-300/20 dark:fill-white dark:hover:bg-neutral-800"
            >
              <span className="sr-only">Protium - Flociety</span>
              <FlocietyLogo className="h-fit w-28" />
            </Link>

            <NavbarMenu />
          </div>

          <div className="w-fit">
            {/* 桌面端 */}
            <div className="hidden items-center gap-x-3 lg:flex">
              {/* <GlobalSearchButton /> */}
              <LangSwitch className="mr-2" />
              <ThemeSwitch className="mr-2" />
              {isLogged ? (
                <DropdownMenu itemClassName="-mt-4">
                  <MenuButton className="-m-1.5 flex items-center rounded px-3 py-2 duration-300 ease-in-out hover:bg-zinc-50 dark:hover:bg-neutral-800">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="bg-neutral-5 h-8 w-8 rounded-full"
                      src={`${MEDIA_URL}${userInfo?.avatar}`}
                      alt="avatar"
                    />
                    {/* <span className="hidden lg:flex lg:items-center">
                <span
                  className="ml-4 text-sm font-semibold leading-6 text-gray-600 dark:text-gray-300"
                  aria-hidden="true"
                >
                  {userInfo.username}
                </span>
              </span> */}
                  </MenuButton>
                </DropdownMenu>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-semibold leading-6 text-gray-900 opacity-75 hover:text-indigo-600 hover:opacity-100 dark:text-gray-100 dark:hover:text-white dark:hover:opacity-100"
                >
                  Log in <span aria-hidden="true">&rarr;</span>
                </Link>
              )}
            </div>

            {/* 移动端 */}
            <div className="flex lg:hidden">
              {/* 头像 */}
              {isLogged && (
                <DropdownMenu>
                  <Menu.Button className="-m-1.5 flex items-center rounded px-3 py-2 duration-300 ease-in-out hover:bg-zinc-50 dark:hover:bg-neutral-800">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="bg-neutral-5 h-7 w-7 rounded-full"
                      src={`${MEDIA_URL}${userInfo?.avatar}`}
                      alt="avatar"
                    />
                  </Menu.Button>
                </DropdownMenu>
              )}

              {/* 下拉菜单 */}
              <button
                type="button"
                className="-m-2.5 ml-2 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  className="h-7 w-7 dark:text-gray-50"
                  aria-hidden="true"
                />
              </button>
            </div>

            <Transition.Root show={mobileMenuOpen} as={Fragment}>
              <Dialog
                as="div"
                className="lg:hidden"
                onClose={setMobileMenuOpen}
              >
                <div className="fixed inset-0 z-50" />

                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-out duration-300 sm:duration-500"
                  enterFrom="translate-x-6 opacity-0"
                  enterTo="translate-x-0 opacity-100"
                  leave="transform transition ease-out duration-300 sm:duration-500"
                  leaveFrom="translate-x-0 opacity-100"
                  leaveTo="translate-x-6 opacity-0"
                >
                  <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 ring-gray-900/10 dark:bg-neutral-900 dark:ring-gray-50/10 sm:max-w-sm sm:ring-1">
                    <div className="flex items-center justify-between">
                      <Link href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Protium</span>
                        <Logo className="h-8 w-8 fill-indigo-800 dark:fill-white" />
                      </Link>
                      <div>
                        <LangSwitch className="mr-2" />
                        <ThemeSwitch className="mr-2" />
                        <button
                          type="button"
                          className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span className="sr-only">Close menu</span>
                          <XMarkIcon
                            className="h-6 w-6 dark:text-gray-50"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </div>
                    <div className="mt-6 flow-root">
                      <div className="-my-6 divide-y divide-gray-500/10 dark:divide-gray-500/70">
                        <div className="space-y-2 py-6">
                          {navigation.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-neutral-50 dark:text-gray-50 dark:hover:bg-neutral-800"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                        <div className="py-6">
                          <Link
                            href="/login"
                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-neutral-50 dark:text-gray-50 dark:hover:bg-neutral-800"
                          >
                            Log in
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </Dialog>
            </Transition.Root>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default FlocietyNavbar;
