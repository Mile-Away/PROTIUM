import nodeTypes from '@/app/(workflow)/nodes/nodeTypes';
import { WorkflowNodeDataProps } from './workflow';

export interface NodeTemplateProps {
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
