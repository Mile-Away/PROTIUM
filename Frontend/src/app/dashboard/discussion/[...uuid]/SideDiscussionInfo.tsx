import { UserInfoButton } from '@/components/UserInfoButton';
import { Dialog, Transition } from '@headlessui/react';
import {
  FaceFrownIcon,
  FaceSmileIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  UsersIcon,
  XMarkIcon as XMarkIconMini,
} from '@heroicons/react/20/solid';
import {
  BackwardIcon,
  Cog6ToothIcon,
  ForwardIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import React, { Fragment, useState } from 'react';

import { useAuthService } from '@/services/AuthService';
import EditDiscussion from './EditDiscussion/EditDiscussion';

const activity = [
  {
    id: 1,
    type: 'commented',
    person: {
      name: 'Chelsea Hagon',
      imageUrl:
        'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    comment:
      'Called client, they reassured me the invoice would be paid by the 25th.',
    date: '3d ago',
    dateTime: '2023-01-23T15:56',
  },
  {
    id: 2,
    type: 'commented',
    person: {
      name: 'Chelsea Hagon',
      imageUrl:
        'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    comment:
      'Called client, they reassured me the invoice would be paid by the 25th.',
    date: '3d ago',
    dateTime: '2023-01-23T15:56',
  },
];
const moods = [
  {
    name: 'Excited',
    value: 'excited',
    icon: FireIcon,
    iconColor: 'text-white',
    bgColor: 'bg-red-500',
  },
  {
    name: 'Loved',
    value: 'loved',
    icon: HeartIcon,
    iconColor: 'text-white',
    bgColor: 'bg-pink-400',
  },
  {
    name: 'Happy',
    value: 'happy',
    icon: FaceSmileIcon,
    iconColor: 'text-white',
    bgColor: 'bg-green-400',
  },
  {
    name: 'Sad',
    value: 'sad',
    icon: FaceFrownIcon,
    iconColor: 'text-white',
    bgColor: 'bg-yellow-400',
  },
  {
    name: 'Thumbsy',
    value: 'thumbsy',
    icon: HandThumbUpIcon,
    iconColor: 'text-white',
    bgColor: 'bg-blue-500',
  },
  {
    name: 'I feel nothing',
    value: null,
    icon: XMarkIconMini,
    iconColor: 'text-gray-400',
    bgColor: 'bg-transparent',
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface DiscussionInfoProps {
  channelUUID: string;
  serverUUID: string;
  discussionName: string;
  description: string;
  owner: string;
  admins: string[];
  progress?: string;
  pinnedAnswer?: string;
  recommandAnswer?: string[];
  onRefresh: () => void;
}

const EditDiscussionButton = ({
  serverUUID,
  channelUUID,
  onEditSuccess,
}: {
  serverUUID: string;
  channelUUID: string;
  onEditSuccess: () => void;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        <Cog6ToothIcon
          className="-ml-0.5 h-5 w-5 text-gray-600 opacity-60 hover:opacity-100 dark:text-gray-300"
          aria-hidden="true"
        />
      </button>
      <EditDiscussion
        open={open}
        onClose={() => setOpen(false)}
        serverUUID={serverUUID}
        channelUUID={channelUUID}
        onEditSuccess={onEditSuccess}
      />
    </>
  );
};

const DiscussionInfo = ({
  discussionName,
  serverUUID,
  channelUUID,
  description,
  owner,
  admins,
  progress,
  pinnedAnswer,
  recommandAnswer,
  onRefresh,
}: DiscussionInfoProps) => {
  const { userInfo } = useAuthService();

  return (
    <div className="flex h-full w-full flex-col gap-y-8 overflow-y-auto overflow-x-hidden py-6 pl-6 pr-8 backdrop-blur-3xl xl:backdrop-blur-none">
      <div className="flex flex-row flex-nowrap items-center justify-between gap-x-4">
        <div className="flex items-center gap-x-3">
          <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
            <div className="h-2 w-2 rounded-full bg-current" />
          </div>
          <h1 className="flex gap-x-3 text-base leading-7">
            <span className="font-semibold text-black  dark:text-white">
              {discussionName}
            </span>
          </h1>
        </div>
        {userInfo &&
          serverUUID &&
          channelUUID &&
          admins &&
          admins.includes(userInfo.username) && (
            <EditDiscussionButton
              serverUUID={serverUUID}
              channelUUID={channelUUID}
              onEditSuccess={onRefresh}
            />
          )}
        {/* <div className="order-first flex-none rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-600 ring-indigo-600/30 dark:text-indigo-400 ring-1 ring-inset dark:ring-indigo-400/30 sm:order-none">
            in Progress
          </div> */}
      </div>

      <div className="flex flex-col gap-2">
        {/* Description */}
        <div className="group flex flex-col gap-2">
          <div className="flex items-center gap-x-2">
            <ForwardIcon className="h-4 w-4 opacity-50 group-hover:opacity-100" />
            <span className="text-sm font-semibold"> Target </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>

        {/* Pinned Answer */}
        {pinnedAnswer && (
          <div className="group flex flex-col gap-2">
            <div className="flex flex-row-reverse items-center justify-start gap-x-2">
              <BackwardIcon className="h-4 w-4 opacity-50 group-hover:opacity-100" />
              <span className="text-sm font-semibold"> Pinned solution </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {pinnedAnswer}
            </p>
          </div>
        )}
      </div>

      {/* Activity */}
      {recommandAnswer && (
        <div className="">
          <h2 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
            Recommand answers
          </h2>
          <ul role="list" className="mt-4 space-y-6">
            {activity.map((activityItem, activityItemIdx) => (
              <li key={activityItem.id} className="relative flex gap-x-4">
                <div
                  className={classNames(
                    activityItemIdx === activity.length - 1
                      ? 'h-6'
                      : '-bottom-6',
                    'absolute left-0 top-0 flex w-6 justify-center',
                  )}
                >
                  <div className="w-px bg-neutral-200 dark:bg-neutral-700" />
                </div>

                <img
                  src={activityItem.person.imageUrl}
                  alt=""
                  className="bg-neutralral-50 relative mt-3 h-6 w-6 flex-none rounded-full"
                />
                <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200 dark:ring-neutral-700">
                  <div className="flex justify-between gap-x-4">
                    <div className="py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {activityItem.person.name}
                      </span>
                    </div>
                    <time
                      dateTime={activityItem.dateTime}
                      className="flex-none py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-300"
                    >
                      {activityItem.date}
                    </time>
                  </div>
                  <p className="text-sm leading-6 text-gray-500 dark:text-gray-300">
                    {activityItem.comment}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Admins */}
      {admins && (
        <div className="group flex flex-col gap-2 border-t border-black/5 pt-6 dark:border-white/10">
          <div className="flex items-center gap-x-2">
            <UsersIcon className="h-4 w-4 opacity-50 group-hover:opacity-100" />
            <span className="text-sm font-semibold"> Admins </span>
          </div>
          <div className="flex flex-wrap gap-x-2">
            {admins.map((admin) => (
              <UserInfoButton
                key={admin}
                username={admin}
                className="flex-shrink-0 hover:bg-indigo-50 dark:hover:bg-indigo-700"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DesktopSideDiscussionInfo = ({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<'aside'>) => {
  return <aside {...props}>{children}</aside>;
};

const SideDiscussionInfo = ({
  isDesktopOpen,
  onDesktopClose,
  isMobileOpen,
  onMobileClose,
  ...props
}: {
  isDesktopOpen: boolean;
  onDesktopClose: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
} & DiscussionInfoProps) => {
  return (
    <>
      {/* 桌面端 */}
      <DesktopSideDiscussionInfo
        className={clsx(
          'fixed bottom-0 right-0 top-16 hidden border-l border-black/5 bg-inherit transition-all duration-300 ease-in-out dark:border-white/10 xl:flex',
          isDesktopOpen ? 'w-80' : 'w-0',
        )}
      >
        <DiscussionInfo {...props} />
      </DesktopSideDiscussionInfo>

      {/* 移动端的右侧滑出 */}
      <div className="xl:hidden">
        <Transition.Root show={isMobileOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={onMobileClose}>
            <div className="fixed inset-0" />

            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed bottom-0 right-0 top-16 flex pl-10 xl:hidden ">
                  <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                  >
                    <Dialog.Panel className="pointer-events-auto w-80">
                      <DiscussionInfo {...props} />
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </>
  );
};

export default SideDiscussionInfo;
