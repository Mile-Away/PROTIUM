import { ExecutedNodeMessageProps } from '@/@types/workflow';
import nodeTypes from '@/app/(workflow)/workflow/[uuid]/nodeTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  Node,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

export interface WorkflowNodeDataHandlesProps {
  key: string;
  type: 'source' | 'target';
  label?: string;
  hasConnected?: boolean;
  required?: boolean;
  data_source?: 'result' | 'body' | 'handle';
  data_key?: string;
}

export interface WorkflowNodeDataBodyProps {
  id: string;
  type: 'input' | 'select' | 'textarea' | 'file';
  key: string;
  source: string;
  results?: string[]; // 记录这个 Body 运行的 Result 的 key
  title?: string;
  attachment?: string;
}

export interface WorkflowNodeResultProps {
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

  // TODO:这里还需要限制相同 type 的 handles 的 key 在同一个节点中唯一。
  // 不同节点中有相同的 key，这个 key 用来判断 handle 之间是否可以连接
  handles: WorkflowNodeDataHandlesProps[];
  body: WorkflowNodeDataBodyProps[]; // body 属性决定 Node 上展示的与用户交互的表单，表单提交的行为回调到 Redux
  results: WorkflowNodeResultProps[];
  status: 'draft' | 'skipped' | 'pending' | 'running' | 'success' | 'failed';
  footer?: string;
}
export interface WorkflowNodeProps
  extends Node<WorkflowNodeDataProps, keyof typeof nodeTypes> {
  id: string;
  type?: keyof typeof nodeTypes;
  data: WorkflowNodeDataProps;
  dragHandle?: string | '.drag-handle';
  position: { x: number; y: number };
}

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
  consoleInfo: { time: string; message: string }[];
}

