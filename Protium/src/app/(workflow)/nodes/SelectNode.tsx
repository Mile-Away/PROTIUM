import { BasicNodeProps } from '@/@types/workflow';
import { setNodeDataBodyContent } from '@/store/workflow/workflowSlice';
import { useDispatch } from 'react-redux';
import WorkflowFormSelect from '../formComponent/WorkflowFormSelect';
import BasicNode from './BasicNode';

const items = [
  {
    name: 'GGA（Generalized Gradient Approximation）',
  },
  {
    name: 'LDA（Local Density Approximation）',
  },
  {
    name: 'PAW（Projector Augmented Wave）',
  },
];

export default function SelectNode(props: BasicNodeProps) {
  const { id, type, dragging, data } = props;

  const dispathch = useDispatch();
  const onSelectedIndexChange = (index: number) => {
    dispathch(
      setNodeDataBodyContent({
        nodeId: id,
        bodyKey: data.body[0].key,
        source: items[index].name,
      }),
    );
  };

  return (
    <BasicNode {...props}>
      <WorkflowFormSelect
        items={items}
        onSelectedIndexChange={onSelectedIndexChange}
      />
    </BasicNode>
  );
}
