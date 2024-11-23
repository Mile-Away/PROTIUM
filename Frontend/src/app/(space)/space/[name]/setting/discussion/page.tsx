'use client';
import { SpaceProps } from '@/@types/space';
import createAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { useDictCRUD } from '@/hooks/useCrud';
import { Switch } from '@headlessui/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default function Page({ params }: { params: { name: string } }) {
  const [enabled, setEnabled] = useState(false);
  const jwtAxios = createAxiosWithInterceptors();

  const { fetchData, dataCRUD, error } = useDictCRUD<SpaceProps>(
    {} as SpaceProps,
    `/server/server/${params.name}`,
  );

  useEffect(() => {
    if (params.name) fetchData();
  }, [params.name]);

  useEffect(() => {
    if (dataCRUD) {
      setEnabled(dataCRUD.enable_discussion);
    }
  }, [dataCRUD]);

  const putData = async (values: any) => {
    try {
      const res = await jwtAxios.put(`/server/server/${params.name}/`, values, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckSwitch = async () => {
    setEnabled(!enabled);
    putData({ enable_discussion: !enabled });
  };

  return (
    <form className="max-w-full py-4">
      <div className="space-y-12">
        {/* General */}
        <div className="border-b border-neutral-900/10  pb-12 dark:border-neutral-50/10">
          <div className="mb-8">
            <h2 className=" text-lg font-semibold leading-7 text-neutral-900 dark:text-white">
              Discussion
            </h2>
            <p className="mt-1 text-sm leading-6 text-neutral-600">
              Manage who can access and contribute to discussion.
            </p>
          </div>

          <Switch.Group as="div" className="flex items-center justify-between">
            <span className="flex flex-grow flex-col">
              <Switch.Label
                as="span"
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                passive
              >
                Enable Discussion
              </Switch.Label>
              <Switch.Description
                as="span"
                className="text-sm text-neutral-500 dark:text-neutral-600"
              >
                Choose whether to enable Discussion for this space.
              </Switch.Description>
            </span>
            <Switch
              checked={enabled}
              onChange={handleCheckSwitch}
              className={clsx(
                enabled ? 'bg-indigo-600' : 'bg-neutral-200 dark:bg-neutral-700',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
              )}
            >
              <span className="sr-only">Use setting</span>
              <span
                className={clsx(
                  enabled ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                )}
              >
                <span
                  className={clsx(
                    enabled
                      ? 'opacity-0 duration-100 ease-out'
                      : 'opacity-100 duration-200 ease-in',
                    'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
                  )}
                  aria-hidden="true"
                >
                  <svg
                    className="h-3 w-3 text-gray-400"
                    fill="none"
                    viewBox="0 0 12 12"
                  >
                    <path
                      d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span
                  className={clsx(
                    enabled
                      ? 'opacity-100 duration-200 ease-in'
                      : 'opacity-0 duration-100 ease-out',
                    'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
                  )}
                  aria-hidden="true"
                >
                  <svg
                    className="h-3 w-3 text-indigo-600"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                  </svg>
                </span>
              </span>
            </Switch>
          </Switch.Group>
        </div>

        {/* Shortcuts
        <div className="border-b border-neutral-900/10 pb-12 dark:border-neutral-50/10">
          <h2 className="text-base font-semibold leading-7 text-neutral-900 dark:text-white">
            Content Control
          </h2>
          <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Add shortcuts to quickly access your custom pages.
          </p>
          <li>Who can create?</li>
          <li>Who can chat?</li>
        </div> */}
      </div>
    </form>
  );
}
