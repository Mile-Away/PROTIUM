'use client';
import { SpaceProps } from '@/@types/space';
import { GitHubIcon } from '@/components/SocialIcons';
import { MEDIA_URL, PrimarySite } from '@/config';
import useAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { useDictCRUD } from '@/hooks/useCrud';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';

export default function Page({ params }: { params: { name: string } }) {
  const jwtAxios = useAxiosWithInterceptors();

  const [previewIcon, setPreviewIcon] = useState<string>('');
  const [previewBanner, setPreviewBanner] = useState<string>('');
  const { fetchData, dataCRUD, isLoading, error } = useDictCRUD<SpaceProps>(
    {} as SpaceProps,
    `/server/server/${params.name}`,
  );

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

  const initialFormValues = {
    name: '',
    description: '',
    icon: '',
    banner: '',
    github_url: '',
    document_url: '',
  } as SpaceProps;

  const formik = useFormik({
    initialValues: initialFormValues,
    onSubmit: (values) => {
      const { name, description, icon, banner, github_url, document_url } =
        values;
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);

      if ((icon as any) instanceof File) {
        formData.append('icon', icon);
      }
      if ((banner as any) instanceof File) {
        formData.append('banner', banner);
      }

      formData.append('document_url', document_url);
      formData.append('github_url', github_url);

      console.log(formData);

      const res = putData(formData);
    },
  });

  useEffect(() => {
    if (params.name) fetchData();
  }, []);

  useEffect(() => {
    if (dataCRUD.name) {
      formik.setValues(dataCRUD);
    }
  }, [dataCRUD]);

  const handleIconChange = (e: any) => {
    formik.setFieldValue(e.target.name, e.target.files[0]);
    setPreviewIcon(URL.createObjectURL(e.target.files[0]));
  };

  const handleBannerChange = (e: any) => {
    formik.setFieldValue(e.target.name, e.target.files[0]);
    setPreviewBanner(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <form className="max-w-full py-4" onSubmit={formik.handleSubmit}>
      <div className="space-y-12">
        {/* General */}
        <div className="border-b border-neutral-900/10  pb-12 dark:border-neutral-50/10">
          <div>
            <h2 className="text-lg font-semibold leading-7 text-neutral-900 dark:text-white">
              General
            </h2>
            <p className="mt-1 text-sm leading-6 text-neutral-600">
              This information will be displayed publicly as space cover.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-neutral-900 dark:text-white"
              >
                Space Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-neutral-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 dark:ring-neutral-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-neutral-500 dark:text-neutral-400 sm:text-sm">
                    {`${PrimarySite.split('/').pop()}/space/`}
                  </span>
                  <input
                    autoSave=""
                    type="text"
                    name="name"
                    id="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    autoComplete="off"
                    className=" form-input block flex-1 border-0 bg-transparent
                     py-1.5 pl-1 text-neutral-900 placeholder:text-neutral-400 focus:ring-0 dark:text-white sm:text-sm sm:leading-6"
                    placeholder=""
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-neutral-900 dark:text-white"
              >
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  className=" form-textarea block w-full rounded-md border-0 bg-white py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400
                   focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-neutral-900 dark:text-white
                    dark:ring-neutral-600 sm:text-sm sm:leading-6"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                Write brief description about your space.
              </p>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="icon"
                className="block text-sm font-medium leading-6 text-neutral-900 dark:text-white"
              >
                Icon
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <img
                  src={previewIcon || MEDIA_URL + formik.values.icon}
                  alt="icon"
                  className="h-8 w-8 rounded-none object-cover text-neutral-300 dark:text-neutral-600"
                  aria-hidden="true"
                />

                <label
                  htmlFor="icon"
                  className="relative rounded-md bg-white 
                  font-semibold text-indigo-600 hover:text-indigo-500 
                 dark:bg-neutral-900"
                >
                  <span
                    className="cursor-pointer 
                  rounded-md bg-white px-2.5  
                  py-1.5 text-sm font-semibold
                   text-neutral-900 shadow-sm 
                   ring-1 ring-inset ring-neutral-300
                    hover:bg-neutral-50 dark:bg-neutral-900
                     dark:text-white dark:ring-neutral-700"
                  >
                    Change
                  </span>
                  <input
                    id="icon"
                    name="icon"
                    title="icon"
                    type="file"
                    onChange={handleIconChange}
                    className=" form-input sr-only"
                  />
                </label>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="banner"
                className="block text-sm font-medium leading-6 text-neutral-900 dark:text-white"
              >
                Banner
              </label>
              <div
                className="mt-2 flex justify-center rounded-lg border border-dashed
               border-neutral-900/25 px-6 py-10 dark:border-neutral-50/25"
              >
                <div className="text-center">
                  <img
                    src={previewBanner || MEDIA_URL + formik.values.banner}
                    alt="banner"
                    className="mx-auto h-16 w-fit text-neutral-300 dark:text-neutral-600"
                    aria-hidden="true"
                  />
                  <div className="mt-4 flex text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                    <label
                      htmlFor="banner"
                      className="dark:bg-neut-900 relative cursor-pointer rounded-md bg-transparent 
                      font-semibold text-indigo-600 hover:border-indigo-400
                       hover:text-indigo-500 dark:text-indigo-400"
                    >
                      <span>Upload a file</span>
                      <input
                        id="banner"
                        name="banner"
                        title="banner"
                        type="file"
                        onChange={handleBannerChange}
                        className="form-input sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-neutral-600 dark:text-neutral-300">
                    PNG, JPG, up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                htmlFor="document_url"
                className="flex items-center gap-2 text-sm font-medium leading-6 text-neutral-900
                 dark:text-white"
              >
                <DocumentTextIcon className="h-4 w-4" aria-hidden="true" />
                Document URL
              </label>
              <div className="mt-2">
                <input
                  type="url"
                  name="document_url"
                  id="document_url"
                  value={formik.values.document_url}
                  onChange={formik.handleChange}
                  autoComplete="document_url"
                  className=" form-input block w-full rounded-md border-0 bg-transparent
                   py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300
                    placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:text-white dark:ring-neutral-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="github_url"
                className="flex items-center gap-x-2 text-sm font-medium leading-6 text-neutral-900
                 dark:text-white"
              >
                <GitHubIcon className="h-4 w-4" aria-hidden="true" />
                Github Repo URL
              </label>
              <div className="mt-2">
                <input
                  id="github_url"
                  name="github_url"
                  type="url"
                  value={formik.values.github_url}
                  onChange={formik.handleChange}
                  autoComplete="github"
                  className="  form-input
                  block w-full rounded-md border-0 bg-transparent py-1.5
                  text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:text-white dark:ring-neutral-600 sm:text-sm sm:leading-6"
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
