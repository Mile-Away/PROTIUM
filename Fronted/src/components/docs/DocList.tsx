import { DocProps } from '@/@types/maunscript';
import DocSlide from '@/components/docs/DocSlide';
import { BASE_URL } from '@/config';
import useAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { useCRUD } from '@/hooks/useCrud';
import { formatTime } from '@/lib/formatDate';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DeleteAlert from './DeleteAlert';
import FilePlusIcon from './FilePlusIcon';
import PublishStatus from './PublishStatus';

export default function DocList() {
  const [isDelete, setIsDelete] = useState('');
  const [open, setOpen] = useState(false);
  const [instance, setInstance] = useState(0);
  const { dataCRUD, error, isLoading, fetchData } = useCRUD<DocProps>(
    [],
    '/document/vs/document/',
  );
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [isDelete]);

  const jwtAxios = useAxiosWithInterceptors();

  const createDoc = () => {
    jwtAxios
      .post(`${BASE_URL}/document/vs/document/`, { title: '' })
      .then((res) => {
        if (res.data) {
          router.push(`/dashboard/manuscript/edit/${res.data.uuid}/`);
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  return (
    <>
      <ul
        role="list"
        className="divide-y divide-gray-100 dark:divide-neutral-700"
      >
        {dataCRUD.map((doc) => (
          <li
            key={doc.id}
            className="relative flex justify-between gap-x-6 rounded py-5 hover:bg-neutral-50 dark:hover:bg-neutral-800 sm:px-2"
          >
            <div className="flex min-w-0 gap-x-4">
              {/* <img className="h-12 w-12 flex-none rounded-full bg-neutral-50" src={person.imageUrl} alt="" /> */}
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                  <button
                    onClick={() => {
                      setInstance(doc.id);
                      setOpen(true);
                    }}
                    className=" text-start"
                  >
                    {/* 这个 span 是保证整个框可点击的 */}
                    <span className="absolute inset-x-0 -top-px bottom-0" />
                    <p className=" line-clamp-2">{doc.title}</p>
                  </button>
                </p>
                <p className="mt-1 flex truncate text-xs leading-5 text-gray-500 dark:text-gray-300">
                  {formatTime(doc.updated_at, 'long')}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-x-4">
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                {/* <p className="text-xs leading-6 text-gray-900 dark:text-white">
                  {doc.author}
                </p> */}
                <div className="mt-1">
                  <PublishStatus isPublish={doc.publish} />
                </div>
                {/* {person.lastSeen ? (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Last seen{' '}
                  <time dateTime={person.lastSeenDateTime}>
                    {person.lastSeen}
                  </time>
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs leading-5 text-gray-500">Online</p>
                </div>
              )} */}
              </div>
              <div className="z-0">
                <button
                  className="z-10 rounded p-2 text-gray-300 hover:rounded hover:bg-neutral-100 hover:text-indigo-600 dark:text-gray-500 dark:hover:bg-neutral-600 dark:hover:text-white"
                  type="button"
                  title="edit"
                  aria-description="edit"
                  onClick={() =>
                    router.push(`/dashboard/manuscript/edit/${doc.uuid}`)
                  }
                >
                  <PencilSquareIcon
                    className="h-5 w-5 flex-none text-inherit"
                    aria-hidden="true"
                  />
                </button>
                <button
                  className="z-10 rounded p-2 text-gray-300 hover:rounded hover:bg-neutral-100
                 hover:text-red-600 dark:text-gray-500
                  dark:hover:bg-neutral-700 dark:hover:text-red-400"
                  type="button"
                  title="delete"
                  aria-description="delete"
                  onClick={() => setIsDelete(`${doc.id}`)}
                >
                  <TrashIcon
                    className="h-5 w-5 flex-none text-inherit"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
            <DeleteAlert
              isOpen={isDelete === `${doc.id}`}
              onClose={() => setIsDelete('')}
              id={`${doc.id}`}
            />
          </li>
        ))}
      </ul>
      {dataCRUD.length === 0 && (
        <button
          type="button"
          className="relative mt-4 block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-500 dark:hover:border-gray-400"
          onClick={() => createDoc()}
        >
          <FilePlusIcon />
          <span className="mt-2 block text-sm font-semibold text-gray-900 dark:text-white">
            Create New Document
          </span>
        </button>
      )}
      <DocSlide
        isOpen={open}
        instance_id={instance}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
