import nodeTypes from '@/app/(workflow)/nodes/nodeTypes.ts';
import { Dispatch } from '@reduxjs/toolkit';
import { Edge, NodeProps } from 'reactflow';
// Workflow
// export type MenuItemAction = 'edit' | 'delete' | 'copy' | 'new' | 'hidden';

export type HandleDataSourceProps = 'compile' | 'body' | 'handle';

export interface WorkflowNodeDataHandlesProps {
  key: string;
  type: 'source' | 'target';
  label?: string;
  hasConnected?: boolean;
  required?: boolean;
  data_source?: HandleDataSourceProps;
  data_key?: string;
  rope: string;
}

export interface WorkflowNodeDataBodyProps {
  id: string;
  type: 'input' | 'select' | 'textarea' | 'file' | 'object';
  key: string;
  source: string | object;
  compile?: string[]; // 记录这个 Body 运行的 Result 的 key
  title?: string;
  attachment?: string;
  schema?: {
    schema: object;
    uiSchema: object;
  };
}

export interface WorkflowNodeCompileProps {
  id: string;
  key: string; // 记录 Result 的实际的 key
  source: string; // 记录 Result 的结果
  script: string; // 运行用户输入的脚本
  bodies: string[]; // 记录这个 Result 运行所需要的 Body 的 key
  type: string;
  title: string; // 前端展示的标题
  attachment?: string;
}

export interface WorkflowNodeDataProps {
  header: string;
  // 不同节点中有相同的 key，这个 key 用来判断 handle 之间是否可以连接
  handles: WorkflowNodeDataHandlesProps[];
  body: WorkflowNodeDataBodyProps[]; // body 属性决定 Node 上展示的与用户交互的表单，表单提交的行为回调到 Redux
  compile: WorkflowNodeCompileProps[];
  status?: 'draft' | 'skipped' | 'pending' | 'running' | 'success' | 'failed';
  footer?: string;
}

export interface WorkflowNodeProps
  extends Node<WorkflowNodeDataProps, keyof typeof nodeTypes> {
  id: string;
  type?: keyof typeof nodeTypes;
  template: string; // 这个 template 无法传入到 ReactFlow 画布中的 Node
  version: string;
  data: WorkflowNodeDataProps;
  dragHandle?: string | '.drag-handle';
  position: { x: number; y: number };
}

export type addNodeProps = Omit<WorkflowNodeProps, 'id' | 'position'> & {
  id?: string;
};

export interface WorkflowProps {
  id: string;
  uuid: string;
  name: string;
  description?: string;
  created_at: Date | string;
  updated_at: Date | string;
  creator: { username: string; avatar: string };
  status: 'draft' | 'pending' | 'running' | 'finished' | 'canceled' | 'failed';
  public?: boolean;
  nodes: WorkflowNodeProps[];
  edges: Edge[];
}
export interface WorkflowStateProps {
  sideMenuVisible: boolean;
  contextMenuVisible: boolean;
  contextMenuX: number;
  contextMenuY: number;
  activeMenuItems: string[];
  sliderOverlayVisible: boolean;
  sliderOverlay?: {
    nodeId: string;
    bodyId: string;
  };
  nodes: WorkflowNodeProps[];
  edges: Edge[];
  workflow: WorkflowProps;
  workflowList: WorkflowProps[];
  consoleInfo: {
    time: string;
    type?: 'info' | 'warning' | 'error';
    message: string;
  }[];

  status: 'idle' | 'loading' | 'error';
}
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

export interface ExecutedNodeMessageProps {
  id: string;
  header: string;
  status: 'success' | 'failed' | 'running' | 'draft' | 'skipped' | 'pending';
  compile?: [];
  messages?: { type: 'info' | 'warning' | 'error'; message: string }[];
}

export interface ExecuteStatusProps {
  uuid: string;
  header: string;
  status: 'success' | 'failed' | 'running' | 'draft' | 'skipped' | 'pending';
  compile: { [key: string]: string | object }[];
  messages: { type: 'info' | 'warning' | 'error'; message: string }[];
}
