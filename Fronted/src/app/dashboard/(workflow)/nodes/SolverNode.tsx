import { BasicNodeProps } from '@/@types/workflow';
import {
  addHandle,
  deleteHandle,
  setNodeDataBodyContent,
} from '@/store/workflow/workflowSlice';
import { useDispatch } from 'react-redux';
import WorkflowFormSelect from '../formComponent/WorkflowFormSelect';
import BasicNode from './BasicNode';
const items = [
  {
    name: 'POTCAR - Default',
    value: 'default',
  },
  {
    name: 'POTCAR - Custom',
    value: 'custom',
  },
];

export default function SolverNode(props: BasicNodeProps) {
  const { id, type, dragging, data } = props;

  const dispathch = useDispatch();
  const onPotcarSelectedIndexChange = (index: number) => {
    dispathch(
      setNodeDataBodyContent({
        nodeId: id,
        bodyKey: 'potcarSelect',
        source: items[index].value,
      }),
    );
    if (items[index].value === 'custom') {
      dispathch(
        addHandle({
          nodeId: id,
          handle: {
            type: 'target',
            key: 'potcar',
            data_source: 'result',
            data_key: 'potcar',
          },
        }),
      );
    } else {
      dispathch(
        deleteHandle({
          nodeId: id,
          handleKey: 'potcar',
        }),
      );
    }
  };

  return (
    <BasicNode {...props}>
      <div className="flex flex-col space-y-4 text-xs">
        <WorkflowFormSelect
          items={items}
          onSelectedIndexChange={onPotcarSelectedIndexChange}
        />
        <div className="flex h-32 items-start justify-between rounded bg-black p-2">
          Outputs...
        </div>
      </div>
    </BasicNode>
  );
}
