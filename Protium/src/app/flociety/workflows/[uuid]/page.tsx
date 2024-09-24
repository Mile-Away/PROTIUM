'use client';
import useWorkflowWebSocket from '@/services/workflowService';
import TempReactFlow from './TempReactFlow';

export default function Page({ params }: { params: { uuid: string } }) {
  //   const [workflow, setWorkflow] = useState<WorkflowProps | null>(null);
  const {} = useWorkflowWebSocket(params);

  return (
    <>
      <div className=" absolute left-32 z-30 h-[calc(100vh)] w-1/3 bg-gradient-to-r from-neutral-900  to-transparent"></div>
      <div className=" absolute left-8 top-16 z-40 mt-16 flex w-1/3 flex-col gap-16">
        <h1 className="font-display text-4xl font-semibold text-indigo-400 ">
          Workflow
        </h1>
        <div>
          <p className="text-white">
            Find template you need to build your workflow
          </p>
        </div>
      </div>
      <TempReactFlow />;
    </>
  );
}
