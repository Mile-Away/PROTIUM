'use client';
import Markdown from '@/components/docs/Markdwon';

import releases from './releases';

import { GitHubIcon } from '@/components/SocialIcons';
import { formatTime } from '@/lib/formatDate';
import { formatFileSize } from '@/lib/formatFileSize';
import '@/styles/markdown.css';
import '@/styles/markdown.dark.css';
import '@/styles/markdown.quote.css';
import { TagIcon } from '@heroicons/react/20/solid';
import { CubeIcon } from '@heroicons/react/24/outline';



export default function Page() {
  //   const [releases, setReleases] = useState<ReleaseProps[]>([]);
  const fetchReleases = async () => {
    const res = await fetch(
      'https://api.github.com/repos/deepmodeling/deepmd-kit/releases',
    );
    const data = await res.json();
    // setReleases(data);
    console.log(data);
  };

  //   useEffect(() => {
  //     fetchReleases();
  //   }, []);

  return (
    <div className="flex flex-col gap-y-16 p-4 py-8">
      {releases.map((release, idx) => (
        <div className="flex items-start ">
          <div className="flex w-56 flex-col justify-start gap-4 py-6 text-neutral-400">
            <div className=" text-xl font-semibold dark:text-neutral-200">
              {formatTime(release.created_at, '', true)}
            </div>
            <div className=' border-b dark:border-neutral-700/50 w-40 pb-2'>
              <a href={release.html_url} target="_blank" className="">
                <GitHubIcon className="h-6 w-6 hover:text-neutral-50" />
              </a>
            </div>
            <div className=" flex gap-2">
              <img
                src={release.author.avatar_url}
                alt=""
                className="h-6 w-6 rounded-full"
              />
              <a
                href={release.author.html_url}
                target="_blank"
                className=" dark:hover:text-white"
              >
                {release.author.login}
              </a>
            </div>
            <div>
              <a
                href={release.html_url}
                target="_blank"
                className="flex gap-x-2 items-center hover:text-neutral-100 dark:hover:text-white"
              >
                <TagIcon className=" h-5 w-5" />
                {release.tag_name}
              </a>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-end gap-x-8 border-b py-4 dark:border-neutral-700/50">
              <h1 className=" text-4xl font-bold">{release.name}</h1>
              {idx === 0 && (
                <div className="rounded-2xl px-2 py-1 text-xs font-semibold ring-1 dark:text-teal-500 dark:ring-teal-500 ">
                  Latest
                </div>
              )}
              {release.draft && (
                <div className=" rounded-2xl px-2 py-1 text-xs ring-1 dark:text-yellow-500 dark:ring-yellow-500 ">
                  <span className="">Draft</span>
                </div>
              )}
              {release.prerelease && (
                <div className=" rounded-2xl px-2 py-1 text-xs ring-1 dark:text-yellow-500 dark:ring-yellow-500 ">
                  <span className="">Pre-release</span>
                </div>
              )}
            </div>
            <div className="markdown">
              <Markdown content={release.body} />
            </div>
            <div className=" mt-8">
              <div className=" mb-4 flex items-center gap-x-4 text-xl font-semibold">
                <span>Assets</span>
                <div className=" w-fit items-center justify-center rounded-full px-2 py-1 text-xs dark:bg-neutral-700">
                  {release.assets.length + 2}
                </div>
              </div>
              <div className="flex flex-col gap-y-4 divide-y rounded border px-2 py-1  dark:divide-neutral-700/50 dark:border-neutral-800/80">
                {release.assets.map((asset) => (
                  <div className="flex items-center justify-between gap-x-4 pt-2 text-sm">
                    <a
                      href={asset.browser_download_url}
                      target="_blank"
                      // 悬浮添加下划线
                      className="flex gap-x-2 hover:underline dark:text-blue-500"
                    >
                      <CubeIcon className="h-5 w-5" />
                      {asset.name}
                    </a>
                    <div className="flex gap-x-12">
                      <span className=" text-neutral-400 dark:text-neutral-500">
                        {formatFileSize(asset.size)}
                      </span>
                      <span className=" text-neutral-400 dark:text-neutral-500">
                        {formatTime(asset.updated_at, '', true)}
                      </span>
                    </div>
                  </div>
                ))}
                {release.zipball_url && (
                  <div className="flex items-center justify-between gap-x-4 pt-2 text-sm">
                    <a
                      href={release.zipball_url}
                      target="_blank"
                      className="flex gap-x-2 hover:underline dark:text-blue-500"
                    >
                      <CubeIcon className="h-5 w-5" />
                      Source code (zip)
                    </a>
                  </div>
                )}
                {release.tarball_url && (
                  <div className="flex items-center justify-between gap-x-4 pt-2 text-sm">
                    <a
                      href={release.tarball_url}
                      target="_blank"
                      className="flex gap-x-2 hover:underline dark:text-blue-500"
                    >
                      <CubeIcon className="h-5 w-5" />
                      Source code (tar.gz)
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
