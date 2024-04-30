'use client';
import { SpaceProps } from '@/@types/space';
import { MEDIA_URL } from '@/config';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

const CustomLiElement = (space: SpaceProps, pure?: boolean) => {
  return (
    <li
      key={space.uuid}
      className="group relative -mx-1 mt-2 rounded-xl border-slate-200 px-3 py-4 dark:border-slate-800"
    >
      <div
        className="absolute -inset-px rounded-xl border-[1px] border-transparent opacity-0 
      [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] 
      group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.slate.800)]"
      />

      <Link
        href={`/dashboard/space/${space.uuid}/`}
        className="flex items-center justify-between  "
      >
        <div className=" relative flex flex-col items-start">
          <div className="flex items-center space-x-3 text-sm font-medium text-gray-900 dark:text-gray-100">
            {space.icon && (
              <img
                src={MEDIA_URL + space.icon}
                alt="space"
                className="h-5 w-5"
              />
            )}
            <span className="font-semibold">{space.name}</span>
          </div>
          <p className="mt-2 line-clamp-2 text-gray-500 dark:text-gray-400">
            {space.description}
          </p>
        </div>
        <button
          type="button"
          className="text-gray-400 group-hover:animate-bounce-x group-hover:text-gray-500"
        >
          <span className="sr-only">View</span>
          <ChevronUpIcon className="h-5 w-5 rotate-90 " />
        </button>
      </Link>
    </li>
  );
};

export default CustomLiElement;
