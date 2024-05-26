'use client';
import { BASE_URL } from '@/config';
import useAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { CheckIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import AfterLogin from './AfterLogin';
import Carousel from './Carousel';

export default function Page() {
  const jwtAxios = useAxiosWithInterceptors();
  const [labelList, setLabelList] = useState<
    {
      id: number;
      name: string;
      server_num: number;
    }[]
  >([]);
  const [serverList, setServerList] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const fetchServers = async () => {
    const res = await jwtAxios.get(`${BASE_URL}/server/vs/select/`);
    const data = await res.data;
    setServerList(data);
  };

  const fetchServersByTags = async (tags: string[]) => {
    if (!Array.isArray(tags) || tags.length === 0) {
      throw new Error('Tags must be a non-empty array');
    }

    const queryParams = tags.join(',');
    const url = `${BASE_URL}/server/vs/select/?category=${encodeURIComponent(
      queryParams,
    )}`;

    try {
      const res = await jwtAxios.get(url);
      const data = await res.data;
      setServerList(data);
    } catch (error) {
      console.error('Error fetching servers by tags:', error);
      // Handle error appropriately, e.g., show a notification to the user
    }
  };

  const fetchLabels = async () => {
    const res = await jwtAxios.get(`${BASE_URL}/server/vs/category/`);
    const data = await res.data;
    setLabelList(data);
  };

  const handleSelectTags = async (tag: string) => {
    console.log('Selected tag:', tag);

    setSelectedLabels((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag);
      }
      return [...prevTags, tag];
    });
    console.log('Selected tags:', selectedLabels);
  };

  useEffect(() => {
    if (selectedLabels.length > 0) {
      fetchServersByTags(selectedLabels);
    } else {
      fetchServers();
    }
  }, [selectedLabels]);

  useEffect(() => {
    fetchLabels();
  }, []);

  return (
    <div className="mx-auto my-16 flex max-w-8xl flex-col items-center px-6 dark:bg-neutral-900 sm:my-24">
      <div className="my-8">
        <Carousel
          images={['/banner.jpg', '/hero4-horizen.png', '/banner.jpg']}
        />
      </div>
      <div className="my-8 flex w-full flex-col gap-8 sm:my-20 sm:flex-row">
        <div
          rel="sidebar"
          className=" flex h-full flex-col items-start gap-2 p-2 sm:w-64"
        >
          <h2 className="text-md mb-4 font-bold text-neutral-800 dark:text-neutral-100">
            按标签浏览
          </h2>
          {labelList.map((label) => (
            <button
              key={label.id}
              onClick={() => handleSelectTags(label.name)}
              className={clsx(
                'group h-auto w-full px-2 py-3',
                'relative inline-flex overflow-hidden rounded',
                selectedLabels.includes(label.name)
                  ? 'bg-indigo-600/80 font-semibold'
                  : 'sliderbtn',
              )}
            >
              <div className="-pl-1 z-10 inline-flex w-full items-center justify-between">
                <div className="flex items-center justify-start gap-x-2">
                  {/* <HashtagIcon className="h-3 w-3" /> */}
                  <span
                    className={clsx(
                      ' rounded-full  px-2 py-1 text-xs font-semibold ',
                      selectedLabels.includes(label.name)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/10 text-white',
                    )}
                  >
                    {label.server_num}
                  </span>
                  <span className=" line-clamp-1 text-start text-sm">
                    {label.name}
                  </span>
                </div>

                <CheckIcon
                  className={clsx(
                    'ml-auto h-4 w-4 transition-opacity ',
                    selectedLabels.includes(label.name)
                      ? 'opacity-100'
                      : 'opacity-0 ',
                  )}
                />
              </div>
            </button>
          ))}
        </div>
        <div className="flex-1">
          <AfterLogin
            recommendedSpaces={serverList}
            searchedSpaces={serverList}
          />
        </div>
      </div>
    </div>
  );
}
