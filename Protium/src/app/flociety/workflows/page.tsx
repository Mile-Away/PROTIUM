'use client';

import { useCRUD } from '@/hooks/useCrud';
import { useEffect, useState } from 'react';
import WorkflowPost, { PostProps } from './WorkflowPost';

export default function Page() {
  const [posts, setPosts] = useState<PostProps[]>([]);

  const { fetchData, dataCRUD } = useCRUD(
    [] as PostProps[],
    '/flociety/vs/workflows/library/',
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setPosts(dataCRUD);
  }, [dataCRUD]);

  console.log(posts);

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Workflow
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Find template you need to build your workflow
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {posts.map((post) => (
            <WorkflowPost key={post.workflow.uuid} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
