import { BasicNodeProps } from '@/@types/workflow';
import NodeFormInput from '../formComponent/NodeFormTextarea';
import BasicNode from './BasicNode';

export default function InputNode(props: BasicNodeProps) {
  const { id, type, dragging, data } = props;

  return (
    <BasicNode {...props}>
      <div className="flex flex-col space-y-4 text-xs">
        {data.body.map((item, idx) => (
          <NodeFormInput
            key={item.id}
            nodeId={id}
            bodyItem={item}
            idx={idx}
            {...props}
          />
        ))}
      </div>
    </BasicNode>
  );
}
