'use client';
import { NodeTemplateProps } from '@/@types/flociety';
import FlocietyNavbar from '@/components/FlocietyNavbar';
import { useCRUD } from '@/hooks/useCrud';
import { useEffect } from 'react';
import FlocietyNodeTemplate from './FlocietyNodeTemplate';

export default function Page() {
  const { fetchData, dataCRUD, error, isLoading } = useCRUD<NodeTemplateProps>(
    [],
    '/flociety/vs/nodes/library/',
  );

  useEffect(() => {
    fetchData();
  }, []);

  console.log(dataCRUD);

  return (
    <>
      <FlocietyNavbar />
      {isLoading && <div>Loading...</div>}
      {error && <div>{error.message}</div>}
      {dataCRUD.length > 0 && <FlocietyNodeTemplate nodeTemplates={dataCRUD} />}
    </>
  );
}
