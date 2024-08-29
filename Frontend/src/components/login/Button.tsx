import clsx from 'clsx';
import Link from 'next/link';

function ButtonInner({
  arrow = false,
  children,
}: {
  arrow?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <span className="absolute inset-0 rounded-md bg-gradient-to-b from-black/80 to-black opacity-10 transition-opacity group-hover:opacity-15 dark:from-white/80 dark:to-white" />
      <span className="absolute inset-0 rounded-md opacity-7.5 shadow-[inset_0_1px_1px_white] transition-opacity group-hover:opacity-10" />
      {children} {arrow ? <span aria-hidden="true">&rarr;</span> : null}
    </>
  );
}

import { useEffect, useState } from 'react';

export function Button({
  className,
  arrow,
  children,
  disabled,
  remain,
  ...props
}: { arrow?: boolean; disabled?: boolean; remain?: number } & (
  | React.ComponentPropsWithoutRef<typeof Link>
  | ({ href?: undefined } & React.ComponentPropsWithoutRef<'button'>)
)) {
  //
  const [countdown, setCountdown] = useState(0);
  //

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (remain) {
      setCountdown(remain);
    } else {
      setCountdown(0);
    }

    if (disabled) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
      setCountdown(0); // Reset countdown when unmounting
    };
  }, [disabled, remain]);

  className = clsx(
    className,
    'group relative isolate flex-none rounded-md py-1.5 text-[0.8125rem]/6 font-semibold dark:text-white',
    arrow ? 'pl-2.5 pr-[calc(9/16*1rem)]' : 'px-2.5',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
  );

  return typeof props.href === 'undefined' ? (
    <button className={className} {...props} disabled={disabled}>
      {disabled ? (
        `${countdown} seconds`
      ) : (
        <ButtonInner arrow={arrow}>{children}</ButtonInner>
      )}
    </button>
  ) : (
    <Link className={className} {...props}>
      {disabled ? (
        `${countdown} seconds`
      ) : (
        <ButtonInner arrow={arrow}>{children}</ButtonInner>
      )}
    </Link>
  );
}
