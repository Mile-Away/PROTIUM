'use client';
import Loading from '@/app/loading';
import { UserInfoButton } from '@/components/UserInfoButton';
import { useDictCRUD } from '@/hooks/useCrud';
import useWorkflowWebSocket from '@/services/workflowService';
import {
  InboxArrowDownIcon,
  PencilIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { PostProps } from '../WorkflowPost';
import TempReactFlow from './TempReactFlow';

export default function Page({ params }: { params: { uuid: string } }) {
  //   const [workflow, setWorkflow] = useState<WorkflowProps | null>(null);
  const {} = useWorkflowWebSocket(params);
  const [post, setPost] = useState<PostProps>();

  const { fetchData, dataCRUD } = useDictCRUD(
    {} as PostProps,
    `/flociety/workflow/${params.uuid}/`,
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (dataCRUD?.title) {
      setPost(dataCRUD);
    }
  }, [dataCRUD]);

  console.log(dataCRUD);

  if (!post) {
    return <Loading />;
  }

  return (
    <>
      <div className=" absolute left-32 z-30 h-[calc(100vh)] w-1/3 bg-gradient-to-r from-white to-white/10 dark:from-neutral-900  dark:to-transparent"></div>
      <div className=" absolute left-8 top-16 z-40 mt-16 flex w-1/3 flex-col gap-16">
        <div className=" absolute inset-x-0 bottom-0"></div>
        <div className="flex flex-col gap-4">
          <h1 className="font-display text-4xl font-bold text-indigo-600 dark:text-indigo-400 ">
            {post.title}
          </h1>
          <div className=" flex items-center justify-between">
            <UserInfoButton
              className="w-fit"
              username={post.workflow.creator.username}
            />
            <div className="flex gap-4 rounded p-2">
              <button className="rounded px-2 py-1 hover:bg-neutral-100 dark:hover:bg-white/10">
                <StarIcon className="size-5" />
              </button>
              <Menu
                as="div"
                className=" rounded px-2 py-1 hover:bg-neutral-100 dark:hover:bg-white/10"
              >
                <MenuButton as="div" className=" flex w-fit ">
                  <InboxArrowDownIcon className="size-5 text-white" />
                </MenuButton>
                {/* <MenuItems transition anchor="bottom end">
                  <MenuItem as="div">
                    <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10">
                      <PencilIcon className="size-4 fill-white/30" />
                      Edit
                      <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">
                        ⌘E
                      </kbd>
                    </button>
                  </MenuItem>
                </MenuItems> */}
              </Menu>
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm dark:text-white">{post.description}</p>
        </div>
      </div>
      <TempReactFlow />;
    </>
  );
}