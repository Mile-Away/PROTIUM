import { SpaceProps } from '@/@types/space';

import { BASE_URL, PrimarySite } from '@/config';

import axios from 'axios';
import type { Metadata } from 'next';
import SpaceHero from './SpaceHero';
import SpaceNavigation from './SpaceNavigation';

interface LayoutProps {
  children: React.ReactNode;
  params: { name: string };
}

// export const metadata = {
//   title: "DeePMD-kit",
// };

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  // read route params
  const name = params.name;

  // fetch data
  const posts: SpaceProps = await axios.get(BASE_URL + `/server/vs/select/?by_server_name=${name}`)
    .then((res) => res.data.pop());

  // // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || [];

  return {
    metadataBase: new URL(PrimarySite),
    title: posts.name,
    description: posts.description,
    // openGraph: {
    //   images: [posts.banner],
    // },
  };
}

export async function generateStaticParams() {
  const posts = await axios
    .get(BASE_URL + '/server/vs/select/')
    .then((res) => res.data);

  return posts.map((post: SpaceProps) => ({
    name: post.name,
  }));
}

export default function Layout({ children, params }: LayoutProps) {
  const { name } = params;

  return (
    <div className="relative mx-auto max-w-8xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 2xl:max-w-screen-2xl">
      <div className="flex flex-col">
        <div className="">
          <SpaceHero name={name} />
        </div>

        <SpaceNavigation name={name} />

        {children}
      </div>

      {/* Background */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-16 top-full -mt-0 transform-gpu opacity-50 blur-3xl xl:left-1/2 xl:-ml-80">
          <div
            className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#FF80B5] to-[#9089FC]"
            style={{
              clipPath:
                'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)',
            }}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-neutral-900/5" />
      </div>
    </div>
  );
}
