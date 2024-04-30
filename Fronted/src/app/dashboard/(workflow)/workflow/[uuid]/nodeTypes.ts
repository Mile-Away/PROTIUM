import BasicNode from '@/app/dashboard/(workflow)/nodes/BasicNode';
import InputNode from '../../nodes/InputNode';
import SelectNode from '../../nodes/SelectNode';
import SolverNode from '../../nodes/SolverNode';

const nodeTypes = {
  solver: SolverNode,
  basic: BasicNode,
  fileSelect: SelectNode,
  structureInput: InputNode,
  // default: DefaultNode, // ReactFlow 中的默认节点类型，不能重复定义，否则发生未知错误且无提醒！！！
  // input: InputNode,  // ReactFlow 中的默认节点类型，不能重复定义，否则发生未知错误且无提醒！！！
};

export default nodeTypes;
