'use client';
import SortableTree from '@/app/(dashboard)/environment/laboratory/[uuid]/materials/[...dirs]/TreeSortable/SortableTree';
import { useAppDispatch } from '@/app/store';
import { addMaterial } from '@/store/environment/laboratorySlice';
import { fetchMaterials } from '@/store/middleware';
import { useEffect } from 'react';
import ListHeader from './ListHeader';

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { uuid: string };
}) {
  const dispatch = useAppDispatch();

  const handleAddBlankRepo = () => {
    dispatch(
      addMaterial({
        id: 'New Repository',
        type: 'Repository',
        children: [],
        status: 'idle',
      }),
    );
  };

  useEffect(() => {
    dispatch(fetchMaterials({ uuid: params.uuid }));
  }, []);

  return (
    <div className=" my-4 flex h-[calc(100%-12rem)] w-full rounded">
      <div className=" w-64 overflow-scroll rounded-l bg-white/5 px-2 py-4">
        <ListHeader addBlankRepo={handleAddBlankRepo} />
        <SortableTree collapsible indicator />
      </div>
      <div className=" relative h-full flex-1 overflow-scroll rounded-r bg-black">
        {children}
      </div>
    </div>
  );
}
