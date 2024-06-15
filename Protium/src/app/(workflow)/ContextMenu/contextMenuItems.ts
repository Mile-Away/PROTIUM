import { ContextMenuItemProps } from '@/@types/workflow';
import {
  ArrowPathRoundedSquareIcon,
  CodeBracketIcon,
  CubeIcon,
  DocumentDuplicateIcon,
  EyeSlashIcon,
  PlusIcon,
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
        ],
      },
      {
        action: 'molecule',
        label: 'Molecule',
        icon: PlusIcon,
        onClick: () => handleMenuItemClick('edit'),
      },
      {
        action: 'fem',
        label: 'FEM',
        icon: PlusIcon,
        onClick: () => handleMenuItemClick('edit'),
      },
    ],
  },
  {
    action: 'convert',
    label: 'Convert',
    icon: ArrowPathRoundedSquareIcon,
    arrow: true,
    onClick: () => handleMenuItemClick('edit'),
    subContextMenuItems: [
      {
        action: 'poscar2cif',
        label: 'POSCAR to CIF',
        icon: ArrowPathRoundedSquareIcon,
        onClick: () => handleMenuItemClick('edit'),
      },
      {
        action: 'structure fine-tune',
        label: '结构微调',
        icon: ArrowPathRoundedSquareIcon,
        onClick: () => handleMenuItemClick('edit'),
      },
      {
        action: 'structure matching',
        label: '结构匹配',
        icon: ArrowPathRoundedSquareIcon,
        onClick: () => handleMenuItemClick('edit'),
      },
      {
        action: 'random structure',
        label: '生成随机结构',
        icon: ArrowPathRoundedSquareIcon,
        onClick: () => handleMenuItemClick('edit'),
      },
    ],
  },
  {
    action: 'model',
    label: 'Model',
    icon: CubeIcon,
    onClick: () => handleMenuItemClick('edit'),
  },
  {
    action: 'solver',
    label: 'Solver',
    icon: CodeBracketIcon,
    arrow: true,
    subContextMenuItems: [
      {
        action: 'vasp',
        label: 'VASP',
        icon: CodeBracketIcon,
        onClick: () => handleMenuItemClick('vasp'),
      },
      {
        action: 'lammps',
        label: 'LAMMPS',
        icon: CodeBracketIcon,
        onClick: () => handleMenuItemClick('edit'),
      },
      {
        action: 'abinit',
        label: 'ABINIT',
        icon: CodeBracketIcon,
        onClick: () => handleMenuItemClick('edit'),
      },
      {
        action: 'quantum espresso',
        label: 'Quantum Espresso',
        icon: CodeBracketIcon,
        onClick: () => handleMenuItemClick('edit'),
      },
    ],
  },
  {
    action: 'outputs',
    label: 'Post',
    icon: WrenchIcon,
    onClick: () => handleMenuItemClick('VASP/outputs'),
  },
];

export const nodeContextMenuItems: ContextMenuItemProps[] = [
  {
    action: 'hidden',
    label: 'Hidden',
    icon: EyeSlashIcon,
    onClick: () => handleMenuItemClick('edit'),
  },
  {
    action: 'duplicate',
    label: 'Duplicate',
    icon: DocumentDuplicateIcon,
    arrow: false,
    onClick: () => handleMenuItemClick('edit'),
  },
  {
    action: 'delete',
    label: 'Delete',
    icon: TrashIcon,
    arrow: false,
    onClick: () => handleMenuItemClick('edit'),
  },
];