const initialStateWorkflow: WorkflowStateProps = {
  contextMenuVisible: false,
  contextMenuX: 0,
  contextMenuY: 0,
  activeMenuItems: [],
  sliderOverlayVisible: false,
  sliderOverlay: { nodeId: '', bodyId: '' },
  nodes: [],
  edges: [],
  // CASE 1: 将 nodes 和 edges 移动到 workflows 中，
  // 优点：可以支持不同 Workflow 之间快速切换
  // 缺点：每次对 Node 和 Edge 进行操作时都需要确定更加依赖客户端性能，
  workflow: {
    id: '',
    uuid: '',
    name: 'Untitled',
    description: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    creator: { username: '', avatar: '' },
    status: 'draft',
    public: false,
    nodes: [],
    edges: [],
  },
  consoleInfo: [],

  // CASE 2: Redux 不存储 workflows，只存储当前 workflow 的 nodes 和 edges，只存储单个 workflow 对象
  // 需要切换 Workflow 时，重新请求数据
  // 优点：1. 减少 Redux 存储的数据量，减少客户端性能依赖
  //      2. 进行 Node 和 Edge 操作时不需要查询 workflow，操作更加快速
  // 缺点：切换 Workflow 时重新加载，切换没有方案一顺畅

  // TODO 用户场景性能测试？>>>>> 1
  // 1. 大部分操作在单个 Workflow 中完成，不常切换 Workflow，使用 CASE 2
  // 2. 需要频繁切换 Workflow，使用 CASE 1

  // END 使用 Case 2，毋庸置疑，我不需要在进入这个页面时就加载所有的工作流，特别是对于某些有大量输出的工作流。

  // Redux 中应为纯函数，不应该存储 React 组件。
  // nodeTypes: {
  //   custom: StructureNode,
  //   structure: StructureNode,
  //   default: StructureNode,
  // },
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState: initialStateWorkflow,
  reducers: {
    // 控制菜单栏是否可见
    setContextMenuVisible: (state, action) => {
      state.contextMenuVisible = action.payload;
      state.activeMenuItems = [];
    },
    setContextMenuX: (state, action) => {
      state.contextMenuX = action.payload;
    },
    setContextMenuY: (state, action) => {
      state.contextMenuY = action.payload;
    },
    setActiveMenuItems: (state, action) => {
      state.activeMenuItems = action.payload;
    },
    addNode: {
      // 由中间件处理 id
      prepare(props: Omit<WorkflowNodeProps, 'id' | 'position'>) {
        return {
          payload: {
            ...props,
            id: uuidv4(),
            data: {
              ...props.data,
              body: props.data.body.map((item) => ({
                ...item,
                id: uuidv4(),
              })),
              results: props.data.results.map((item) => ({
                ...item,
                id: uuidv4(),
              })),
            },
          } as WorkflowNodeProps,
          meta: undefined,
          error: undefined,
        };
      },
      reducer(state, action: PayloadAction<WorkflowNodeProps>) {
        state.nodes.push({
          ...action.payload,
          position: { x: state.contextMenuX, y: state.contextMenuY },
        });

        state.consoleInfo.push({
          time: new Date().toISOString(),
          message: `Added: ${action.payload.data.header}`,
        });
      },
    },

    // 控制节点拖拽
    setNodes: (state, action) => {
      state.nodes = applyNodeChanges(
        action.payload,
        state.nodes,
      ) as WorkflowNodeProps[];
    },

    // 控制线条拖拽
    setEdges: (state, action) => {
      state.edges = applyEdgeChanges(action.payload, state.edges) as Edge[];
    },

    addConsole: (state, action) => {
      state.consoleInfo.push(action.payload);
    },

    // 控制线条连接
    connectEdges: (state, action: PayloadAction<Connection>) => {
      state.edges = addEdge(action.payload, state.edges) as Edge[];

      // 将连接的节点的 handles 的 hasConnected 设置为 true
      const sourceNode = state.nodes.find(
        (node: WorkflowNodeProps) => node.id === action.payload.source,
      );
      if (sourceNode) {
        const sourceHandle = sourceNode.data.handles.find(
          (handle) =>
            handle.key === action.payload.sourceHandle?.split('_').pop(),
        );
        if (sourceHandle) {
          sourceHandle.hasConnected = true;
        }
      }
      const targetNode = state.nodes.find(
        (node: WorkflowNodeProps) => node.id === action.payload.target,
      );
      if (targetNode) {
        const targetHandle = targetNode.data.handles.find(
          (handle) =>
            handle.key === action.payload.targetHandle?.split('_').pop(),
        );
        if (targetHandle) {
          targetHandle.hasConnected = true;
        }
      }

      state.consoleInfo.push({
        time: new Date().toISOString(),
        message: `Connected: ${sourceNode?.data
          .header}(${action.payload.sourceHandle
          ?.split('_')
          .pop()}) -> ${targetNode?.data.header}(${action.payload.targetHandle
          ?.split('_')
          .pop()})`,
      });
    },

    // 记录节点的 Body 的输入
    setNodeDataBodyContent: {
      prepare(props: { nodeId: string; bodyKey: string; source: string }) {
        return {
          payload: props,
          meta: undefined,
          error: undefined,
        };
      },
      reducer(
        state,
        action: PayloadAction<{
          nodeId: string;
          bodyKey: string;
          source: string;
        }>,
      ) {
        const node = state.nodes.find(
          (node) => node.id === action.payload.nodeId,
        );
        if (node) {
          const body = node.data.body.find(
            (body) => body.key === action.payload.bodyKey,
          );
          if (body) {
            body.source = action.payload.source;
          }
        }
      },
    },

    setHandle: (
      state,
      action: PayloadAction<{
        nodeId: string;
        handleKey: string;
        data_source: 'result' | 'body' | 'handle';
        data_key: string;
      }>,
    ) => {
      const node = state.nodes.find(
        (node) => node.id === action.payload.nodeId,
      );
      if (node) {
        const handle = node.data.handles.find(
          (handle) => handle.key === action.payload.handleKey,
        );
        if (handle) {
          handle.data_source = action.payload.data_source;
          handle.data_key = action.payload.data_key;
        }
      }
    },

    addHandle: (
      state,
      action: PayloadAction<{
        nodeId: string;
        handle: WorkflowNodeDataHandlesProps;
      }>,
    ) => {
      const node = state.nodes.find(
        (node) => node.id === action.payload.nodeId,
      );
    },

    deleteHandle: (
      state,
      action: PayloadAction<{ nodeId: string; handleKey: string }>,
    ) => {
      const node = state.nodes.find(
        (node) => node.id === action.payload.nodeId,
      );
      if (node) {
        node.data.handles = node.data.handles.filter(
          (handle) => handle.key !== action.payload.handleKey,
        );
      }
    },

    addResultBodies: (
      state,
      action: PayloadAction<{
        nodeId: string;
        resultKey: string;
        bodyKey: string;
      }>,
    ) => {
      const node = state.nodes.find(
        (node) => node.id === action.payload.nodeId,
      );
      if (node) {
        const result = node.data.results.find(
          (result) => result.key === action.payload.resultKey,
        );
        if (result) {
          result.bodies.push(action.payload.bodyKey);
        }
      }
    },

    setSliderOverlayVisible: (state, action) => {
      state.sliderOverlayVisible = action.payload;
    },

    setSliderOverlay: (state, action) => {
      state.sliderOverlay = action.payload;
    },

    setWorkflow: (state, action) => {
      state.workflow = action.payload;
      state.nodes = action.payload.nodes || [];
      state.edges = action.payload.edges || [];
    },

    setWorkflowName: (state, action) => {
      state.workflow.name = action.payload;
    },

    setNodeExecutedResults: (
      state,
      action: PayloadAction<ExecutedNodeMessageProps>,
    ) => {
      const node = state.nodes.find((node) => node.id === action.payload.id);

      console.log('>>>>>>>', action.payload);
      if (node) {
        node.data.status = action.payload.status;

        action.payload.results?.map(
          (result: { key: string; source: string }) => {
            const resultItem = node.data.results.find(
              (item) => item.key === result.key,
            );
            if (resultItem) {
              resultItem.source = result.source;
            }
          },
        );

        action.payload.messages?.map(
          (message: {
            type: 'info' | 'warning' | 'error';
            message: string;
          }) => {
            console.log('>>>>>>>', message.message);
            state.consoleInfo.push({
              time: new Date().toISOString(),
              message: `${action.payload.header}: ${message.message}`,
            });
          },
        );
      }
    },
  },
});

export const {
  setContextMenuVisible,
  setContextMenuX,
  setContextMenuY,
  setActiveMenuItems,
  addNode,
  setNodes,
  setEdges,
  connectEdges,
  setNodeDataBodyContent,
  setNodeExecutedResults,
  setSliderOverlayVisible,
  setSliderOverlay,
  setWorkflow,
  setWorkflowName,
  setHandle,
  addHandle,
  deleteHandle,
} = workflowSlice.actions;

export default workflowSlice.reducer;

// export default function workflowNodesReducer(
//   state = initialStateWorkflowNodes,
//   action: { type: string; payload?: any },
// ) {
//   switch (action.type) {
//     case 'workflowNodes/addNode':
//       return {
//         ...state,
//         initialNodes: [...state.initialNodes, action.payload],
//       };
//     default:
//       return state;
//   }
// }