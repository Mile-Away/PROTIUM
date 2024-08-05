import { NavGroup } from '@/@types/navigation'

export const navigation: Array<NavGroup> = [
  {
    title: 'Guides',
    links: [
      { title: 'Introduction', href: `/workflow` },
      { title: 'Quickstart', href: `/workflow/quickstart` },
      { title: 'Design', href: `/workflow/design` },
    ],
  },
  {
    title: 'Nodes',
    links: [
      { title: 'Node', href: '/workflow/nodes' },
      // { title: 'Node - Mapping', href: '/workflow/nodes/mapping' },
      { title: 'ABACUS SIAB', href: '/workflow/nodes/abacus_siab' },
    ],
  },
  {
    title: 'Interface',
    links: [{ title: 'Interface', href: `/workflow/interface` }],
  },
  {
    title: 'Execution',
    links: [
      { title: 'Execution', href: '/workflow/execution/how-it-works' },
      { title: 'Executor', href: '/workflow/execution' },
    ],
  },
  {
    title: 'API',
    links: [
      { title: 'API', href: '/workflow/api' },
      { title: 'CLI', href: '/workflow/cli' },
    ],
  },
]
