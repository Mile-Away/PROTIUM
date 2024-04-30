import { WorkflowNodeDataProps } from '@/store/workflow/workflowSlice';
import { Dispatch } from '@reduxjs/toolkit';
import { NodeProps } from 'reactflow';
// Workflow
// export type MenuItemAction = 'edit' | 'delete' | 'copy' | 'new' | 'hidden';

export interface ContextMenuItemProps {
  action: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  arrow?: boolean;
  onClick?: () => (dispatch: Dispatch) => void;
  subContextMenuItems?: ContextMenuItemProps[];
}

export interface BasicNodeProps extends NodeProps {
  data: WorkflowNodeDataProps;
  children?: React.ReactNode;
}
