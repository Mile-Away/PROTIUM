import { MoonIcon, SunIcon } from '@/components/Icons';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

function ThemeIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-5-8a5 5 0 0 0 5 5V7a5 5 0 0 0-5 5Z"
      />
    </svg>
  );
}

export function ThemeSwitch({ className }: { className?: string }) {
  let [mounted, setMounted] = useState(false);
  let { resolvedTheme, setTheme } = useTheme();
  let otherTheme = resolvedTheme === 'dark' ? 'light' : 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    // <button
    //   type="button"
    //   className="group z-50 -m-2.5 p-2.5"
    //   onClick={() => setTheme(otherTheme)}
    // >
    //   <span className="sr-only">Switch to {otherTheme} theme</span>
    //   <ThemeIcon
    //     className="h-6 w-6 fill-gray-700 opacity-50 transition-opacity
    //    group-hover:opacity-100 dark:fill-white"
    //   />
    // </button>
    <button
      type="button"
      aria-label={mounted ? `Switch to ${otherTheme} theme` : 'Toggle theme'}
      className={clsx('group mx-2', className)}
      onClick={() => setTheme(otherTheme)}
    >
      <SunIcon
        className="h-6 w-6 fill-gray-100 stroke-gray-400 transition
       group-hover:fill-gray-200 group-hover:stroke-gray-700 
       dark:hidden
        dark:fill-gray-50
         dark:stroke-gray-500
         dark:group-hover:fill-gray-50
          dark:group-hover:stroke-gray-600
          "
      />
      <MoonIcon className="hidden h-6 w-6 fill-gray-700 stroke-gray-500 
      transition dark:block [@media(prefers-color-scheme:dark)]:group-hover:stroke-gray-400
       [@media_not_(prefers-color-scheme:dark)]:fill-gray-400/10
        [@media_not_(prefers-color-scheme:dark)]:stroke-gray-500" />
    </button>
  );
}
