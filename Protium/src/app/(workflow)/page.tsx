'use client';
import { GrayLogo } from '@/@brand/Logo';
import { RootReducerProps } from '@/app/store';
import { BASE_URL } from '@/config';
import createAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { setWorkflowList } from '@/store/workflow/workflowSlice';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

const Page = () => {
  const jwtAxios = createAxiosWithInterceptors();

  const router = useRouter();

  const dispatch = useDispatch();

  const { workflowList } = useSelector(
    (state: RootReducerProps) => state.workflow,
  );

  const handleCreateWorkflow = () => {
    createWorkflows();
  };

  const createWorkflows = async () => {
    try {
      const res = await jwtAxios.post(`${BASE_URL}/workflow/vs/workflow/`, {
        name: 'Untitled',
      });
      dispatch(setWorkflowList([...workflowList, res.data]));
      router.push(`/workflow/${res.data.uuid}`);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="m-auto hidden h-full w-full flex-col items-center justify-center xl:flex">
      <GrayLogo className="mb-12 h-24 w-24 fill-gray-400 dark:fill-gray-400" />
      <span className="select-none text-center text-gray-400 dark:text-gray-500">
        Choose a workflow to start or
        <br />
        <button
          className="mt-1 rounded-md p-2 font-semibold hover:bg-gray-50 hover:text-indigo-600 dark:hover:bg-neutral-800 dark:hover:text-indigo-400"
          onClick={handleCreateWorkflow}
        >
          Create a new workflow.
        </button>
      </span>
    </div>
  );
};

export default Page;
