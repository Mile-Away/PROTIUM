'use client';
import Link from 'next/link';
/* eslint-disable @next/next/no-img-element */
import Logo from '@/@brand/Logo';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import About from './About';
import Community from './Community';
import Projects from './Projects';
import { RightSideStatus } from './RightSideStatus';
import Tutorial from './Tutorials';

const NavbarMenu = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState<number | null>(null);
  return (
    <div className="hidden lg:flex lg:items-center lg:space-x-4 lg:pl-6">
      <About
        index={1}
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        open={open}
        setOpen={setOpen}
      />
      <Projects
        index={2}
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        open={open}
        setOpen={setOpen}
      />

      <Tutorial
        index={4}
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        open={open}
        setOpen={setOpen}
      />
      <Community
        index={3}
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        open={open}
        setOpen={setOpen}
      />
      <Link
        className={`inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 focus:outline-none dark:text-gray-100 ${'hover:text-indigo-600 dark:hover:text-indigo-500'}`}
        href="/certification"
      >
        <span>{t('navbar.certification')}</span>
      </Link>
    </div>
  );
};

const Navbar = () => {
  return (
    <div className="relative flex w-full justify-center">
      <header className="absolute top-0 z-50 mx-auto w-full max-w-9xl">
        <nav
          className=" flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex">
            <Link
              href="/"
              className="z-50 -m-1.5 rounded-md fill-indigo-800 p-1.5 transition-opacity duration-150 ease-in-out hover:bg-neutral-300/20 dark:fill-white dark:hover:bg-neutral-800"
            >
              <span className="sr-only">Protium</span>
              <Logo className="h-8 w-8" />
            </Link>
            <NavbarMenu />
          </div>

          <RightSideStatus dropdownMenuPosition="-mt-2" />
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
