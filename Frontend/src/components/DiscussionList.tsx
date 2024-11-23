import { DiscussionProps } from '@/@types/space';
import { UserInfoButton } from '@/components/UserInfoButton';
import { formatTime } from '@/lib/formatDate';

import Link from 'next/link';

const DiscussionList = ({
  space_uuid,
  discussions,
}: {
  space_uuid: string;
  discussions: DiscussionProps[];
}) => {

  return (
    <>
      {discussions.map((discussion) => (
        <div
          key={discussion.uuid}
          className="group z-0 relative mt-4 rounded-xl border border-slate-200 dark:border-slate-800"
        >
          <div className="absolute -inset-px rounded-xl border-2 border-transparent opacity-0 [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.slate.800)]" />
          <div className="relative overflow-hidden rounded-xl px-6 pb-4 pt-6">
            <p className="text-base font-bold text-slate-900 dark:text-white">
              <Link
                href={`/dashboard/discussion/${space_uuid}/${discussion.uuid}`}
              >
                <span className="absolute -inset-px rounded-xl" />
                {discussion.name}
              </Link>
            </p>
            <p className="mt-1.5 line-clamp-1 text-sm text-slate-700 dark:text-slate-400">
              {discussion.description}
            </p>

            <div className="mt-1 flex items-center justify-between gap-x-1.5 text-sm text-slate-700 dark:text-slate-400">
              <div className="hidden items-center sm:flex">
                <span className="">Created by </span>

                <UserInfoButton username={discussion.owner} />
              </div>
              {discussion.latest_message && (
                <div className="flex items-center gap-x-1.5 text-gray-400 dark:text-gray-400">
                  <UserInfoButton
                    username={discussion.latest_message.sender}
                    onlyAvatar
                  />
                  {discussion.latest_message.content.slice(0, 6)}
                  {discussion.latest_message.content.length > 6 ? '...' : ''}
                  <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                  <p className=" ">
                    <time dateTime={discussion.latest_message.timestamp}>
                      {formatTime(
                        discussion.latest_message.timestamp,
                        '',
                        true,
                      )}
                    </time>
                  </p>
                </div>
              )}
            </div>
            {/* <dl className="mt-4 flex w-full flex-none justify-between gap-x-8 sm:w-auto">
                <div className="flex -space-x-0.5">
                  <dt className="sr-only">Commenters</dt>
                  {discussion.commenters.map((commenter) => (
                    <dd key={commenter.id}>
                      <img
                        className="h-6 w-6 rounded-full bg-neutral-50 ring-2 ring-white"
                        src={commenter.imageUrl}
                        alt={commenter.name}
                      />
                    </dd>
                  ))}
                </div>
                <div className="flex w-16 gap-x-2.5">
                  <dt>
                    <span className="sr-only">Total comments</span>
                    {discussion.status === 'resolved' ? (
                      <CheckCircleIcon
                        className="h-6 w-6 text-gray-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <ChatBubbleLeftIcon
                        className="h-6 w-6 text-gray-400"
                        aria-hidden="true"
                      />
                    )}
                  </dt>
                  <dd className="text-sm leading-6 text-gray-900 dark:text-white">
                    {discussion.totalComments}
                  </dd>
                </div>
              </dl> */}
          </div>
        </div>
      ))}
    </>
    // </ul>
  );
};

export default DiscussionList;
