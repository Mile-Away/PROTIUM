'use client';
import { SpaceProps } from '@/@types/space';
import { useFormik } from 'formik';
import SetReadme from './SetReadme';
import SetPinnedArticles from './SetPinnedArticles';
import { useDictCRUD } from '@/hooks/useCrud';

export default function Page({ params }: { params: { name: string } }) {



  return (
    <form className="max-w-full py-4">
      <div className="space-y-12">
        {/* Readme */}
        <div className="border-b border-neutral-900/10  pb-12 dark:border-neutral-50/10">
          <div>
            <h2 className=" text-lg font-semibold leading-7 text-neutral-900 dark:text-white">
              Readme
            </h2>
            <p className="mt-1 text-sm leading-6 text-neutral-600">
              Specify a document to be displayed as the space's readme or bind
              your github Readme.
            </p>
          </div>
          <SetReadme spaceName={params.name} />
        </div>

        {/* Pinned Articles */}
        <div className="border-b border-neutral-900/10 pb-12 dark:border-neutral-50/10">
          <h2 className="text-lg font-semibold leading-7 text-neutral-900 dark:text-white">
            Pinned Articles
          </h2>
          <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Add shortcuts to quickly access your articles.
          </p>
          <SetPinnedArticles spaceName={params.name} />
        </div>

      </div>

      {/* <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-neutral-900 dark:hover:text-indigo-400 dark:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div> */}
    </form>
  );
}
