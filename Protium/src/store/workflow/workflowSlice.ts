import { NodeTemplateProps } from '@/@types/flociety';
import {
  ExecutedNodeMessageProps,
  HandleDataSourceProps,
  WorkflowNodeDataHandlesProps,
  WorkflowNodeProps,
  WorkflowStateProps,
} from '@/@types/workflow';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { fetchNodeTemplate } from '../middleware';

const initialStateWorkflow: WorkflowStateProps = {
  sideMenuVisible: false,
  contextMenuVisible: false,
  contextMenuX: 0,
  contextMenuY: 0,
  activeMenuItems: [],
  sliderOverlayVisible: false,
  sliderOverlay: { nodeId: '', bodyId: '', compileId: '' },
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
  workflowList: [],
  consoleInfo: [],

  status: 'idle',

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
    setSideMenuVisible: (state, action) => {
      state.sideMenuVisible = action.payload;
    },

    // 控制画布菜单栏是否可见
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

    // 设置 workflowList
    setWorkflowList: (state, action) => {
      state.workflowList = action.payload;
    },

    // NOTE: 调用 fetchNodeTemplate 时，会自动调用 addNode
    addNode: (state, action: PayloadAction<NodeTemplateProps>) => {
      // console.log('>>>>>>>>fetchNodeTemplate:', action.payload);
      // Use the addNode reducer to add the node to the state
      state.nodes.push({
        id: action.payload.id || uuidv4(),
        type: action.payload.type,
        template: action.payload.name,
        version: action.payload.version,
        data: {
          ...action.payload.data,
          body: action.payload.data.body.map((item) => ({
            ...item,
            id: uuidv4(),
          })),
          compile: action.payload.data.compile.map((item) => ({
            ...item,
            id: uuidv4(),
          })),
        },
        position: { x: state.contextMenuX, y: state.contextMenuY },

        dragHandle: '.drag-handle',
      });
      state.consoleInfo.push({
        time: new Date().toISOString(),
        message: `Added: ${action.payload.data.header}`,
      });
    },

    // // 删除节点
    // deleteNode: (state, action) => {
    //   state.nodes = state.nodes.filter((node) => node.id !== action.payload);
    //   state.edges = state.edges.filter(
    //     (edge) => edge.source !== action.payload && edge.target !== action.payload,
    //   );

    //   state.consoleInfo.push({
    //     time: new Date().toISOString(),
    //     message: `Deleted: ${state.nodes.find(
    //       (node) => node.id === action.payload,
    //     )?.data.header}`,
    //   });
    // },

    // 控制节点拖拽
    setNodes: (state, action) => {
      state.nodes = applyNodeChanges(
        action.payload,
        state.nodes,
      ) as WorkflowNodeProps[];
    },

    minimizedNode: (state, action) => {
      const node = state.nodes.find((node) => node.id === action.payload);
      if (node) {
        node.minimized = !node.minimized;
      }
    },

    // 控制线条拖拽
    setEdges: (state, action: PayloadAction<EdgeChange[]>) => {
      // console.log('setEdges:', action.payload);
      action.payload.map((item) => {
        if (item.type === 'remove') {
          const removedEdge = state.edges.find((edge: Edge) => {
            console.log(
              'Checking edge id:',
              edge.id,
              'against item id:',
              item.id,
            );
            return edge.id === item.id;
          });

          if (removedEdge) {
            const sourceNode = state.nodes.find(
              (node: WorkflowNodeProps) => node.id === removedEdge.source,
            );
            if (sourceNode) {
              const removedSourceHandle = sourceNode.data.handles.find(
                (handle) =>
                  handle.key === removedEdge.sourceHandle?.split('_').pop() &&
                  handle.type === 'source',
              );
              if (removedSourceHandle) {
                removedSourceHandle.hasConnected = false;
              }
            }

            const targetNode = state.nodes.find(
              (node: WorkflowNodeProps) => node.id === removedEdge.target,
            );
            if (targetNode) {
              const removedTargetHandle = targetNode.data.handles.find(
                (handle) =>
                  handle.key === removedEdge.targetHandle?.split('_').pop() &&
                  handle.type === 'target',
              );
              if (removedTargetHandle) {
                removedTargetHandle.hasConnected = false;
              }
            }
          }
        }
      });

      state.edges = applyEdgeChanges(action.payload, state.edges) as Edge[];
    },

    // 添加控制台信息
    addConsole: (
      state,
      action: PayloadAction<{
        time: string;
        type: 'info' | 'warning' | 'error';
        message: string;
      }>,
    ) => {
      state.consoleInfo.push(action.payload);
    },

    // onConnect: (state, action: PayloadAction<Connection>) => {

    // },

    // 控制线条连接
    connectEdges: (state, action: PayloadAction<Connection>) => {
      // 添加到 reactflow 的 redux edges 中
      state.edges = addEdge(action.payload, state.edges);

      // 添加到我自己的 edges 中
      // state.edges.push({
      //   id: uuidv4(),
      //   source: action.payload.source,
      //   target: action.payload.target,
      //   sourceHandle: action.payload.sourceHandle,
      //   targetHandle: action.payload.targetHandle,
      // });
      // 将连接的节点的 handles 的 hasConnected 设置为 true
      const sourceNode = state.nodes.find(
        (node: WorkflowNodeProps) => node.id === action.payload.source,
      );

      if (sourceNode) {
        const sourceHandle = sourceNode.data.handles.find(
          (handle) =>
            handle.key === action.payload.sourceHandle?.split('_').pop() &&
            handle.type === 'source',
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
            handle.key === action.payload.targetHandle?.split('_').pop() &&
            handle.type === 'target',
        );
        if (targetHandle) {
          targetHandle.hasConnected = true;
        }
      }

      state.consoleInfo.push({
        time: new Date().toISOString(),
        message: `Connected: ${
          sourceNode?.data.header
        }(${action.payload.sourceHandle
          ?.split('_')
          .pop()}) -> ${targetNode?.data.header}(${action.payload.targetHandle
          ?.split('_')
          .pop()})`,
      });
    },

    // 记录节点的 Body 的输入
    setNodeDataBodyContent: {
      prepare(props: {
        nodeId: string;
        bodyKey: string;
        source: object | string;
      }) {
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
          source: object | string;
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
        data_source: HandleDataSourceProps;
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
        const result = node.data.compile.find(
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
      state.workflowList = state.workflowList.map((workflow) => {
        if (workflow.uuid === state.workflow.uuid) {
          workflow.name = action.payload;
        }
        return workflow;
      });
    },

    setNodeExecutedCompile: (
      state,
      action: PayloadAction<ExecutedNodeMessageProps>,
    ) => {
      const node = state.nodes.find((node) => node.id === action.payload.id);

      if (node) {
        node.data.status = action.payload.status;

        action.payload.compile?.map(
          (result: { key: string; source: string }) => {
            const resultItem = node.data.compile.find(
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
            state.consoleInfo.push({
              time: new Date().toISOString(),
              type: message.type,
              // message: `${action.payload.header}: ${message.message}`,
              message: message.message,
            });
          },
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNodeTemplate.pending, (state: WorkflowStateProps) => {
        state.status = 'loading';
        // console.log('>>>>>>>>fetchNodeTemplate.pending:', state);
      })
      .addCase(
        fetchNodeTemplate.fulfilled,
        (state, action: PayloadAction<NodeTemplateProps>) => {
          workflowSlice.caseReducers.addNode(state, action);
          state.status = 'idle';
        },
      )
      .addCase(fetchNodeTemplate.rejected, (state, action) => {
        state.status = 'error';
        state.consoleInfo.push({
          time: new Date().toISOString(),
          type: 'error',
          message: action.error.message || 'Error',
        });
      });
  },
});

export const {
  setContextMenuVisible,
  setContextMenuX,
  setContextMenuY,
  setActiveMenuItems,
  setWorkflowList,
  addNode,
  setNodes,
  minimizedNode,
  setEdges,
  connectEdges,
  setNodeDataBodyContent,
  setNodeExecutedCompile,
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
