'use client';

import { CursorArrowRippleIcon } from '@heroicons/react/24/outline';
import { PuzzlePieceIcon } from '@heroicons/react/24/solid';
import { CiBoxList } from 'react-icons/ci';
import Example from './Tabs';

export default function Page() {
  return (
    <div className="flex flex-col space-y-4 px-8 py-8">
      {/* <div className="flex items-center">
        <PuzzlePieceIcon className="mr-2 h-6 w-6" />
        <h2 className=" font-display text-xl font-bold">
          Environment Configuration
        </h2>
      </div> */}



      <Example />
    </div>
  );
}
