import { addNodeProps } from '@/@types/workflow';
import BasicNode from '@/app/(workflow)/nodes/BasicNode';
import { type Node } from 'reactflow';
import InputNode from './InputNode';
import SelectNode from './SelectNode';
import SolverNode from './SolverNode';

const nodeTypes = {
  Solver: SolverNode,
  Basic: BasicNode,
  Select: SelectNode,
  Input: InputNode,
  // default: DefaultNode, // ReactFlow 中的默认节点类型，不能重复定义，否则发生未知错误且无提醒！！！
  // input: InputNode,  // ReactFlow 中的默认节点类型，不能重复定义，否则发生未知错误且无提醒！！！
};

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

// Key 的值应等于 header 的值
export const NodeMapping: {
  [key: string]: addNodeProps;
} = {
  /*
   * 以下是节点类型的定义
   * 1. type: 节点类型，必须与 nodeTypes 中的键值对应
   * 2. data: 节点的数据
   * 3. dragHandle: 拖拽句柄
   */
  // VASP
  POSCAR: {
    type: 'Input',
    data: {
      header: 'POSCAR',
      status: 'draft',
      handles: [
        {
          type: 'source',
          key: 'poscar',
          rope: 'VASP',
          data_source: 'compile',
          data_key: 'poscar',
        },
      ],
      body: [
        {
          id: '',
          source: '',
          type: 'textarea',
          title: 'POSCAR',
          key: 'poscar',
          compile: [],
        },
      ],
      compile: [
        {
          id: '',
          source: '',
          type: 'file',
          script: 'poscar',
          title: 'POSCAR',
          key: 'poscar',
          bodies: ['poscar'],
        },
      ],
      footer: 'VASP/POSCAR',
    },
    dragHandle: '.drag-handle',
  },

  POTCAR: {
    type: 'Select',
    data: {
      header: 'POTCAR',
      status: 'draft',
      body: [
        { id: '', source: '', type: 'select', title: 'POTCAR', key: 'potcar' },
      ],
      compile: [
        {
          id: '',
          source: '',
          type: 'file',
          script: 'potcar',
          title: 'POTCAR',
          key: 'potcar',
          bodies: ['potcar'],
        },
      ],
      footer: 'VASP/POTCAR',
      handles: [
        {
          type: 'source',
          key: 'potcar',
          rope: 'VASP',
          data_source: 'compile',
          data_key: 'potcar',
        },
      ],
    },
    dragHandle: '.drag-handle',
  },

  INCAR: {
    type: 'Input',
    data: {
      header: 'INCAR',
      status: 'draft',
      handles: [
        {
          type: 'source',
          key: 'incar',
          rope: 'VASP',
          data_source: 'compile',
          data_key: 'incar',
        },
      ],
      body: [
        { id: '', source: '', type: 'textarea', title: 'INCAR', key: 'incar' },
      ],
      compile: [
        {
          id: '',
          source: '',
          type: 'file',
          script: 'incar',
          title: 'INCAR',
          key: 'incar',
          bodies: ['incar'],
        },
      ],
      footer: 'VASP/INCAR',
    },
    dragHandle: '.drag-handle',
  },

  KPOINTS: {
    type: 'Input',
    data: {
      header: 'KPOINTS',
      status: 'draft',
      handles: [
        {
          key: 'kpoints',
          type: 'source',
          rope: 'VASP',
          data_source: 'compile',
          data_key: 'kpoints',
        },
      ],
      body: [
        {
          id: '',
          source: '',
          type: 'textarea',
          title: 'KPOINTS',
          key: 'kpoints',
        },
      ],
      compile: [
        {
          id: '',
          source: '',
          type: 'file',
          script: 'kpoints',
          title: 'KPOINTS',
          key: 'kpoints',
          bodies: ['kpoints'],
        },
      ],
      footer: 'VASP/KPOINTS',
    },
    dragHandle: '.drag-handle',
  },

  VASP: {
    type: 'Solver',
    data: {
      header: 'VASP',
      status: 'draft',
      body: [
        {
          id: '',
          source: 'default',
          type: 'select',
          key: 'potcarSelect',
        },
        {
          id: '',
          source: 'bohrium',
          type: 'select',
          key: 'machineSelect',
        },
        {
          id: '',
          source: '',
          title: 'Machine Config',
          type: 'textarea',
          key: 'config',
        },
      ],

      footer: 'VASP 5.4.4',
      handles: [
        { key: 'poscar', type: 'target', rope: 'POSCAR' },
        // { key: 'potcar', type: 'target' },
        { key: 'incar', type: 'target', rope: 'INCAR' },
        { key: 'kpoints', type: 'target', rope: 'KPOINTS' },
        { key: 'vasp/outputs', type: 'source', rope: 'VASP_OUTPUTS' },
      ],
      compile: [
        {
          id: '',
          source: '',
          type: 'file',
          script: 'vasp',
          title: 'VASP',
          key: 'vasp',
          bodies: [],
        },
      ],
    },
    dragHandle: '.drag-handle',
  },

  VASP_OUTPUTS: {
    type: 'Input',
    data: {
      header: 'VASP Outputs',
      status: 'draft',
      body: [
        {
          id: '',
          source: '',
          type: 'textarea',
          key: 'vasp_outputs',
          compile: [],
        },
      ],

      footer: 'VASP Outputs',
      handles: [{ key: 'vasp/outputs', type: 'target', rope: 'VASP' }],
      compile: [
        {
          id: '',
          source: '',
          type: 'file',
          script: 'vasp',
          title: 'VASP',
          key: 'vasp',
          bodies: [],
        },
      ],
    },
    dragHandle: '.drag-handle',
  },

  // ABACUS
  ABACUS_INPUT: {
    type: 'Input',
    data: {
      header: 'ABACUS INPUT',
      status: 'draft',
      body: [
        {
          id: '',
          source: {
            pseudo_dir:
              '/root/abacus-develop/pseudopotentials/sg15_oncv_upf_2020-02-06/1.0',
            pseudo_name: 'Si_ONCV_PBE-1.0.upf',
            ecutwfc: 60,
            bessel_nao_smooth: 0,
            bessel_nao_rcut: [6, 7, 8, 9, 10],
            smearing_sigma: 0.01,
          },
          type: 'textarea',
          title: 'ABACUS INPUT',
          key: 'abacus_input',
          compile: [],
        },
      ],

      footer: 'ABACUS INPUT',
      handles: [
        {
          key: 'abacus/input',
          type: 'source',
          rope: 'ABACUS',
          data_source: 'compile',
          data_key: 'abacus_input',
        },
      ],
      compile: [
        {
          id: '',
          source: '',
          type: 'file',
          script: 'abacus_input',
          title: 'ABACUS INPUT',
          key: 'abacus_input',
          bodies: ['abacus_input'],
        },
      ],
    },
    dragHandle: '.drag-handle',
  },

  SIAB_ORBITALS: {
    type: 'Input',
    data: {
      header: 'SIAB ORBITALS',
      status: 'draft',
      body: [
        {
          id: '',
          source: {},
          type: 'textarea',
          title: 'SIAB ORBITALS',
          key: 'siab_orbitals',
          compile: [],
        },
      ],

      footer: 'ORBITALS',
      handles: [
        {
          key: 'siab/orbitals',
          type: 'source',
          rope: 'ABACUS_SIAB',
          data_source: 'compile',
          data_key: 'siab_orbitals',
        },
      ],
      compile: [
        {
          id: '',
          source: '',
          type: 'file',
          script: 'siab_orbitals',
          title: 'SIAB Oribitals',
          key: 'siab_orbitals',
          bodies: ['siab_orbitals'],
        },
      ],
    },
    dragHandle: '.drag-handle',
  },

  ABACUS_STRU: {
    type: 'Input',
    data: {
      header: 'STRU',
      status: 'draft',
      body: [
        {
          id: '',
          source: {},
          type: 'textarea',
          key: 'stru',
          compile: [],
        },
      ],

      footer: 'STRU',
      handles: [{ key: 'abacus/stru', type: 'source', rope: 'ABACUS' }],
      compile: [
        {
          id: '',
          source: '',
          type: 'file',
          script: 'abacus_stru',
          title: 'ABACUS_STRU',
          key: 'abacus_stru',
          bodies: ['stru'],
        },
      ],
    },
    dragHandle: '.drag-handle',
  },

  SIAB_SYSTEM: {
    type: 'Input',
    data: {
      header: 'SIAB SYSTEM',
      status: 'draft',
      body: [
        {
          id: '',
          source: {},
          type: 'textarea',
          title: 'SIAB SYSTEM',
          key: 'siab_system',
          compile: [],
        },
      ],

      footer: 'Version 0.1.0',
      handles: [
        {
          key: 'siab/system',
          type: 'source',
          rope: 'ABACUS_SIAB',
          data_source: 'compile',
          data_key: 'siab_system',
        },
      ],
      compile: [
        {
          id: '',
          source: '',
          type: 'file',
          script: 'siab_system',
          title: 'SIAB SYSTEM',
          key: 'siab_system',
          bodies: ['siab_system'],
        },
      ],
    },
    dragHandle: '.drag-handle',
  },

  ABACUS: {
    type: 'Solver',
    data: {
      header: 'ABACUS',
      status: 'draft',
      body: [
        {
          id: '',
          source: 'default',
          type: 'select',
          key: 'potcarSelect',
        },
        {
          id: '',
          source: 'bohrium',
          type: 'select',
          key: 'machineSelect',
        },
        {
          id: '',
          source: '',
          title: 'Machine Config',
          type: 'textarea',
          key: 'config',
        },
      ],

      footer: 'ABACUS 3.7.1',
      handles: [
        { key: 'input', type: 'target', rope: 'INPUT' },
        // { key: 'potcar', type: 'target' },
        { key: 'kpt', type: 'target', rope: 'KPT' },
        { key: 'stru', type: 'target', rope: 'STRU' },
      ],
      compile: [
        {
          id: '',
          source: '',
          type: 'file',
          script: 'vasp',
          title: 'VASP',
          key: 'vasp',
          bodies: [],
        },
      ],
    },
    dragHandle: '.drag-handle',
  },

  ABACUS_SIAB: {
    type: 'Solver',
    data: {
      header: 'ABACUS SIAB',
      status: 'draft',
      body: [
        {
          id: '',
          source: {},
          type: 'textarea',
          title: 'SIAB Config',
          key: 'abacus_siab',
          compile: [],
        },
        {
          id: '',
          source: {},
          type: 'textarea',
          title: 'Bohrium Job Config',
          key: 'bohrium_job_config',
          compile: [],
        },
      ],
      handles: [
        { key: 'abacus/input', type: 'target', rope: 'ABACUS_INPUT' },
        { key: 'siab/system', type: 'target', rope: 'SIAB_SYSTEM' },
        { key: 'siab/orbitals', type: 'target', rope: 'SIAB_ORBITALS' },
        { key: 'siab/outputs', type: 'source', rope: 'ABACUS_SIAB_OUTPUTS' },
      ],
      compile: [
        {
          id: '',
          source: '',
          type: 'task',
          script: 'abacus_siab',
          title: 'ABACUS_SIAB',
          key: 'abacus_siab',
          bodies: [],
        },
      ],
      footer: 'Version 0.1.0',
    },
    dragHandle: '.drag-handle',
  },

  ABACUS_SIAB_OUTPUTS: {
    type: 'Input',
    data: {
      header: 'ABACUS SIAB Outputs',
      status: 'draft',
      body: [
        {
          id: '',
          source: '',
          type: 'textarea',
          key: 'vasp_outputs',
          compile: [],
        },
      ],

      footer: 'ABACUS SIAB Outputs',
      handles: [
        { key: 'siab/outputs', type: 'target', rope: 'PIPELINE_ABACUS_SIAB' },
      ],
      compile: [
        {
          id: '',
          source: '',
          type: 'file',
          script: 'vasp',
          title: 'VASP',
          key: 'vasp',
          bodies: [],
        },
      ],
    },
    dragHandle: '.drag-handle',
  },
};

export default nodeTypes;
