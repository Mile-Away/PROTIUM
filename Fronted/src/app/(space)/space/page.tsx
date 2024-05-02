'use client';
import { useAuthServiceContext } from '@/context/AuthContext';
import { useCRUD } from '@/hooks/useCrud';
import { useEffect } from 'react';
import AfterLogin from './AfterLogin';
import BeforeLogin from './BeforeLogin';
export default function Page() {
  const { fetchData, dataCRUD, isLoading, error } = useCRUD(
    [],
    '/server/vs/select/',
  );

  useEffect(() => {
    fetchData();
  }, []);

  console.log(dataCRUD);

  const { isLogged } = useAuthServiceContext();

  if (isLogged) {
    return (
      <AfterLogin recommendedSpaces={dataCRUD} searchedSpaces={dataCRUD} />
    );
  } else {
    return <BeforeLogin />;
  }
}
