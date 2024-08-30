import clsx from 'clsx';

export default function PrimaryButton({
  size,
  children,
  className,
  ...props
}: {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<'button'>) {
  return (
    <>
      {size === 'xs' && (
        <button
          type="button"
          className={clsx(
            'rounded bg-indigo-600 px-2 py-1 text-xs font-semibold dark:text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
            className,
          )}
          {...props}
        >
          {children}
        </button>
      )}
      {size === 'sm' && (
        <button
          type="button"
          className={clsx(
            'rounded bg-indigo-600 px-2 py-1 text-sm font-semibold dark:text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
            className,
          )}
          {...props}
        >
          {children}
        </button>
      )}
      {size === 'md' && (
        <button
          type="button"
          className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold dark:text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {children}
        </button>
      )}
      {size === 'lg' && (
        <button
          type="button"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold dark:text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {children}
        </button>
      )}
      {size === 'xl' && (
        <button
          type="button"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold dark:text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {children}
        </button>
      )}
    </>
  );
}
