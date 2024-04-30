import clsx from 'clsx'

export function Input({
  className,
  error,
  id,
  type,
  name,
  disabled,
  message,
  children,
  ...props
}: {
  id?: string
  type?: string
  name?: string
  disabled?: boolean
  error?: boolean
  message?: string
} & React.ComponentPropsWithoutRef<'input'>) {
  className = clsx(
    className,
    'w-0 flex-auto bg-transparent px-4 py-2.5 focus:outline-none sm:text-[0.8125rem]/6',
    error
      ? 'rounded-lg border-0 text-red-900 dark:text-red-500 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-inset focus:ring-red-500 focus:text-red-500 sm:text-sm sm:leading-6'
      : 'text-base dark:text-white dark:placeholder:text-gray-500',
    disabled ? 'cursor-not-allowed' : ''
  )

  return (
    <>
      <div className={`relative ${error ? 'mb-2' : 'mb-4'} flex w-full`}>
        <label htmlFor={id} className="sr-only">
          {name}
        </label>
        <input
          className={className}
          id={id}
          name={name}
          type={type}
          disabled={disabled}
          {...props}
        />
        {/* {error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )} */}

        {children}
        <div className="absolute inset-0 -z-10 rounded-lg transition peer-focus:ring-4 peer-focus:ring-indigo-700/15 dark:peer-focus:ring-sky-300/15" />
        <div className="absolute inset-0 -z-10 rounded-lg ring-1 transition dark:bg-white/2.5 dark:ring-white/15 dark:peer-focus:ring-sky-300" />
      </div>
      {error && (
        <div className="bg-transparent px-2 duration-300 animate-in fade-in-50">
          <p className="mb-2 text-sm text-red-600" id="error-message">
            {message}
          </p>
        </div>
      )}
    </>
  )
}
