'use client';
import { RootReducerProps } from '@/app/store';

import { UniqueIdentifier } from '@dnd-kit/core';
import {
  InformationCircleIcon,
  PaperClipIcon,
  RectangleGroupIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MatHeader from './MatHeader';
import MatTabs, { MatTabProps } from './MatTabs';
import MaterialModal from './modals/MaterialModal';
import InfoTab from './tabs/InfoTab';
import LayoutTab from './tabs/LayoutTab';
import LogsTab from './tabs/LogsTab';
const initCategories: MatTabProps[] = [
  {
    icon: RectangleGroupIcon,
    name: 'Layout',
    panel: <LayoutTab gridContainerColumns={5} />,
  },
  {
    icon: InformationCircleIcon,
    name: 'Info',
    panel: <InfoTab />,
  },
  {
    icon: PaperClipIcon,
    name: 'Logs',
    panel: <LogsTab />,
  },
];

export const Material = ({
  uuid,
  dirs,
}: {
  uuid: string;
  dirs: UniqueIdentifier[];
}) => {
  const [categories, setCategories] = useState(initCategories);

  const dispatch = useDispatch();

  const { activeItem } = useSelector(
    (state: RootReducerProps) => state.material,
  );

  useEffect(() => {
    if (activeItem?.type === 'Container') {
      setCategories(initCategories.slice(1, 3));
    } else {
      setCategories(initCategories);
    }
  }, [activeItem]);

  return (
    <div className="relative px-8 py-6 ">
      <div className="pointer-events-none absolute inset-[35%] block rounded-full bg-white/15 blur-2xl"></div>

      <MatHeader type={activeItem?.type} dirs={dirs} uuid={uuid} />

      <MatTabs tabs={categories} />
      <MaterialModal />
    </div>
  );
};
