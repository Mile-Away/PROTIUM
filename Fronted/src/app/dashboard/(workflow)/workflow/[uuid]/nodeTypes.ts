import BasicNode from '@/app/dashboard/(workflow)/nodes/BasicNode';
import { type Node } from 'reactflow';
import InputNode from '../../nodes/InputNode';
import SelectNode from '../../nodes/SelectNode';
import SolverNode from '../../nodes/SolverNode';

export const nodeColors = (node: Node<any>) => {
  switch (node.type) {
    case 'Select':
      return '#FFCC0080';
    case 'Input':
      return '#FFCCFF80';
    case 'Solver':
      return 'rgba(129,140, 248,0.5)';
    default:
      return 'rgba(129,140, 248,0.2)';
  }
};

const nodeTypes = {
  Solver: SolverNode,
  Basic: BasicNode,
  Select: SelectNode,
  Input: InputNode,
  // default: DefaultNode, // ReactFlow 中的默认节点类型，不能重复定义，否则发生未知错误且无提醒！！！
  // input: InputNode,  // ReactFlow 中的默认节点类型，不能重复定义，否则发生未知错误且无提醒！！！
};

export default nodeTypes;
