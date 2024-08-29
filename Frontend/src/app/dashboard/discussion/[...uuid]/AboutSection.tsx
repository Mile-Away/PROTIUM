'use client';

import clsx from 'clsx';
import { useState } from 'react';

import { TinyWaveFormIcon } from '@/app/dashboard/discussion/[...uuid]/TinyWaveFormIcon';

export function AboutSection({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  props?: React.ComponentPropsWithoutRef<'section'>;
}) {
  let [isExpanded, setIsExpanded] = useState(false);

  return (
    <section {...props} className={className}>
      <h2 className="flex items-center font-mono text-sm font-medium leading-7 text-slate-900 dark:text-white">
        <TinyWaveFormIcon
          colors={['fill-sky-300', 'fill-indigo-300']}
          className="h-2.5 w-2.5"
        />
        <span className="ml-2.5">About</span>
      </h2>
      <p
        className={clsx(
          'mt-2 text-sm leading-7 text-slate-700 dark:text-neutral-300',
          !isExpanded && 'lg:line-clamp-2',
        )}
      >
        {children}
      </p>
      {
        !isExpanded ? (
          <button
            type="button"
            className="mt-2 hidden text-sm font-bold leading-6 text-blue-500 hover:text-blue-700 active:text-blue-900 lg:inline-block"
            onClick={() => setIsExpanded(true)}
          >
            Show more
          </button>
        ) : null
        // (
        //   <button
        //     type="button"
        //     className="mt-2 hidden text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900 lg:inline-block"
        //     onClick={() => setIsExpanded(false)}
        //   >
        //     Show less
        //   </button>
        // )
      }
    </section>
  );
}
