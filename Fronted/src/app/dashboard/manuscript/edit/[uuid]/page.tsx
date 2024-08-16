'use client';
import { WarningAlert } from '@/components/alert/Warning';
import PublishButton from '@/components/docs/PublishButton';
import VditorMarkdown from '@/components/vditor/Vditor';
import createAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { useDictCRUD } from '@/hooks/useCrud';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import SuccessAlert from '../../../../../components/notification/SuccessAlert';
import Loading from './loading';

interface DocumentProps {
  title: string;
  content: string;
  publish: boolean;
}

const Page = ({ params }: { params: { uuid: string } }) => {
  const router = useRouter();
  const pk = params.uuid;
  const jwtAxios = createAxiosWithInterceptors();

  const { fetchData, dataCRUD, error, isLoading } = useDictCRUD<DocumentProps>(
    {} as DocumentProps,
    `/document/detail/${pk}/`,
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saveTime, setSaveTime] = useState<Date | null>(null);

  useEffect(() => {
    if (pk) {
      fetchData();
    } else {
      alert('Wrong Request');
      router.replace('/dashboard/manuscript/');
    }
  }, []);

  useEffect(() => {
    if (error) {
      alert('Wrong Request ID');
      router.replace('/dashboard/manuscript/');
    }
  }, [error]);

  const putData = async (data: any) => {
    try {
      await jwtAxios.put(`/document/detail/${pk}/`, data);
      router.replace('/dashboard/manuscript/?updated=true');
    } catch (error: any) {
      console.error(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '' || null,
      publish: true,
    },

    validate: (values) => {
      const errors: Partial<typeof values> = {};
      if (!values.title) {
        errors.title = 'Please Enter Title';
      }
      return errors;
    },

    // 已修复 bug，如果编辑的时候没有进行任何更改就保存，就会保存空内容，把原先内容都删除了。
    onSubmit: async (values) => {
      const { content, title, publish } = values;
      const data = { content, title, publish };
      if (content) {
        await putData(data);
      } else {
        if (!content && dataCRUD.content) {
          // 抓取到了数据，即使点进去编辑，没有任何更改，就不保存，直接返回。
          // 如果修改了标题，就保存标题，不修改内容
          await jwtAxios.put(`/document/detail/${pk}/`, {
            title: formik.values.title,
            publish: publish,
          });

          router.push('/dashboard/manuscript/');
        } else {
          formik.errors.content = 'Please Enter Content';
        }
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue('title', dataCRUD.title);
  }, [dataCRUD]);

  // handleContentChange 是在页面加载的时候被初始化的，这个时候 formik.values.title 还是空的，
  // 所以即使保存的时候，title 也是空的。
  const handleContentChange = (value: string) => {
    formik.setFieldValue('content', value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true);

        await jwtAxios.put(`/document/detail/${pk}/`, {
          content: value,
          publish: false,
        });

        setSaveTime(new Date());
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handlePublish = async (isPublish: boolean) => {
    formik.setFieldValue('publish', isPublish);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="relative">
      <div>
        <div className="sticky top-16 z-10 bg-white backdrop-blur-xl dark:bg-neutral-900/80">
          {formik.values.content && saveTime && (
            <SuccessAlert
              className="z-10 rounded-md bg-green-50 p-4 duration-300 animate-in fade-in dark:bg-green-950"
              isLoading={loading}
            >
              <p className="text-sm font-medium text-green-800 dark:text-green-500">
                Successfully autosaved at {saveTime.toLocaleTimeString()}
                <span className="ml-4 text-xs">{'Content only'}</span>
              </p>
            </SuccessAlert>
          )}

          {!!formik.touched.title && !!formik.errors.title && (
            <WarningAlert title={formik.errors.title} />
          )}
          {!!formik.touched.content && !!formik.errors.content && (
            <WarningAlert title={formik.errors.content} />
          )}
          <div className="flex items-center justify-between">
            <label htmlFor="title" className="sr-only">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              className="w-full touch-none bg-transparent py-4 pl-4 text-left text-2xl 
              font-medium backdrop-blur-none 
                 placeholder:text-gray-400 focus:outline-none sm:pl-0 sm:text-center"
              placeholder="Title"
            />
            <div className="mx-4 sm:fixed sm:right-0">
              <PublishButton
                onChange={handlePublish}
                obSubmit={formik.handleSubmit}
              />
            </div>
          </div>
        </div>
        <label htmlFor="description" className="sr-only">
          Description
        </label>

        {dataCRUD.content !== undefined ? (
          <div>
            <VditorMarkdown
              onChange={handleContentChange}
              TYPE="edit"
              initialContent={dataCRUD.content}
              documentUUID={pk}
            />
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </form>
  );
};

export default Page;
