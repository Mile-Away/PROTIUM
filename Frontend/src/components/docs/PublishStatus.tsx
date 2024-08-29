function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

const PublishStatus = ({
  isPublish,
  setWhite = false,
}: {
  isPublish: boolean;
  setWhite?: boolean;
}) => {
  return (
    <div className="flex items-center text-xs">
      <span
        className={classNames(
          'inline-block h-2 w-2 flex-shrink-0 rounded-full',
          isPublish ? 'bg-green-400' : 'bg-neutral-200 dark:bg-neutral-500',
        )}
        aria-hidden="true"
      />
      <span
        className={classNames(
          'ml-2 truncate',
          isPublish
            ? `${setWhite ? 'font-semibold text-white' : ' font-semibold'} `
            : 'text-gray-400 dark:text-gray-500',
        )}
      >
        {isPublish ? 'Public' : 'Private'}
        <span className="sr-only"> is {isPublish ? 'online' : 'offline'}</span>
      </span>
    </div>
  );
};

export default PublishStatus;
