import nodeTypes from '@/app/(dashboard)/workflow/nodes/nodeTypes';
import { WorkflowNodeDataProps } from './workflow';

export interface NodeTemplateProps {
  id?: string; // 由前端添加的 uuid，用于标识节点
  name: string;
  description: string;
  version: string;
  created_at: string;
  updated_at: string;
  public: boolean;
  type: keyof typeof nodeTypes;
  data: WorkflowNodeDataProps;
  creator: {
    username: string;
    avatar: string;
  };
}
