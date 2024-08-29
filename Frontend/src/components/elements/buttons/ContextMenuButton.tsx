import { ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';

function ButtonInner({
  arrow = false,
  active = false,
  children,
}: {
  arrow?: boolean;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        'flex w-full min-w-fit items-center flex-nowrap text-nowrap justify-between rounded px-2 py-1',
        ' hover:bg-neutral-100 dark:hover:bg-neutral-600',
        active ? 'bg-neutral-100 dark:bg-neutral-600' : '',
      )}
    >
      {children} {arrow ? <ChevronRightIcon className="h-3 w-3" /> : null}
    </div>
  );
}

export function ContextMenuButton({
  arrow = false,
  disabled = false,
  active = false,
  children,
  ...props
}: { arrow?: boolean; active?: boolean; disabled?: boolean } & (
  | React.ComponentPropsWithoutRef<typeof Link>
  | ({ href?: undefined } & React.ComponentPropsWithoutRef<'button'>)
)) {
  //   className = clsx(
  //     'group relative isolate flex-none rounded-md py-1.5 text-[0.8125rem]/6 font-semibold dark:text-white',
  //     arrow ? 'pl-2.5 pr-[calc(9/16*1rem)]' : 'px-2.5',
  //     disabled ? 'opacity-50 cursor-not-allowed' : '',
  //     className,
  //   );

  return typeof props.href === 'undefined' ? (
    <button {...props} disabled={disabled}>
      <ButtonInner arrow={arrow} active={active}>{children}</ButtonInner>
    </button>
  ) : (
    <Link {...props}>
      <ButtonInner arrow={arrow}>{children}</ButtonInner>
    </Link>
  );
}
