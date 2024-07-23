import { NavGroup } from '@/@types/navigation'

export const navigation: Array<NavGroup> = [
  {
    title: 'Guides',
    links: [
      { title: 'Introduction', href: `/workflow` },
      { title: 'Design', href: `/workflow/design` },
      { title: 'Quickstart', href: `/workflow/quickstart` },
      { title: 'Logic', href: '/workflow/how-it-works' },
    ],
  },
  {
    title: 'Nodes',
    links: [
      { title: 'VASP', href: '/workflow/nodes/vasp' },
      { title: 'ABACUS', href: '/workflow/nodes/abacus' },
      { title: 'ABACUS SIAB', href: '/workflow/nodes/abacus_siab' },
      // { title: 'BasicExecutor', href: '/workflow/execution/NodeExecutor' },
      // { title: 'VASPExecutor', href: '/workflow/execution/VaspNodeExecutor' },
      // { title: 'Interfaces - 工作流创建界面', href: `/workflow/interfaces` },
      // { title: 'API - 通过代码创建工作流', href: `/workflow/api` },
      // { title: 'Development', href: `/workflow/development` },

      // { title: '运行状态提示', href: '/workflow/status' },
    ],
  },
  {
    title: 'Models',
    links: [
      { title: 'Workflow', href: `/workflow/models/workflow` },
      { title: 'Node', href: `/workflow/models/node` },
    ],
  },
  {
    title: 'Interface',
    links: [
      { title: 'Canvas', href: `/workflow/interface/canvas` },
      { title: 'Node', href: `/workflow/interface/node` },
    ],
  },
]
