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

interface ReleaseProps {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: {
    url: string;
    id: number;
    node_id: string;
    name: string;
    label: string;
    uploader: {
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      followers_url: string;
      following_url: string;
      gists_url: string;
      starred_url: string;
      subscriptions_url: string;
      organizations_url: string;
      repos_url: string;
      events_url: string;
      received_events_url: string;
      type: string;
      site_admin: boolean;
    };
    content_type: string;
    state: string;
    size: number;
    download_count: number;
    created_at: string;
    updated_at: string;
    browser_download_url: string;
  }[];
  tarball_url: string;
  zipball_url: string;
  body: string;
  reactions: {
    url: string;
    total_count: number;
  };
  mentions_count: number;
}

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
          <div className="flex w-56 flex-col justify-start gap-4 py-4 text-neutral-400">
            <div className=" text-xl font-semibold dark:text-neutral-200">
              {formatTime(release.created_at, '', true)}
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
                className="flex gap-x-2 hover:text-neutral-100 dark:hover:text-white"
              >
                <TagIcon className=" h-5 w-5" />
                {release.tag_name}
              </a>
            </div>
            <div>
              <a href={release.html_url} target="_blank" className="">
                <GitHubIcon className="h-6 w-6 hover:text-neutral-50" />
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

const ls = {
  url: 'https://api.github.com/repos/deepmodeling/deepmd-kit/releases/150066357',
  assets_url:
    'https://api.github.com/repos/deepmodeling/deepmd-kit/releases/150066357/assets',
  upload_url:
    'https://uploads.github.com/repos/deepmodeling/deepmd-kit/releases/150066357/assets{?name,label}',
  html_url: 'https://github.com/deepmodeling/deepmd-kit/releases/tag/v2.2.10',
  id: 150066357,
  author: {
    login: 'njzjz',
    id: 9496702,
    node_id: 'MDQ6VXNlcjk0OTY3MDI=',
    avatar_url: 'https://avatars.githubusercontent.com/u/9496702?v=4',
    gravatar_id: '',
    url: 'https://api.github.com/users/njzjz',
    html_url: 'https://github.com/njzjz',
    followers_url: 'https://api.github.com/users/njzjz/followers',
    following_url: 'https://api.github.com/users/njzjz/following{/other_user}',
    gists_url: 'https://api.github.com/users/njzjz/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/njzjz/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/njzjz/subscriptions',
    organizations_url: 'https://api.github.com/users/njzjz/orgs',
    repos_url: 'https://api.github.com/users/njzjz/repos',
    events_url: 'https://api.github.com/users/njzjz/events{/privacy}',
    received_events_url: 'https://api.github.com/users/njzjz/received_events',
    type: 'User',
    site_admin: false,
  },
  node_id: 'RE_kwDOBsuYsc4I8dS1',
  tag_name: 'v2.2.10',
  target_commitish: 'r2',
  name: 'v2.2.10',
  draft: false,
  prerelease: false,
  created_at: '2024-04-06T18:46:23Z',
  published_at: '2024-04-06T19:28:14Z',
  assets: [
    {
      url: 'https://api.github.com/repos/deepmodeling/deepmd-kit/releases/assets/160679304',
      id: 160679304,
      node_id: 'RA_kwDOBsuYsc4Jk8WI',
      name: 'libdeepmd_c_cu11.tar.gz',
      label: '',
      uploader: {
        login: 'github-actions[bot]',
        id: 41898282,
        node_id: 'MDM6Qm90NDE4OTgyODI=',
        avatar_url: 'https://avatars.githubusercontent.com/in/15368?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/github-actions%5Bbot%5D',
        html_url: 'https://github.com/apps/github-actions',
        followers_url:
          'https://api.github.com/users/github-actions%5Bbot%5D/followers',
        following_url:
          'https://api.github.com/users/github-actions%5Bbot%5D/following{/other_user}',
        gists_url:
          'https://api.github.com/users/github-actions%5Bbot%5D/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/github-actions%5Bbot%5D/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/github-actions%5Bbot%5D/subscriptions',
        organizations_url:
          'https://api.github.com/users/github-actions%5Bbot%5D/orgs',
        repos_url: 'https://api.github.com/users/github-actions%5Bbot%5D/repos',
        events_url:
          'https://api.github.com/users/github-actions%5Bbot%5D/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/github-actions%5Bbot%5D/received_events',
        type: 'Bot',
        site_admin: false,
      },
      content_type: 'application/gzip',
      state: 'uploaded',
      size: 424604235,
      download_count: 22,
      created_at: '2024-04-06T19:34:57Z',
      updated_at: '2024-04-06T19:35:11Z',
      browser_download_url:
        'https://github.com/deepmodeling/deepmd-kit/releases/download/v2.2.10/libdeepmd_c_cu11.tar.gz',
    },
    {
      url: 'https://api.github.com/repos/deepmodeling/deepmd-kit/releases/assets/160679323',
      id: 160679323,
      node_id: 'RA_kwDOBsuYsc4Jk8Wb',
      name: 'libdeepmd_c.tar.gz',
      label: '',
      uploader: {
        login: 'github-actions[bot]',
        id: 41898282,
        node_id: 'MDM6Qm90NDE4OTgyODI=',
        avatar_url: 'https://avatars.githubusercontent.com/in/15368?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/github-actions%5Bbot%5D',
        html_url: 'https://github.com/apps/github-actions',
        followers_url:
          'https://api.github.com/users/github-actions%5Bbot%5D/followers',
        following_url:
          'https://api.github.com/users/github-actions%5Bbot%5D/following{/other_user}',
        gists_url:
          'https://api.github.com/users/github-actions%5Bbot%5D/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/github-actions%5Bbot%5D/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/github-actions%5Bbot%5D/subscriptions',
        organizations_url:
          'https://api.github.com/users/github-actions%5Bbot%5D/orgs',
        repos_url: 'https://api.github.com/users/github-actions%5Bbot%5D/repos',
        events_url:
          'https://api.github.com/users/github-actions%5Bbot%5D/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/github-actions%5Bbot%5D/received_events',
        type: 'Bot',
        site_admin: false,
      },
      content_type: 'application/gzip',
      state: 'uploaded',
      size: 487885328,
      download_count: 76,
      created_at: '2024-04-06T19:35:21Z',
      updated_at: '2024-04-06T19:35:28Z',
      browser_download_url:
        'https://github.com/deepmodeling/deepmd-kit/releases/download/v2.2.10/libdeepmd_c.tar.gz',
    },
    {
      url: 'https://api.github.com/repos/deepmodeling/deepmd-kit/releases/assets/160757275',
      id: 160757275,
      node_id: 'RA_kwDOBsuYsc4JlPYb',
      name: 'deepmd-kit-2.2.10-cpu-Linux-x86_64.sh',
      label: '',
      uploader: {
        login: 'njzjz',
        id: 9496702,
        node_id: 'MDQ6VXNlcjk0OTY3MDI=',
        avatar_url: 'https://avatars.githubusercontent.com/u/9496702?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/njzjz',
        html_url: 'https://github.com/njzjz',
        followers_url: 'https://api.github.com/users/njzjz/followers',
        following_url:
          'https://api.github.com/users/njzjz/following{/other_user}',
        gists_url: 'https://api.github.com/users/njzjz/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/njzjz/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/njzjz/subscriptions',
        organizations_url: 'https://api.github.com/users/njzjz/orgs',
        repos_url: 'https://api.github.com/users/njzjz/repos',
        events_url: 'https://api.github.com/users/njzjz/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/njzjz/received_events',
        type: 'User',
        site_admin: false,
      },
      content_type: 'application/x-sh',
      state: 'uploaded',
      size: 809599337,
      download_count: 180,
      created_at: '2024-04-07T09:18:33Z',
      updated_at: '2024-04-07T09:18:47Z',
      browser_download_url:
        'https://github.com/deepmodeling/deepmd-kit/releases/download/v2.2.10/deepmd-kit-2.2.10-cpu-Linux-x86_64.sh',
    },
    {
      url: 'https://api.github.com/repos/deepmodeling/deepmd-kit/releases/assets/160757357',
      id: 160757357,
      node_id: 'RA_kwDOBsuYsc4JlPZt',
      name: 'deepmd-kit-2.2.10-cuda118-Linux-x86_64.sh.1',
      label: '',
      uploader: {
        login: 'njzjz',
        id: 9496702,
        node_id: 'MDQ6VXNlcjk0OTY3MDI=',
        avatar_url: 'https://avatars.githubusercontent.com/u/9496702?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/njzjz',
        html_url: 'https://github.com/njzjz',
        followers_url: 'https://api.github.com/users/njzjz/followers',
        following_url:
          'https://api.github.com/users/njzjz/following{/other_user}',
        gists_url: 'https://api.github.com/users/njzjz/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/njzjz/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/njzjz/subscriptions',
        organizations_url: 'https://api.github.com/users/njzjz/orgs',
        repos_url: 'https://api.github.com/users/njzjz/repos',
        events_url: 'https://api.github.com/users/njzjz/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/njzjz/received_events',
        type: 'User',
        site_admin: false,
      },
      content_type: 'application/octet-stream',
      state: 'uploaded',
      size: 1261191354,
      download_count: 132,
      created_at: '2024-04-07T09:19:20Z',
      updated_at: '2024-04-07T09:19:46Z',
      browser_download_url:
        'https://github.com/deepmodeling/deepmd-kit/releases/download/v2.2.10/deepmd-kit-2.2.10-cuda118-Linux-x86_64.sh.1',
    },
    {
      url: 'https://api.github.com/repos/deepmodeling/deepmd-kit/releases/assets/160757359',
      id: 160757359,
      node_id: 'RA_kwDOBsuYsc4JlPZv',
      name: 'deepmd-kit-2.2.10-cuda118-Linux-x86_64.sh.0',
      label: '',
      uploader: {
        login: 'njzjz',
        id: 9496702,
        node_id: 'MDQ6VXNlcjk0OTY3MDI=',
        avatar_url: 'https://avatars.githubusercontent.com/u/9496702?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/njzjz',
        html_url: 'https://github.com/njzjz',
        followers_url: 'https://api.github.com/users/njzjz/followers',
        following_url:
          'https://api.github.com/users/njzjz/following{/other_user}',
        gists_url: 'https://api.github.com/users/njzjz/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/njzjz/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/njzjz/subscriptions',
        organizations_url: 'https://api.github.com/users/njzjz/orgs',
        repos_url: 'https://api.github.com/users/njzjz/repos',
        events_url: 'https://api.github.com/users/njzjz/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/njzjz/received_events',
        type: 'User',
        site_admin: false,
      },
      content_type: 'application/octet-stream',
      state: 'uploaded',
      size: 1261191353,
      download_count: 146,
      created_at: '2024-04-07T09:19:21Z',
      updated_at: '2024-04-07T09:19:49Z',
      browser_download_url:
        'https://github.com/deepmodeling/deepmd-kit/releases/download/v2.2.10/deepmd-kit-2.2.10-cuda118-Linux-x86_64.sh.0',
    },
    {
      url: 'https://api.github.com/repos/deepmodeling/deepmd-kit/releases/assets/160757360',
      id: 160757360,
      node_id: 'RA_kwDOBsuYsc4JlPZw',
      name: 'deepmd-kit-2.2.10-cuda124-Linux-x86_64.sh.0',
      label: '',
      uploader: {
        login: 'njzjz',
        id: 9496702,
        node_id: 'MDQ6VXNlcjk0OTY3MDI=',
        avatar_url: 'https://avatars.githubusercontent.com/u/9496702?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/njzjz',
        html_url: 'https://github.com/njzjz',
        followers_url: 'https://api.github.com/users/njzjz/followers',
        following_url:
          'https://api.github.com/users/njzjz/following{/other_user}',
        gists_url: 'https://api.github.com/users/njzjz/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/njzjz/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/njzjz/subscriptions',
        organizations_url: 'https://api.github.com/users/njzjz/orgs',
        repos_url: 'https://api.github.com/users/njzjz/repos',
        events_url: 'https://api.github.com/users/njzjz/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/njzjz/received_events',
        type: 'User',
        site_admin: false,
      },
      content_type: 'application/octet-stream',
      state: 'uploaded',
      size: 1147962553,
      download_count: 71,
      created_at: '2024-04-07T09:19:22Z',
      updated_at: '2024-04-07T09:19:43Z',
      browser_download_url:
        'https://github.com/deepmodeling/deepmd-kit/releases/download/v2.2.10/deepmd-kit-2.2.10-cuda124-Linux-x86_64.sh.0',
    },
    {
      url: 'https://api.github.com/repos/deepmodeling/deepmd-kit/releases/assets/160757361',
      id: 160757361,
      node_id: 'RA_kwDOBsuYsc4JlPZx',
      name: 'deepmd-kit-2.2.10-cuda124-Linux-x86_64.sh.1',
      label: '',
      uploader: {
        login: 'njzjz',
        id: 9496702,
        node_id: 'MDQ6VXNlcjk0OTY3MDI=',
        avatar_url: 'https://avatars.githubusercontent.com/u/9496702?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/njzjz',
        html_url: 'https://github.com/njzjz',
        followers_url: 'https://api.github.com/users/njzjz/followers',
        following_url:
          'https://api.github.com/users/njzjz/following{/other_user}',
        gists_url: 'https://api.github.com/users/njzjz/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/njzjz/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/njzjz/subscriptions',
        organizations_url: 'https://api.github.com/users/njzjz/orgs',
        repos_url: 'https://api.github.com/users/njzjz/repos',
        events_url: 'https://api.github.com/users/njzjz/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/njzjz/received_events',
        type: 'User',
        site_admin: false,
      },
      content_type: 'application/octet-stream',
      state: 'uploaded',
      size: 1147962554,
      download_count: 63,
      created_at: '2024-04-07T09:19:23Z',
      updated_at: '2024-04-07T09:19:49Z',
      browser_download_url:
        'https://github.com/deepmodeling/deepmd-kit/releases/download/v2.2.10/deepmd-kit-2.2.10-cuda124-Linux-x86_64.sh.1',
    },
  ],
  tarball_url:
    'https://api.github.com/repos/deepmodeling/deepmd-kit/tarball/v2.2.10',
  zipball_url:
    'https://api.github.com/repos/deepmodeling/deepmd-kit/zipball/v2.2.10',
  body: "<!-- Release notes generated using configuration in .github/release.yml at r2 -->\r\n\r\n## What's Changed\r\n\r\n### New features\r\n\r\n* Add `max_ckpt_keep` for trainer by @iProzd in https://github.com/deepmodeling/deepmd-kit/pull/3441\r\n* feat: model devi C/C++ API without nlist by @robinzyb in https://github.com/deepmodeling/deepmd-kit/pull/3647\r\n\r\n### Enhancement\r\n* Neighbor stat is 80x accelerated by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3275\r\n* support checkpoint path (instead of directory) in dp freeze by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3254\r\n* add fparam/aparam support for finetune by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3313\r\n* chore(build): move static part of dynamic metadata to pyproject.toml by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3618\r\n* test: add LAMMPS MPI tests by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3572\r\n* support Python 3.12 by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3343\r\n\r\n### Documentation\r\n* docs: rewrite README; deprecate manually written TOC by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3179\r\n* docs: apply type_one_side=True to `se_a` and `se_r` by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3364\r\n* docs: add deprecation notice for the official conda channel and more conda docs by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3462\r\n* docs: Replace quick_start.ipynb with a new version.  by @Mancn-Xu in https://github.com/deepmodeling/deepmd-kit/pull/3567\r\n* issue template: change TF version to backend version by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3244\r\n* chore: remove incorrect memset TODOs by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3600\r\n\r\n### Bugfix\r\n* c: change the required shape of electric field to nloc * 3 by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3237\r\n* Fix LAMMPS plugin symlink path on macOS platform by @chazeon in https://github.com/deepmodeling/deepmd-kit/pull/3473\r\n* fix_dplr.cpp delete redundant setup by @shiruosong in https://github.com/deepmodeling/deepmd-kit/pull/3344\r\n* fix_dplr.cpp set atom->image when pre_force by @shiruosong in https://github.com/deepmodeling/deepmd-kit/pull/3345\r\n* fix: fix type hint of sel by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3624\r\n* fix: make `se_atten_v2` masking smooth when davg is not zero by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3632\r\n* fix: do not install tf-keras for cu11 by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3444\r\n\r\n### CI/CD\r\n\r\n* detect version in advance before building deepmd-kit-cu11 by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3172\r\n* fix deepmd-kit-cu11 again by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3403\r\n* ban print by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3415\r\n* ci: add linter for markdown, yaml, CSS by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3574\r\n* fix AlmaLinux GPG key error by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3326\r\n* ci: reduce ASLR entropy by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3461\r\n\r\n### Dependency update\r\n* bump LAMMPS to stable_2Aug2023_update3 by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3399\r\n* build(deps): bump codecov/codecov-action from 3 to 4 by @dependabot in https://github.com/deepmodeling/deepmd-kit/pull/3231\r\n* build(deps): bump pypa/cibuildwheel from 2.16 to 2.17 by @dependabot in https://github.com/deepmodeling/deepmd-kit/pull/3487\r\n* pin nvidia-cudnn-cu{11,12} to <9 by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3610\r\n* pin docker actions to major versions by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3238\r\n* build(deps): bump the npm_and_yarn group across 1 directories with 1 update by @dependabot in https://github.com/deepmodeling/deepmd-kit/pull/3312\r\n* bump scikit-build-core to 0.8 by @njzjz in https://github.com/deepmodeling/deepmd-kit/pull/3369\r\n* build(deps): bump softprops/action-gh-release from 1 to 2 by @dependabot in https://github.com/deepmodeling/deepmd-kit/pull/3446\r\n\r\n## New Contributors\r\n\r\n* @shiruosong made their first contribution in https://github.com/deepmodeling/deepmd-kit/pull/3344\r\n* @robinzyb made their first contribution in https://github.com/deepmodeling/deepmd-kit/pull/3647\r\n* @Mancn-Xu made their first contribution in https://github.com/deepmodeling/deepmd-kit/pull/3567\r\n\r\n**Full Changelog**: https://github.com/deepmodeling/deepmd-kit/compare/v2.2.9...v2.2.10",
  reactions: {
    url: 'https://api.github.com/repos/deepmodeling/deepmd-kit/releases/150066357/reactions',
    total_count: 4,
    '+1': 4,
    '-1': 0,
    laugh: 0,
    hooray: 0,
    confused: 0,
    heart: 0,
    rocket: 0,
    eyes: 0,
  },
  mentions_count: 7,
};
