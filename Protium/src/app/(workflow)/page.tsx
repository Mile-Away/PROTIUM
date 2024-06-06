'use client';
import Logo, { GrayLogo } from '@/@brand/Logo';

const Page = () => {
  return (
    <div className="m-auto hidden h-full w-full flex-col items-center justify-center xl:flex">
      <GrayLogo className="mb-12 h-24 w-24 fill-gray-400 dark:fill-gray-400" />
      <span className="select-none text-center text-gray-400 dark:text-gray-500">
        Choose a workflow to start or
        <br />
        <button
          className="mt-1 rounded-md p-2 font-semibold hover:bg-gray-50 hover:text-indigo-600 dark:hover:bg-neutral-800 dark:hover:text-indigo-400"
          onClick={() => {
            alert('Not implemented yet, please wait for the next update.');
          }}
        >
          Create a new workflow.
        </button>
      </span>
    </div>
  );
};

export default Page;
