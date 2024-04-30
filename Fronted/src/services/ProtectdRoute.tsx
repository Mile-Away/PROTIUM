import Loading from '@/app/loading';
import Layout from '@/app/login/page.mdx';
import { useEffect, useState } from 'react';
import { useAuthServiceContext } from '../context/AuthContext';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLogged, checkIsLogged } = useAuthServiceContext();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    checkIsLogged().then(() => {
      setIsDataLoaded(true);
    });
  }, []);

  if (!isDataLoaded) {
    return <Loading />;
  } else {
    if (!isLogged) {
      return <Layout ALERT={true} />;
    } else {
      return <>{children}</>;
    }
  }
}
