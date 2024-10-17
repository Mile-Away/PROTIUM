import { BasicNodeProps } from '@/@types/workflow';

import { useId } from 'react';
import NodeFormDefault from '../formComponent/NodeFormDefault';
import BasicNode from './BasicNode';

export default function InputNode(props: BasicNodeProps) {
  const randomId = useId();
  const { id, type, dragging, data } = props;

  return (
    <BasicNode {...props}>
      <div className="flex flex-col space-y-4 text-xs">
        {data.body.map((item, idx) => (
          <NodeFormDefault
            key={randomId + item.id}
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
