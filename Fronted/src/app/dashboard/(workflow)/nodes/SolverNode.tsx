import { BasicNodeProps } from '@/@types/workflow';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import BasicNode from './BasicNode';

export default function SolverNode(props: BasicNodeProps) {
  const { id, type, dragging, data } = props;

  return (
    <BasicNode {...props}>
      <div className="mt-8 flex flex-col space-y-4 text-xs">
        <div className="flex h-6 w-full items-center justify-between rounded px-2 py-2">
          <div className=" -m-1 cursor-pointer rounded p-1 hover:bg-neutral-600/40">
            <ChevronLeftIcon className="h-4 w-4" />
          </div>
          <div className="flex  flex-1 items-center justify-center">Single</div>
          <div className=" -m-1 cursor-pointer rounded p-1 hover:bg-neutral-600/40">
            <ChevronRightIcon className="h-4 w-4" />
          </div>
        </div>
        <div className="flex h-32 items-start justify-between rounded bg-black p-2">
          Outputs...
        </div>
      </div>
    </BasicNode>
  );
}
