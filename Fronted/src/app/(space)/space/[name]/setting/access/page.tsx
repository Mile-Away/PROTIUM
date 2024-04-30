'use client';
import { SpaceProps } from '@/@types/space';
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
        <div className="border-b border-neutral-900/10  pb-12 dark:border-neutral-50/10">
          <div>
            <h2 className=" text-lg font-semibold leading-7 text-neutral-900 dark:text-white">
              Admins
            </h2>
            <p className="mt-1 text-sm leading-6 text-neutral-600">
              Admins can manage overview, discussion and publication settings.
            </p>
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
