'use client';
import { SpaceProps } from '@/@types/space';
import Article from '@/components/Article';
import { Button } from '@/components/Button';
import HoverMessage from '@/components/overlays/hover_message';
import { GitHubIcon } from '@/components/SocialIcons';
import { BASE_URL, PrimarySite } from '@/config';
import useAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { useDictCRUD } from '@/hooks/useCrud';
import '@/styles/markdown.css';
import '@/styles/markdown.dark.css';
import { PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Readme = ({ spaceName }: { spaceName: string }) => {
  const { fetchData, dataCRUD, isLoading, error } = useDictCRUD<SpaceProps>(
    {} as SpaceProps,
    `/server/server/${spaceName}`,
  );
  const [createReadme, setCreateReadme] = useState<boolean>(false);

  const jwtAxios = useAxiosWithInterceptors();
  const router = useRouter();

  // TODO: 后续把抓取改到后端完成，用户可能获取不到
  const fetchGithubReadme = async (url: string) => {
    try {
      const response = await fetch(
        'https://api.github.com/repos' + url + '/readme',
        {
          headers: {
            Accept: 'application/vnd.github.VERSION.raw',
          },
        },
      );
      const data = await response.text();

      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    spaceName && fetchData();
  }, []);

  const handlebindReadme = (readmeContent?: string) => {
    jwtAxios
      .post(`${BASE_URL}/document/vs/document/`, {
        title: `${spaceName} README.md`,
        content: readmeContent || null,
      })
      .then((res) => {
        if (res.data) {
          // 绑定文档为当前文档的 Readme
          jwtAxios
            .put(`/server/server/${spaceName}/`, {
              readme: res.data.uuid,
            })
            .then((res) => {
              // 打开编辑页面
              window.open(
                `${PrimarySite}/dashboard/manuscript/edit/${res.data.readme.uuid}/`,
              );
            });
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const handleCreateReadme = () => {
    handlebindReadme();
  };

  const handleFetchGithubReadme = async () => {
    const githubReadme = await fetchGithubReadme(
      new URL(dataCRUD.github_url).pathname,
    );

    if (githubReadme) {
      handlebindReadme(githubReadme);
    }
  };
  const handleEditReadme = (readmeUUid: string) => {
    window.open(`${PrimarySite}/dashboard/manuscript/edit/${readmeUUid}/`);
  };

  const hasMarkdown =
    dataCRUD?.readme === undefined || dataCRUD?.readme === null ? false : true;

  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="mt-12 flex flex-col gap-y-12">
        <div className="flex flex-col gap-y-4">
          {hasMarkdown ? (
            <div className="mb-8">
              <Article key={dataCRUD.readme.uuid} article={dataCRUD.readme} />
            </div>
          ) : (
            <h2 className="text-sm font-semibold">
              Choose a way to create README.md
            </h2>
          )}
          <div className="flex gap-x-4">
            <div className="flex gap-x-4">
              {hasMarkdown ? (
                <Button
                  type="button"
                  onClick={() => handleEditReadme(dataCRUD.readme.uuid)}
                >
                  <PencilSquareIcon className="h-5 w-5" />
                  Edit README.md
                </Button>
              ) : (
                <Button type="button" onClick={handleCreateReadme}>
                  <PlusIcon className="h-5 w-5" />
                  Create README.md
                </Button>
              )}
            </div>

            <div className=" group relative flex items-center gap-x-4">
              <Button
                type="button"
                onClick={handleFetchGithubReadme}
                disabled={
                  dataCRUD.github_url === undefined ||
                  dataCRUD.github_url === null ||
                  dataCRUD.github_url === ''
                    ? true
                    : false
                }
              >
                <GitHubIcon className="h-5 w-5" />
                Fetch Github README.md {hasMarkdown && '｜Overwrite!'}
              </Button>

              {dataCRUD.github_url === '' && (
                <HoverMessage position="right">
                  You are not
                  <Link
                    href={'#'}
                    className="inline-flex px-1 hover:border-b hover:border-indigo-400 dark:text-indigo-400"
                  >
                    bind Github
                  </Link>
                  yet.
                </HoverMessage>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Readme;
