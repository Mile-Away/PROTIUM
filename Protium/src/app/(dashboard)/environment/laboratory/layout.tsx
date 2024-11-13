'use client';

import LabHeader from './LabHeader';
import SpaceNavigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  params: { name: string };
}

export default function Layout({ children, params }: LayoutProps) {
  const { name } = params;

  return (
    <div className="relative mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col">
        {/* <div className="">
          <SpaceHero name={name} />
        </div> */}

        <LabHeader />

        <SpaceNavigation name={name} />

        {children}
      </div>

      {/* Background */}
      {/* <div
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
        <div className="absolute inset-x-0 bottom-0 h-px bg-gray-900/5" />
      </div> */}
    </div>
  );
}
