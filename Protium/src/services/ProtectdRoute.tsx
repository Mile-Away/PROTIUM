import Loading from '@/app/loading';

import { ENV, PrimarySite } from '@/config';
import { useAuthServiceContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLogged, checkIsLogged, authBohrium } = useAuthServiceContext();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    checkIsLogged().then(() => {
      setIsDataLoaded(true);
    });
  }, []);

  if (ENV == 'Bohrium') {
    if (!isDataLoaded) {
      return <Loading />;
    } else {
      if (!isLogged) {
        authBohrium();
      } else {
        return <>{children}</>;
      }
    }
  } else {
    if (!isDataLoaded) {
      return <Loading />;
    } else {
      if (!isLogged) {
        router.push(`${PrimarySite}/login`);
      } else {
        return <>{children}</>;
      }
    }
  }
}
