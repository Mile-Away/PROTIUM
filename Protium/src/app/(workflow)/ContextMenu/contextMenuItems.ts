import { ContextMenuItemProps } from '@/@types/workflow';
import { ABACUSIcon, VASPIcon } from '@/components/Icons';
import {
  CodeBracketIcon,
  DocumentDuplicateIcon,
  EllipsisHorizontalCircleIcon,
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  RectangleGroupIcon,
  SwatchIcon,
  TrashIcon,
  WrenchIcon,
} from '@heroicons/react/24/outline';
import handleMenuItemClick from './handleMenuItemClick';

export const paneContextMenuItems: ContextMenuItemProps[] = [
  {
    action: 'components',
    label: 'Basic',
    icon: PlusIcon,
    arrow: true,
    subContextMenuItems: [
      {
        action: 'dft',
        label: 'DFT',
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
                onClick: () => handleMenuItemClick('poscar'),
              },
              {
                action: 'potcar',
                label: 'POTCAR',
                icon: PlusIcon,
                onClick: () => handleMenuItemClick('potcar'),
              },
              {
                action: 'incar',
                label: 'INCAR',
                icon: PlusIcon,
                onClick: () => handleMenuItemClick('incar'),
              },
              {
                action: 'kpoints',
                label: 'KPOINTS',
                icon: PlusIcon,
                onClick: () => handleMenuItemClick('kpoints'),
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
                action: 'abacus-input',
                label: 'INPUT',
                icon: PlusIcon,
                onClick: () => handleMenuItemClick('poscar'),
              },
              {
                action: 'abacus-stru',
                label: 'STRU',
                icon: PlusIcon,
                onClick: () => handleMenuItemClick('potcar'),
              },
              {
                action: 'abacus-kpt',
                label: 'KPT',
                icon: PlusIcon,
                onClick: () => handleMenuItemClick('kpoints'),
              },
            ],
          },
        ],
      },
      // {
      //   action: 'molecule',
      //   label: 'Molecule',
      //   icon: PlusIcon,
      //   onClick: () => handleMenuItemClick('edit'),
      // },
      // {
      //   action: 'fem',
      //   label: 'FEM',
      //   icon: PlusIcon,
      //   onClick: () => handleMenuItemClick('edit'),
      // },
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
        onClick: () => handleMenuItemClick('vasp'),
      },
      {
        action: 'abacus',
        label: 'ABACUS',
        icon: ABACUSIcon,
        onClick: () => handleMenuItemClick('abacus'),
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
  // {
  //   action: 'outputs',
  //   label: 'Post',
  //   icon: WrenchIcon,
  //   onClick: () => handleMenuItemClick('VASP/outputs'),
  // },
  {
    action: 'pipeline',
    label: 'Pipeline',
    icon: EllipsisVerticalIcon,
    arrow: true,
    onClick: () => handleMenuItemClick('VASP/outputs'),
    subContextMenuItems: [
      {
        action: 'pipeline/abacus',
        label: 'ABACUS',
        icon: ABACUSIcon,
        arrow: true,
        onClick: () => handleMenuItemClick('VASP/outputs'),
        subContextMenuItems: [
          {
            action: 'abacus-unit-test',
            label: 'UnitTest',
            icon: EllipsisHorizontalIcon,
            onClick: () => handleMenuItemClick('VASP/outputs'),
          },
        ],
      },
    ],
  },
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
