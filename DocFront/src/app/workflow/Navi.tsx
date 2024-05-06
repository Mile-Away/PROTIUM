import { NavGroup } from '@/@types/navigation'

export const navigation: Array<NavGroup> = [
  {
    title: 'Guides',
    links: [
      { title: 'Introduction', href: `/workflow` },
      { title: 'Design', href: `/workflow/design` },
      { title: 'Quickstart', href: `/workflow/quickstart` },
    ],
  },
  {
    title: 'Resources',
    links: [
      { title: 'Interfaces - 工作流创建界面', href: `/workflow/interfaces` },
      { title: 'API - 通过代码创建工作流', href: `/workflow/api` },
      // { title: 'Development', href: `/workflow/development` },
      { title: 'Nodes - 查看所有节点详情', href: '/workflow/nodes' },
      { title: '提交的工作流是如何运行的', href: '/workflow/how-it-works' },
      { title: '如何确定节点运行状态', href: '/workflow/work' },
    ],
  },
  {
    title: 'Models',
    links: [
      { title: 'Workflow', href: `/workflow/models/workflow` },
      { title: 'Node', href: `/workflow/models/node` },
    ],
  },
]
