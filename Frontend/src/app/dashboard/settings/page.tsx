'use client';
import { UserProps } from '@/@types/auth-service';
import { MEDIA_URL, PrimarySite } from '@/config';
import createAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { useDictCRUD } from '@/hooks/useCrud';
import formatToken from '@/lib/formatToken';
import { EyeIcon, EyeSlashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { FormikErrors, useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BorderdTableLists from './BorderdTableLists';
import GenerateNewTokenDialog from './GenerateNewTokenDialog';

interface FormValues {
  username: string;
  about: string;
  avatar: string;
  email: string;
  last_name: string;
  first_name: string;
  // 其他表单字段
}

export interface TokenListProps {
  id: number;
  name: string;
  token: string;
  created: string;
  last_used: string;
}

type ExtendedFormikErrors = FormikErrors<FormValues> & {
  username?: string[] | string;
};

export default function Example() {
  const router = useRouter();
  const jwtAxios = createAxiosWithInterceptors();
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [bohriumToken, setBohriumToken] = useState<string>();
  const [accessTokens, setAccessTokens] = useState<TokenListProps[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditBohriumToken, setIsEditBohriumToken] = useState(false);
  const [inputType, setInputType] = useState('password');
  const [isBohriumAccessTokenVisible, setIsBohriumAccessTokenVisible] =
    useState(false);

  const { fetchData, dataCRUD, error, isLoading } = useDictCRUD(
    {} as UserProps,
    '/accounts/',
  );

  const fetchBohriumAccessToken = async () => {
    try {
      const res = await jwtAxios.get(
        `/account/arithmatic_access/?platform=bohrium`,
      );
      if (res.status === 200) {
        setBohriumToken(res.data.bohrium_access_token);
      }
    } catch (error: any) {
      setIsEditBohriumToken(true);
      console.log(error.response.data);
    }
  };

  const fetchAccessToken = async () => {
    try {
      const res = await jwtAxios.get(`/account/token/`);
      if (res.status === 200) {
        console.log(res.data);
        setAccessTokens(res.data);
      }
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      username: dataCRUD.username,
      about: dataCRUD.about,
      avatar: dataCRUD.avatar,
      email: dataCRUD.email,
      last_name: dataCRUD.last_name,
      first_name: dataCRUD.first_name,
    },
    validate: (values: FormValues) => {
      const errors: ExtendedFormikErrors = {};

      if (!values.username) {
        errors.username = 'Username is required';
      }

      return errors;
    },

    onSubmit: async (values) => {
      const { username, avatar, about } = values;
      const formData = new FormData();
      formData.append('username', username);

      formData.append('about', about);

      if ((avatar as any) instanceof File) {
        formData.append('avatar', avatar);
      }
      try {
        const res = await jwtAxios.put(`/account/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (res.status === 200) {
          alert('Success');
          window.location.reload();
          router.push('/dashboard');
        }
      } catch (error: any) {
        formik.setErrors(error.response.data);
        // alert(error.response.data.avatar);
      }
    },
  });

  useEffect(() => {
    fetchData();
    fetchAccessToken();
    fetchBohriumAccessToken();
  }, []);

  useEffect(() => {
    // 从 dataCRUD 中删除 avatar
    formik.setValues(dataCRUD);
  }, [dataCRUD]);

  const handleAvatarChange = (event: any) => {
    const file = event.target.files[0];
    formik.setFieldValue('avatar', file);
    setPreviewAvatar(URL.createObjectURL(file));
  };

  const handleBohriumTokenSubmit = async () => {
    try {
      const res = await jwtAxios.post(
        `/account/arithmatic_access/?platform=bohrium`,
        {
          bohrium_access_token: bohriumToken,
        },
      );
      if (res.status === 201) {
        setIsEditBohriumToken(false);
      }
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  const handleAccessTokenSubmit = async (name: string) => {
    try {
      const res = await jwtAxios.post(`/account/token/`, {
        name: name,
      });
      if (res.status === 201) {
        setAccessTokens((prev) => [...prev, res.data]);
      }
      console.log(res);
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  const handleDeleteToken = async (tokenId: number) => {
    try {
      const res = await jwtAxios.delete(`/account/token/`, {
        data: { token_id: tokenId },
      });
      if (res.status === 204) {
        setAccessTokens(accessTokens?.filter((token) => token.id !== tokenId));
      }
      console.log(res);
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  return (
    <>
      <div className="p-8">
        <div className="space-y-10 divide-y divide-neutral-900/10 dark:divide-white/10">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-neutral-900 dark:text-white">
                Profile
              </h2>
              <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>

            <form
              onSubmit={formik.handleSubmit}
              className="bg-white shadow-sm ring-1 ring-neutral-900/5 dark:bg-neutral-900 dark:ring-white/10 sm:rounded-xl md:col-span-2"
            >
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-neutral-900 dark:text-white"
                    >
                      Username
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-neutral-300 dark:ring-neutral-700 sm:max-w-md">
                        <span className="focu flex select-none items-center pl-3 text-neutral-500 dark:text-neutral-400 sm:text-sm">
                          {`${PrimarySite.split('/').pop()}/profile/`}
                        </span>
                        <input
                          type="text"
                          name="username"
                          id="username"
                          value={formik.values.username}
                          onChange={formik.handleChange}
                          className="form-input block flex-1 rounded border-0 bg-transparent p-1.5 pl-1 text-neutral-900 placeholder:text-neutral-400 dark:text-white sm:text-sm sm:leading-6"
                          placeholder="username"
                          autoFocus={false}
                        />
                      </div>
                    </div>
                    {Array.isArray(formik.errors.username) ? (
                      formik.errors.username.map(
                        (error: string, index: number) => (
                          <ul itemType="disc">
                            <li
                              key={index}
                              className="mt-2 text-sm text-red-400 duration-300 ease-in-out"
                            >
                              {error}
                            </li>
                          </ul>
                        ),
                      )
                    ) : (
                      <p className="mt-2 text-sm text-red-400 duration-300 ease-in-out">
                        {formik.errors.username}
                      </p>
                    )}
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium leading-6 text-neutral-900 dark:text-white"
                    >
                      About
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="about"
                        name="about"
                        value={
                          formik.values.about === 'null'
                            ? ''
                            : formik.values.about
                        }
                        onChange={formik.handleChange}
                        rows={3}
                        className="form-textarea block w-full rounded-md border-0  bg-transparent p-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:text-white dark:ring-neutral-700 sm:text-sm sm:leading-6"
                        defaultValue={''}
                      />
                    </div>
                    {formik.errors.about ? (
                      <ul itemType="disc">
                        <li className="mt-2 text-sm text-red-400 duration-300 ease-in-out">
                          {formik.errors.about}
                        </li>
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm leading-6 text-neutral-400">
                        Write a few sentences about yourself.
                      </p>
                    )}
                  </div>

                  <div className="col-span-full">
                    <div className="mt-2 flex items-center gap-x-3">
                      <img
                        className="h-10 w-10 rounded-full ring-1 ring-neutral-50 dark:ring-neutral-950"
                        src={
                          previewAvatar || `${MEDIA_URL}${formik.values.avatar}`
                        }
                        alt="avatar"
                      />

                      <label
                        htmlFor="avatar"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 
                      focus-within:outline-none"
                      >
                        <span className="rounded-md bg-white p-1.5 px-2.5 text-sm font-semibold text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-white dark:ring-neutral-700">
                          Change
                        </span>
                        <input
                          id="avatar"
                          title="avatar"
                          name="avatar"
                          type="file"
                          onChange={handleAvatarChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    {Array.isArray(formik.errors.avatar) ? (
                      // 这里可以使用 map，可能需要把 errors 的类型改为 Record<string, string[]>
                      formik.errors.avatar.map(
                        (error: string, index: number) => (
                          <ul itemType="disc">
                            <li
                              key={index}
                              className="mt-2 text-sm text-red-400 duration-300 ease-in-out"
                            >
                              {error}
                            </li>
                          </ul>
                        ),
                      )
                    ) : (
                      <p className="mt-2 text-sm text-red-400 duration-300 ease-in-out">
                        {formik.errors.avatar}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-x-6 border-t border-neutral-900/10 px-4 py-4 dark:border-white/10 sm:px-8">
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-neutral-900 dark:text-white">
                Access Tokens
              </h2>
              <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                Need an API token for scripts or testing? Generate a personal
                access token for quick access to the{' '}
                <a
                  className=" text-blue-600 hover:underline dark:text-blue-400"
                  href="#"
                >
                  Protium API
                </a>
                .
              </p>
            </div>

            <form
              onSubmit={formik.handleSubmit}
              className="bg-white shadow-sm ring-1 ring-neutral-900/5 dark:bg-neutral-900 dark:ring-white/10 sm:rounded-xl md:col-span-2"
            >
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <label
                      htmlFor="username"
                      className="mb-2 block text-sm font-medium leading-6 text-neutral-900 dark:text-white"
                    >
                      Bohrium Access Token
                    </label>
                    {isEditBohriumToken ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="flex w-full rounded-md shadow-sm ring-1 ring-inset ring-neutral-300 dark:ring-neutral-700 ">
                            <input
                              type={inputType}
                              name="bohriumToken"
                              id="bohriumToken"
                              value={bohriumToken}
                              onMouseEnter={() => setInputType('text')}
                              onMouseLeave={() => setInputType('password')}
                              onChange={(e) => setBohriumToken(e.target.value)}
                              className="form-input block flex-1 rounded border-0 bg-transparent py-2 text-neutral-900 placeholder:text-neutral-400 dark:text-white dark:placeholder:text-neutral-600 sm:text-sm"
                              placeholder="Bohrium Access Token"
                            />
                          </div>
                        </div>
                        <div className="w-fit">
                          <button
                            type="button"
                            onClick={handleBohriumTokenSubmit}
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : bohriumToken ? (
                      <div className="flex gap-2">
                        <div className="flex w-full flex-1 justify-between rounded-md px-3 py-2 text-xs shadow-sm ring-1 ring-inset ring-neutral-300 dark:bg-white/2.5 dark:ring-white/5">
                          <span className=" text-neutral-400">
                            {isBohriumAccessTokenVisible
                              ? bohriumToken
                              : formatToken(bohriumToken)}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setIsBohriumAccessTokenVisible((prev) => !prev)
                            }
                          >
                            {!isBohriumAccessTokenVisible ? (
                              <EyeIcon className="h-4 w-4 text-neutral-400 hover:dark:text-white" />
                            ) : (
                              <EyeSlashIcon className="h-4 w-4 text-neutral-400 hover:dark:text-white" />
                            )}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsEditBohriumToken(true)}
                          className="flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-white/10 dark:hover:bg-white/15"
                        >
                          <span>Update</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-neutral-400">
                        You havn't generated bohrium access token yet
                      </div>
                    )}
                  </div>

                  <div className="col-span-full flex-col items-center justify-between space-y-4 ">
                    <div className="">
                      <div className="flex justify-between">
                        <label
                          htmlFor="cover-photo"
                          className="block  text-sm font-medium leading-6 text-neutral-900  dark:text-white"
                        >
                          API Token
                        </label>

                        <button
                          type="button"
                          onClick={() => setIsDialogOpen(true)}
                          className="flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-white/10 dark:hover:bg-white/15"
                        >
                          <span>New Token</span>
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-4">
                        {accessTokens.length > 0 ? (
                          <BorderdTableLists
                            tokens={accessTokens}
                            handleDeleteToken={handleDeleteToken}
                          />
                        ) : (
                          <span className="text-xs text-neutral-400">
                            You havn't generated personal access token yet
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <GenerateNewTokenDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        handleAccessTokenSubmit={handleAccessTokenSubmit}
      />
    </>
  );
}
