import Logo from '@/@brand/Logo';
import { MEDIA_URL } from '@/config';
import { formatTime } from '@/lib/formatDate';
import Link from 'next/link';

export interface PostProps {
  cover: string;
  description: string;
  workflow: {
    id: number;
    uuid: string;
    name: string;
    created_at: string;
    creator: {
      username: string;
      avatar: string;
    };
    public?: boolean;
    as_template?: boolean;
  };
}

const WorkflowPost = ({ post }: { post: PostProps }) => {
  return (
    <article
      key={post.workflow.uuid}
      className="group relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-64" // pt 属性限制高度
    >
      <img
        src={MEDIA_URL + post?.cover}
        alt={post.workflow.name}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-[5] group-hover:bg-white/15 " />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40 dark:from-black dark:via-black/40" />
      <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10 dark:ring-white/10" />

      <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
        <time className="mr-8">
          {formatTime(post.workflow.created_at, 'YYYY-MM-DD')}
        </time>
        <div className="-ml-4 flex items-center gap-x-4">
          <svg
            viewBox="0 0 2 2"
            className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50"
          >
            <circle cx={1} cy={1} r={1} />
          </svg>
          <div className="flex gap-x-2.5">
            <img
              src={`${MEDIA_URL}${post.workflow.creator.avatar}`}
              alt=""
              className="h-6 w-6 flex-none rounded-full bg-white/10"
            />
            {post.workflow.creator.username}
          </div>
        </div>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-6 text-white ">
        <Link href={`/flociety/workflows/${post.workflow.uuid}`}>
          <span className="absolute inset-0" />
          {post.workflow.name}
        </Link>
      </h3>
      {post.workflow.creator.username === 'PROTIUM' && (
        <div className=" group/offcial absolute bottom-0 right-0 p-4">
          <Logo className="h-6 w-6" />
          <div className="invisible absolute left-0 top-0 w-fit -translate-x-full text-nowrap bg-black p-2 text-2xs leading-6 text-white group-hover/offcial:visible">
            Offcial Template
          </div>
        </div>
      )}
    </article>
  );
};

export default WorkflowPost;
