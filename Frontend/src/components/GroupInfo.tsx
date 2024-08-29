import { UserProps } from '@/@types/auth-service';
import { useDictCRUD } from '@/hooks/useCrud';
import { SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect } from 'react';

export const GroupInfoButton = ({
  group_id,
  className,
  star,
  children,
  disabled,
  ...props
}: { group_id: number; star?: boolean; disabled?: boolean } & (
  | React.ComponentPropsWithoutRef<typeof Link>
  | ({ href?: undefined } & React.ComponentPropsWithoutRef<'button'>)
)) => {
  const { fetchData, dataCRUD, isLoading, error } = useDictCRUD(
    {} as UserProps,
    `/accounts/?is_public=true&user_id=${group_id}`,
  );

  useEffect(() => {
    fetchData();
  }, [group_id]);

  return typeof props.href === 'undefined' ? (
    <button className="m-2 flex items-center space-x-2 rounded-md p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800">
      <span className=" text-sm font-semibold">{dataCRUD.username}</span>
      {star && (
        <SparklesIcon className="h-4 w-4 text-yellow-400 dark:text-yellow-300" />
      )}
    </button>
  ) : (
    <Link className={className} {...props}>
      {children}
    </Link>
  );
};
