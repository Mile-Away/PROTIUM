import { ContextMenuItemProps } from '@/@types/workflow';
import { ABACUSIcon, VASPIcon } from '@/components/Icons';
import {
  ArrowUpOnSquareIcon,
  CheckBadgeIcon,
  CloudArrowUpIcon,
  CodeBracketIcon,
  DocumentDuplicateIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import handleMenuItemClick from './handleMenuItemClick';
import { GoRepoTemplate } from "react-icons/go";

export const paneContextMenuItems: ContextMenuItemProps[] = [
  {
    action: 'components',
    label: 'Basic',
    icon: PlusIcon,
    arrow: true,
    subContextMenuItems: [
      {
        action: 'vasp',
        label: 'VASP',
        icon: PlusIcon,
        arrow: true,
        subContextMenuItems: [
          {
            action: 'poscar',
            label: 'POSCAR',
            icon: PlusIcon,
            onClick: () => handleMenuItemClick('POSCAR'),
          },
          // {
          //   action: 'potcar',
          //   label: 'POTCAR',
          //   icon: PlusIcon,
          //   onClick: () => handleMenuItemClick('potcar'),
          // },
          {
            action: 'incar',
            label: 'INCAR',
            icon: PlusIcon,
            onClick: () => handleMenuItemClick('INCAR'),
          },
          {
            action: 'kpoints',
            label: 'KPOINTS',
            icon: PlusIcon,
            onClick: () => handleMenuItemClick('KPOINTS'),
          },
        ],
      },
      {
        action: 'abacus',
        label: 'ABACUS',
        icon: PlusIcon,
        arrow: true,
        subContextMenuItems: [
          {
            action: 'abacus_input',
            label: 'INPUT',
            icon: PlusIcon,
            onClick: () => handleMenuItemClick('ABACUS_INPUT'),
          },
          {
            action: 'abacus_stru',
            label: 'STRU',
            icon: PlusIcon,
            onClick: () => handleMenuItemClick('abacus-stru'),
          },
          {
            action: 'abacus_kpt',
            label: 'KPT',
            icon: PlusIcon,
            onClick: () => handleMenuItemClick('abacus-kpt'),
          },
          {
            action: 'abacus_pseudo',
            label: 'Pseudo',
            icon: PlusIcon,
            onClick: () => handleMenuItemClick('abacus_pseudo'),
          },
          {
            action: 'abacus_siab',
            label: 'SIAB',
            icon: PlusIcon,
            arrow: true,
            subContextMenuItems: [
              {
                action: 'siab_orbitals',
                label: 'Orbitals',
                icon: PlusIcon,
                onClick: () => handleMenuItemClick('SIAB_Orbitals'),
              },
              {
                action: 'siab_system',
                label: 'System',
                icon: PlusIcon,
                onClick: () => handleMenuItemClick('SIAB_SYSTEM'),
              },
            ],
          },
        ],
      },
    ],
  },
  // {
  //   action: 'convert',
  //   label: 'Convert',
  //   icon: ArrowPathRoundedSquareIcon,
  //   arrow: true,
  //   onClick: () => handleMenuItemClick('edit'),
  //   subContextMenuItems: [
  //     {
  //       action: 'poscar2cif',
  //       label: 'POSCAR to CIF',
  //       icon: ArrowPathRoundedSquareIcon,
  //       onClick: () => handleMenuItemClick('edit'),
  //     },
  //     {
  //       action: 'structure fine-tune',
  //       label: '结构微调',
  //       icon: ArrowPathRoundedSquareIcon,
  //       onClick: () => handleMenuItemClick('edit'),
  //     },
  //     {
  //       action: 'structure matching',
  //       label: '结构匹配',
  //       icon: ArrowPathRoundedSquareIcon,
  //       onClick: () => handleMenuItemClick('edit'),
  //     },
  //     {
  //       action: 'random structure',
  //       label: '生成随机结构',
  //       icon: ArrowPathRoundedSquareIcon,
  //       onClick: () => handleMenuItemClick('edit'),
  //     },
  //   ],
  // },
  // {
  //   action: 'model',
  //   label: 'Model',
  //   icon: CubeIcon,
  //   onClick: () => handleMenuItemClick('edit'),
  // },
  {
    action: 'solver',
    label: 'Solver',
    icon: CodeBracketIcon,
    arrow: true,
    subContextMenuItems: [
      {
        action: 'vasp',
        label: 'VASP',
        icon: VASPIcon,
        onClick: () => handleMenuItemClick('VASP'),
      },
      {
        action: 'abacus',
        label: 'ABACUS',
        icon: ABACUSIcon,
        onClick: () => handleMenuItemClick('ABACUS'),
      },
      {
        action: 'ABACUS_SIAB',
        label: 'SIAB',
        icon: ABACUSIcon,
        onClick: () => handleMenuItemClick('ABACUS_SIAB'),
      },
      // {
      //   action: 'lammps',
      //   label: 'LAMMPS',
      //   icon: CodeBracketIcon,
      //   onClick: () => handleMenuItemClick('edit'),
      // },
      // {
      //   action: 'abinit',
      //   label: 'ABINIT',
      //   icon: CodeBracketIcon,
      //   onClick: () => handleMenuItemClick('edit'),
      // },
      // {
      //   action: 'quantum espresso',
      //   label: 'Quantum Espresso',
      //   icon: CodeBracketIcon,
      //   onClick: () => handleMenuItemClick('edit'),
      // },
    ],
  },
  {
    action: 'ilab',
    label: 'IntelliLab',
    icon: CodeBracketIcon,
    arrow: true,

    subContextMenuItems: [
      {
        action: 'grasp',
        label: 'Grasp',
        icon: PlusIcon,
        onClick: () => handleMenuItemClick('ILab_Grasp'),
      },

      {
        action: 'liquid_handling',
        label: 'Liquid Handling',
        icon: PlusIcon,
        arrow: true,
        subContextMenuItems: [
          {
            action: 'add',
            label: 'Add',
            icon: PlusIcon,
            onClick: () => handleMenuItemClick('ILab_Add'),
          },
          {
            action: 'separate',
            label: 'Separate',
            icon: PlusIcon,
            onClick: () => handleMenuItemClick('ILab_Separate'),
          },

          {
            action: 'transfer',
            label: 'Transfer',
            icon: PlusIcon,
            onClick: () => handleMenuItemClick('ILab_PumpTransfer'),
          },
        ],
      },
      {
        action: 'stirring',
        label: 'Stirring',
        icon: PlusIcon,
        arrow: true,
        subContextMenuItems: [
          {
            action: 'start_stir',
            label: 'Start Stir',
            icon: PlusIcon,
            onClick: () => handleMenuItemClick('ILab_StartStir'),
          },
          {
            action: 'stir',
            label: 'Stir',
            icon: PlusIcon,
            onClick: () => handleMenuItemClick('ILab_Stir'),
          },
          {
            action: 'stop_stir',
            label: 'Stop Stir',
            icon: PlusIcon,
            onClick: () => handleMenuItemClick('ILab_StopStir'),
          },
        ],
      },
      {
        action: 'temperature_control',
        label: 'Temperature Control',
        icon: PlusIcon,
        arrow: true,
        subContextMenuItems: [
          {
            action: 'start_tempctl',
            label: 'Start Temp Control',
            icon: PlusIcon,
            onClick: () => handleMenuItemClick('ILab_StartSetTemp'),
          },
          {
            action: 'temp_control',
            label: 'Temp Control',
            icon: PlusIcon,
            onClick: () => handleMenuItemClick('ILab_SetTemp'),
          },
          {
            action: 'stop_tempctl',
            label: 'Stop Temp Control',
            icon: PlusIcon,
            onClick: () => handleMenuItemClick('ILab_StopSetTemp'),
          },
        ],
      },
      {
        action: 'clean',
        label: 'Clean',
        icon: PlusIcon,
        onClick: () => handleMenuItemClick('ILab_Clean'),
      },
      {
        action: 'evaporate',
        label: 'Evaporate',
        icon: PlusIcon,
        onClick: () => handleMenuItemClick('ILab_Evaporate'),
      },
    ],
  },
  // {
  //   action: 'outputs',
  //   label: 'Outputs',
  //   icon: WrenchIcon,
  //   arrow: true,
  //   subContextMenuItems: [
  //     {
  //       action: 'vasp_outputs',
  //       label: 'VASP',
  //       icon: VASPIcon,
  //       onClick: () => handleMenuItemClick('vasp_outputs'),
  //     },
  //     {
  //       action: 'abacus_outputs',
  //       label: 'ABACUS',
  //       icon: ABACUSIcon,
  //       onClick: () => handleMenuItemClick('abacus_outputs'),
  //     },
  //   ],
  // },
];

export const nodeContextMenuItems: ContextMenuItemProps[] = [
  // {
  //   action: 'hidden',
  //   label: 'Hidden',
  //   icon: EyeSlashIcon,
  //   onClick: () => handleMenuItemClick('hidden'),
  // },
  {
    action: 'duplicate',
    label: 'Duplicate',
    icon: DocumentDuplicateIcon,
    arrow: false,
    onClick: () => handleMenuItemClick('duplicate'),
  },
  {
    action: 'delete',
    label: 'Delete',
    icon: TrashIcon,
    arrow: false,
    onClick: () => handleMenuItemClick('delete'),
  },
];

export const sideContextMenuItems: ContextMenuItemProps[] = [
  {
    action: 'duplicate',
    label: 'Duplicate',
    icon: DocumentDuplicateIcon,
    arrow: false,
  },
  {
    action: 'export',
    label: 'Export',
    icon: ArrowUpOnSquareIcon,
    arrow: false,
  },
  {
    action: 'publish',
    label: 'Publish',
    icon: GoRepoTemplate,
    arrow: false,
  },
  {
    action: 'delete',
    label: 'Delete',
    icon: TrashIcon,
    arrow: false,
  },
];
