'use client';
import { setActiveItem } from '@/store/environment/materialSlice';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Material } from './Material';

export default function Page({
  params,
}: {
  params: { uuid: string; dirs: string[] };
}) {
  const { uuid, dirs } = params;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveItem(dirs));
  }, [dirs]);

  return <Material uuid={uuid} dirs={dirs} />;
}
