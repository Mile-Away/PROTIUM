import { BasicNodeProps } from '@/@types/workflow';
import WorkflowFormSelect from '../formComponent/WorkflowFormSelect';
import BasicNode from './BasicNode';

const items = [
  {
    name: 'POSCAR Single',
  },
  {
    name: 'POSCAR Multiple',
  },
  {
    name: 'Batch',
  },
];

export default function SolverNode(props: BasicNodeProps) {
  const { id, type, dragging, data } = props;

  const onSelectedIndexChange = (index: number) => {
    console.log(index);
  };

  return (
    <BasicNode {...props}>
      <div className="flex flex-col space-y-4 text-xs">
        <WorkflowFormSelect
          items={items}
          onSelectedIndexChange={onSelectedIndexChange}
        />
        <WorkflowFormSelect
          items={items}
          onSelectedIndexChange={onSelectedIndexChange}
        />
        <div className="flex h-32 items-start justify-between rounded bg-black p-2">
          Outputs...
        </div>
      </div>
    </BasicNode>
  );
}
