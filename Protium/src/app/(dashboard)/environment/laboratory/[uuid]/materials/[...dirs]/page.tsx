'use client';
import { RootReducerProps } from '@/app/store';
import { setActiveItem, setItems } from '@/store/environment/laboratorySlice';
import {
  InformationCircleIcon,
  PaperClipIcon,
  RectangleGroupIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MatHeader from './MatHeader';
import MatTabs from './MatTabs';
import MaterialModal from './MaterialModal';
import { TreeItemProps } from './TreeSortable/types';

const initCategories = [
  {
    icon: RectangleGroupIcon,
    name: 'Layout',
    posts: [
      {
        id: 1,
        title: 'Does drinking coffee make you smarter?',
        date: '5h ago',
        commentCount: 5,
        shareCount: 2,
      },
      {
        id: 2,
        title: "So you've bought coffee... now what?",
        date: '2h ago',
        commentCount: 3,
        shareCount: 2,
      },
    ],
  },
  {
    icon: InformationCircleIcon,
    name: 'Info',
    posts: [
      {
        id: 1,
        title: 'Is tech making coffee better or worse?',
        date: 'Jan 7',
        commentCount: 29,
        shareCount: 16,
      },
      {
        id: 2,
        title: 'The most innovative things happening in coffee',
        date: 'Mar 19',
        commentCount: 24,
        shareCount: 12,
      },
      {
        id: 3,
        title: "The worst advice we've ever heard about coffee",
        date: '4d ago',
        commentCount: 1,
        shareCount: 2,
      },
      {
        id: 4,
        title: "The worst advice we've ever heard about coffee",
        date: '4d ago',
        commentCount: 1,
        shareCount: 2,
      },
      {
        id: 5,
        title: "The worst advice we've ever heard about coffee",
        date: '4d ago',
        commentCount: 1,
        shareCount: 2,
      },
    ],
  },
  {
    icon: PaperClipIcon,
    name: 'Logs',
    posts: [
      {
        id: 1,
        title: 'Ask Me Anything: 10 answers to your questions about coffee',
        date: '2d ago',
        commentCount: 9,
        shareCount: 5,
      },
      {
        id: 2,
        title: "The worst advice we've ever heard about coffee",
        date: '4d ago',
        commentCount: 1,
        shareCount: 2,
      },
      {
        id: 3,
        title: "The worst advice we've ever heard about coffee",
        date: '4d ago',
        commentCount: 1,
        shareCount: 2,
      },
      {
        id: 4,
        title: "The worst advice we've ever heard about coffee",
        date: '4d ago',
        commentCount: 1,
        shareCount: 2,
      },
      {
        id: 5,
        title: "The worst advice we've ever heard about coffee",
        date: '4d ago',
        commentCount: 1,
        shareCount: 2,
      },
    ],
  },
];



export default function Page({
  params,
}: {
  params: { uuid: string; dirs: string[] };
}) {
  const { uuid, dirs } = params;
  const [categories, setCategories] = useState(initCategories);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveItem(dirs));
  }, [dirs]);

  const { activeItem } = useSelector(
    (state: RootReducerProps) => state.laboratory,
  );

  useEffect(() => {
    if (activeItem?.type === 'Container') {
      //categories.filter((category) => category.name !== 'Layout')
      setCategories(initCategories.slice(1, 3));
    } else {
      setCategories(initCategories);
    }
  }, [activeItem]);

  return (
    <div className="relative px-8 py-6 ">
      <div className="pointer-events-none absolute inset-[35%] block rounded-full bg-white/15 blur-2xl"></div>

      <MatHeader />

      <MatTabs categories={categories} />
      <MaterialModal />
    </div>
  );
}
