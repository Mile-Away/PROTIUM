'use client';
import { SpaceProps } from '@/@types/space';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { useFormik } from 'formik';

export default function Page() {
  const initialFormValues = {
    name: '',
    description: '',
    icon: '',
    banner: '',
  } as SpaceProps;

  const formik = useFormik({
    initialValues: initialFormValues,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <form className="max-w-full py-4">
      <div className="space-y-12">
        {/* General */}

        {/* Shortcuts */}
        <div className="border-b border-neutral-900/10 pb-12 dark:border-neutral-50/10">
          <h2 className="text-base font-semibold leading-7 text-neutral-900 dark:text-white">
            Shortcuts
          </h2>
          <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Add shortcuts to quickly access your custom pages.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="flex items-center gap-2 text-sm font-medium leading-6 text-neutral-900
                 dark:text-white"
              >
                <DocumentTextIcon className="h-4 w-4" aria-hidden="true" />
                Documents URL
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  className=" form-input block w-full rounded-md border-0 bg-transparent
                   py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300
                    placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:text-white dark:ring-neutral-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        {/* <button
          type="button"
          className="text-sm font-semibold leading-6 text-neutral-900 dark:hover:text-indigo-400 dark:text-white"
        >
          Cancel
        </button> */}
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}
