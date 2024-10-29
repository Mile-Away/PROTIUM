import { WorkflowProps } from '@/@types/workflow';

interface OutputNode {
  template: string;
  version?: string;
  params: Record<string, any>;
  handles?: Record<string, string[]>;
  position: { x: number; y: number };
  positionAbsolute?: { x: number; y: number };
}

interface OutputFormat {
  nodes: Record<string, OutputNode>;
}

function convertWorkflow(input: WorkflowProps): OutputFormat {
  const nodeMap: Record<string, number> = {};
  const outputNodes: Record<string, OutputNode> = {};

  input.nodes.forEach((node, index) => {
    nodeMap[node.id] = index;
    const params: Record<string, any> = {};
    node.data.body.forEach((body) => {
      params[body.key] = body.source;
    });

    outputNodes[index.toString()] = {
      template: node.template,
      version: node.version,
      position: node.position,
      positionAbsolute: node.positionAbsolute,
      params: params,
      handles: {},
    };
  });

  input.edges.forEach((edge) => {
    const targetIndex = nodeMap[edge.target];
    const sourceIndex = nodeMap[edge.source];
    const targetHandle = edge.targetHandle!.split('_').pop();
    const sourceHandle = edge.sourceHandle!.split('_').pop();

    if (!outputNodes[targetIndex.toString()].handles) {
      outputNodes[targetIndex.toString()].handles = {};
    }

    if (!outputNodes[targetIndex.toString()].handles![targetHandle!]) {
      outputNodes[targetIndex.toString()].handles![targetHandle!] = [];
    }

    outputNodes[targetIndex.toString()].handles![targetHandle!].push(
      sourceIndex.toString(),
    );
  });

  return { nodes: outputNodes };
}


export default convertWorkflow;
