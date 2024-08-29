'use client';

import { Button } from '@/components/Button';
import { GrAchievement } from 'react-icons/gr';

export default function Achievements() {
  return (
    <div className=" relative">
      <div className="forced-colors:outline pointer-events-none relative w-full select-none rounded-xl bg-white opacity-40 shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.20),_0px_1px_0px_0px_rgba(255,_255,_255,_0.06)_inset]">
        <form
          action="/thank-you"
          className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40"
        >
          <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            <GrAchievement className="h-5 w-5 flex-none" />
            <span className="ml-3">Achievements</span>
          </h2>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            None yet.
          </p>
          <div className="mt-6 flex">
            <Button type="submit" className="flex-none">
              Find Achievements
            </Button>
            <Button type="submit" className="ml-4 flex-none">
              Follow
            </Button>
          </div>
        </form>
      </div>
      <div className="absolute right-3 top-3 rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-sm/6 font-semibold text-indigo-700 backdrop-blur-[12px] dark:text-indigo-400">
        Coming soon
      </div>
    </div>
  );
}
