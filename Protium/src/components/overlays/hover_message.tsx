const HoverMessage = ({
  children,
  position,
}: {
  position: 'top' | 'right';
  children: React.ReactNode;
}) => {
  return (
    <>
      {position === 'top' ? (
        <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 -translate-y-2 group-hover:block">
          <div className="relative">
            <span className="rounded whitespace-nowrap w-fit p-2 text-sm font-semibold dark:bg-neutral-800">
              {children}
            </span>
            <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 transform">
              <svg
                className="h-4 w-4 text-neutral-800 dark:fill-neutral-800 dark:text-neutral-800"
                viewBox="0 0 16 16"
              >
                <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute left-full top-1/2 ml-2 hidden -translate-y-1/2 translate-x-2 group-hover:block">
          <div className="relative">
            <span className="-m-2 whitespace-nowrap rounded inline-flex w-fit p-2 text-sm font-semibold dark:bg-neutral-800">
              {children}
            </span>
            <div className="absolute left-0 top-[60%] z-50 -translate-x-full -translate-y-1/2 transform">
              <svg
                className="rotate-180 text-neutral-800 dark:fill-neutral-800 dark:text-neutral-800"
                height={20}
                width={20}
                viewBox="0 0 16 16"
              >
                <path d="M11.646 8.354l-5.482-4.796c-1.105-.964-2.665-.108-2.665 1.412v9.587c0 1.52 1.56 2.376 2.665 1.412l5.482-4.796a1 1 0 0 0 0-1.412z" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HoverMessage;
