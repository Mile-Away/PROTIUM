import { NavGroup } from '@/@types/navigation'

export const navigation: Array<NavGroup> = [
  {
    title: 'Guides',
    links: [
      { title: 'Quickstart', href: `/workflow/quickstart` },
      { title: 'Design', href: `/workflow/design` },
    ],
  },
  {
    title: 'Resources',
    links: [
      { title: 'API', href: `/workflow/api` },
      { title: 'Development', href: `/workflow/development` },
    ],
  },
]
