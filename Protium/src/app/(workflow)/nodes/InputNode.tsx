import { BasicNodeProps } from '@/@types/workflow';

import BasicNode from './BasicNode';
import NodeFormTextarea from '../formComponent/NodeFormTextarea';
import { useId } from 'react';

export default function InputNode(props: BasicNodeProps) {
  const randomId = useId();
  const { id, type, dragging, data } = props;

  return (
    <BasicNode {...props}>
      <div className="flex flex-col space-y-4 text-xs">
        {data.body.map((item, idx) => (
          <NodeFormTextarea
            key={randomId+item.id}
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
