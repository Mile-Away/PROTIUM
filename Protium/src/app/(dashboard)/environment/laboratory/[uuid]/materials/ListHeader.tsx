import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import {
  BeakerIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  SquaresPlusIcon,
} from '@heroicons/react/24/outline';

export default function ListHeader() {
  return (
    <div className=" flex gap-2 px-2 pb-2 pt-1">
      <div className=" group/search relative w-full">
        <input
          className="form-input h-7 w-full border-0 bg-black text-xs leading-6 placeholder:text-neutral-400 focus:outline-none"
          placeholder="Search"
        />
        <MagnifyingGlassIcon className="absolute right-2 top-1/2 h-4 w-4 -translate-x-0 -translate-y-1/2 transform group-hover/search:text-white dark:text-neutral-400" />
      </div>
      <Menu as="div" className="relative">
        <MenuButton className="rounded p-1 dark:hover:bg-white/10">
          <PlusIcon className="h-4 w-4 " />
        </MenuButton>
        <MenuItems
          transition
          anchor="bottom end"
          className="w-52  origin-top-right rounded-xl border border-white/10 bg-neutral-900 p-1 text-sm/6 text-white shadow transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10">
              <SquaresPlusIcon className="size-4 fill-white/30" />
              Blank Repository
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                ⌘N
              </kbd>
            </button>
          </MenuItem>

          <div className="my-1 h-px bg-white/5" />
          <div className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5">
            <p className=" text-xs dark:text-neutral-400">
              Create from template
            </p>
          </div>
          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10">
              <BeakerIcon className="size-4 fill-white/30" />
              <span className="line-clamp-1 text-start">
                Bioyond A1
              </span>
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                ⌘D
              </kbd>
            </button>
          </MenuItem>
          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10">
              <BeakerIcon className="size-4 fill-white/30" />
              <span className="line-clamp-1 text-start">
                Biaozhi A2
              </span>
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                ⌘A
              </kbd>
            </button>
          </MenuItem>
          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10">
              <BeakerIcon className="size-4 fill-white/30" />
              <span className="line-clamp-1 text-start">
                Jingtai A3
              </span>
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                ⌘D
              </kbd>
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
}
