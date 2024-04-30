import handleMenuItemClick from "./handleMenuItemClick";
import { ContextMenuItemProps } from "@/@types/workflow";
import { ArrowPathRoundedSquareIcon, CodeBracketIcon, CubeIcon, DocumentDuplicateIcon, EyeSlashIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

const contextMenuItems: ContextMenuItemProps[] = [
    {
      action: 'components',
      label: '基础件',
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
      label: '转换器',
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
      label: '模型',
      icon: CubeIcon,
      onClick: () => handleMenuItemClick('edit'),
    },
    {
      action: 'solver',
      label: '求解器',
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
      action: 'hidden',
      label: '隐藏',
      icon: EyeSlashIcon,
      onClick: () => handleMenuItemClick('edit'),
    },
    {
      action: 'copy',
      label: '复制',
      icon: DocumentDuplicateIcon,
      arrow: false,
      onClick: () => handleMenuItemClick('edit'),
    },
    {
      action: 'delete',
      label: '删除',
      icon: TrashIcon,
      arrow: false,
      onClick: () => handleMenuItemClick('edit'),
    },
  ];

  export default contextMenuItems;