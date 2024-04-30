'use client';
import { SpaceProps } from '@/@types/space';
import { Button } from '@/components/Button';
import HoverMessage from '@/components/overlays/hover_message';
import { GitHubIcon } from '@/components/SocialIcons';
import { useDictCRUD } from '@/hooks/useCrud';
import '@/styles/markdown.css';
import '@/styles/markdown.dark.css';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import GithubReadme from './SetGithubReadme';

const Readme = ({ spaceName }: { spaceName: string }) => {
  const { fetchData, dataCRUD, isLoading, error } = useDictCRUD<SpaceProps>(
    {} as SpaceProps,
    `/server/server/${spaceName}`,
  );
  const [createReadme, setCreateReadme] = useState<boolean>(false);
  const [githubReadme, setGithubReadme] = useState<string | null>(null);

  const fetchGithubReadme = async (url: string) => {
    try {
      const response = await fetch(
        'https://api.github.com/repos' + url + '/readme',
        {
          headers: {
            Accept: 'application/vnd.github.VERSION.raw',
          },
        },
      )
        .then((response) => response.text())
        .then((data) => {
          setGithubReadme(data);
        });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    spaceName && fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className=" mt-12 flex flex-col gap-y-12">
        <div className="flex flex-col gap-y-4">
          <h2 className="text-sm font-semibold">
            Choose a way to create README.md
          </h2>
          <div className="flex gap-x-4">
            <div className="flex gap-x-4">
              <Button type="button" onClick={() => {}}>
                <PlusIcon className="h-5 w-5" />
                Create README.md
              </Button>
            </div>

            <div className=" group relative flex items-center gap-x-4">
              <Button
                type="button"
                onClick={() =>
                  fetchGithubReadme(new URL(dataCRUD.github_url).pathname)
                }
                disabled={
                  dataCRUD.github_url === undefined ||
                  dataCRUD.github_url === ''
                    ? true
                    : false
                }
              >
                <GitHubIcon className="h-5 w-5" />
                Fetch Github README.md
              </Button>

              {dataCRUD.github_url === '' && (
                <HoverMessage position="right">
                  You are not
                  <Link
                    href={'#'}
                    className="px-1 inline-flex hover:border-b hover:border-indigo-400 dark:text-indigo-400"
                  >
                    bind Github
                  </Link>
                  yet.
                </HoverMessage>
              )}
            </div>
          </div>
        </div>

        {githubReadme && <GithubReadme content={githubReadme} />}
      </div>
    );
  }
};

export default Readme;
