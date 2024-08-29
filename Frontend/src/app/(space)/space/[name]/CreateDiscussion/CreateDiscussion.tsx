import { DiscussionProps } from '@/@types/space';
import usePost from '@/hooks/usePost';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useFormik } from 'formik';
import { Fragment } from 'react';
import AdminsRadios from './AdminsRadios';
import PrivacyRadios from './PrivacyRadios';

export default function CreateDiscussion({
  open,
  onClose,
  server,
  onCreateSuccess,
}: {
  open: boolean;
  onClose: () => void;
  server: string;
  onCreateSuccess: () => void;
}) {
  const { postData, dataBack, isLoading, error } = usePost<
    Partial<DiscussionProps>
  >('/server/vs/channel/');

  const formik = useFormik<Partial<DiscussionProps>>({
    initialValues: {
      name: '',
      description: '',
      admins: [] as string[],
      members: [] as string[],
      privacy: 'public',
      server: server,
    },
    validate: (values) => {
      const errors: Partial<typeof values> = {};
      if (!values.name) {
        errors.name = 'Please Enter Title';
      }
      if (!values.description) {
        errors.description = 'Please Enter Description';
      }
      return errors;
    },
    onSubmit: async (values) => {
      console.log(values);
      await postData(values)
        .then((res) => {
          console.log(res);
          if (res.status === 201) {
            onClose();
            onCreateSuccess();
            formik.resetForm();
          } else if (res.response.status === 409) {
            formik.setFieldError('name', 'Discussion name already exists in this space.');
          }
        })
        .catch((error: any) => {
          alert('Failed to create discussion');
          console.error(error);
        });
    },
  });

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 top-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <form
                    className="flex h-full flex-col overflow-y-scroll bg-white/95 shadow-xl backdrop-blur-xl dark:bg-neutral-900/95"
                    onSubmit={formik.handleSubmit}
                  >
                    <div className="flex-1">
                      {/* Header */}
                      <div className="bg-neutral-50 px-4 py-6 dark:bg-neutral-800 sm:px-6">
                        <div className="flex items-start justify-between space-x-3">
                          <div className="space-y-1">
                            <Dialog.Title className="text-base font-semibold leading-6 text-neutral-900 dark:text-white ">
                              New Discussion
                            </Dialog.Title>
                            <p className="text-sm text-neutral-500 dark:text-neutral-300">
                              Get started by filling in the information below to
                              create your new discussion.
                            </p>
                          </div>
                          <div className="flex h-7 items-center">
                            <button
                              type="button"
                              className="relative text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300"
                              onClick={onClose}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Divider container */}
                      <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-neutral-200 sm:py-0 dark:sm:divide-neutral-700">
                        {/* Project name */}
                        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <div>
                            <label
                              htmlFor="project-name"
                              className="block text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-50 sm:mt-1.5"
                            >
                              Title
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={formik.values.name}
                              onChange={formik.handleChange}
                              placeholder="Discussion name"
                              className="block w-full rounded-md border-0 bg-white py-1.5 pl-2 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300
                               placeholder:text-neutral-400 focus:ring-2 dark:bg-neutral-900  dark:text-white dark:ring-neutral-500 dark:focus:ring-0 dark:focus:ring-indigo-900 sm:text-sm sm:leading-6"
                              autoComplete="off"
                            />
                            {formik.errors.name && (
                              <div className="text-red-500 dark:text-red-400 text-sm mt-2 sm:col-span-3">
                                {formik.errors.name}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Discussion description */}
                        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <div>
                            <label
                              htmlFor="project-description"
                              className="block text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-50 sm:mt-1.5"
                            >
                              Description
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <textarea
                              id="description"
                              name="description"
                              autoComplete="off"
                              placeholder="This discussion is target to sovle ... question."
                              value={formik.values.description}
                              onChange={formik.handleChange}
                              rows={3}
                              className="block w-full rounded-md border-0 bg-white px-2 py-1.5 text-neutral-900 shadow-sm ring-1
                               ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-neutral-900 dark:text-white
                                dark:ring-neutral-500 sm:text-sm sm:leading-6"
                            />
                            <span className="text-sm leading-6 text-neutral-500 dark:text-neutral-500">
                              Specifically describe the problem to be sovled.
                            </span>
                          </div>
                        </div>

                        {/* Members */}
                        <AdminsRadios
                          // value={formik.values.admins!}
                          value="default"
                          handleChange={(value) =>
                            formik.setFieldValue('admins', value)
                          }
                        />
                        {/* Privacy */}
                        <PrivacyRadios
                          value={formik.values.privacy!}
                          handleChange={(value) =>
                            formik.setFieldValue('privacy', value)
                          }
                        />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex-shrink-0 border-t border-neutral-200 px-4 py-5 dark:border-neutral-700 sm:px-6">
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300  hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-50 dark:ring-neutral-700 dark:hover:bg-neutral-800"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
