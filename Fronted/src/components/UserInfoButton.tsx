import { UserProps } from '@/@types/auth-service';
import { MEDIA_URL } from '@/config';
import { useDictCRUD } from '@/hooks/useCrud';
import { SparklesIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
export const UserInfoButton = ({
  username,
  className,
  star,
  children,
  disabled,
  onlyAvatar,
  ...props
}: {
  username: string;
  star?: boolean;
  disabled?: boolean;
  onlyAvatar?: boolean;
} & (
  | React.ComponentPropsWithoutRef<typeof Link>
  | ({ href?: undefined } & React.ComponentPropsWithoutRef<'button'>)
)) => {
  const [loading, setLoading] = useState(false);
  const { fetchData, dataCRUD, isLoading, error } = useDictCRUD(
    {} as UserProps,
    `/accounts/get_basic_info/?username=${username}`,
  );
  const router = useRouter();
  
  useEffect(() => {
    if (username) {
      fetchData();
    }
  }, []);

  if (loading || isLoading) {
    return (
      <button
        className=" pointer-events-none my-2 inline-flex select-none items-center space-x-2 rounded-md p-2 "
        disabled
      >
        <img
          src={MEDIA_URL + dataCRUD.avatar}
          alt="avatar"
          className="h-4 w-4 animate-pulse rounded-full"
        />
        {!onlyAvatar && (
          <span className="w-fit animate-pulse text-xs font-semibold">
            {dataCRUD.username}
          </span>
        )}
        {star && (
          <SparklesIcon className="h-4 w-4 animate-pulse text-yellow-400 dark:text-yellow-300" />
        )}
      </button>
    );
  }
  return typeof props.href === 'undefined' ? (
    <button
      className={clsx(
        ' my-2 inline-flex items-center space-x-2 rounded-md p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800',
        className,
      )}
      onClick={() => {
        setLoading(true);
        router.push(`/profile/${dataCRUD.username}`);
      }}
    >
      <img
        src={MEDIA_URL + dataCRUD.avatar}
        alt="avatar"
        className="h-4 w-4 rounded-full"
      />
      {!onlyAvatar && (
        <span className="w-fit text-xs font-semibold">{dataCRUD.username}</span>
      )}
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
