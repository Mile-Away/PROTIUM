import { CheckCircleIcon } from '@heroicons/react/20/solid';

export default function SuccessAlert({
  isLoading,
  children,
  ...props
}: {
  isLoading: boolean;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div {...props}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {isLoading ? (
            <svg
              className="h-5 w-5 animate-spin text-green-400 dark:text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <CheckCircleIcon
              className="h-5 w-5 text-green-400 dark:text-green-400"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="ml-3 overflow-x-auto whitespace-nowrap">{children}</div>
        {/* <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 dark:bg-green-950 dark:hover:bg-green-800  "
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}
