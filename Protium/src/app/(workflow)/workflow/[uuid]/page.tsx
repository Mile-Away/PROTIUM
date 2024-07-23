'use client';

import Loading from '@/app/loading';
import useWorkflowWebSocket from '@/services/workflowService';
import CommandPannel from './CommandPannel';
import RootReactFlow from './RootReactFlow';
import WorkflowTitleLabel from './WorkflowTitleLabel';

export default function Page({ params }: { params: { uuid: string } }) {
  const { saveWorkflow, isLoading } = useWorkflowWebSocket(params);

  const handleSaveWorkflow = () => {
    saveWorkflow();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <WorkflowTitleLabel handleSaveWorkflow={handleSaveWorkflow} />
      <div className="relative h-full w-full">
        {/* Background */}
        <svg
          className="absolute inset-x-0 top-0 -z-10 h-[calc(100vh-4rem)] w-full stroke-neutral-100 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)] dark:stroke-neutral-800"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg
            x="50%"
            y={-1}
            className="overflow-visible fill-neutral-50 dark:fill-neutral-900"
          >
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
          />
        </svg>

        {/* Canvas */}
        <RootReactFlow />

        {/* <Command Pannel /> */}
        <CommandPannel params={params} />
      </div>
    </>
  );
}
