import {
  AdjustmentsHorizontalIcon,
  CubeTransparentIcon,
  DocumentTextIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

export const dashboardNavi = [
  {
    // name: 'Dashboard',
    name: 'sidebar.dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    current: true,
  },
  {
    name: 'sidebar.space',
    href: '/dashboard/space',
    icon: CubeTransparentIcon,
    current: false,
  },
  // {
  //   name: 'sidebar.discussion',
  //   href: '/dashboard/discussion',
  //   icon: UsersIcon,
  //   current: false,
  // },
  {
    name: 'sidebar.manuscript',
    href: '/dashboard/manuscript',
    icon: DocumentTextIcon,
    current: false,
  },
  {
    name: 'sidebar.workflow',
    href: '/dashboard/workflow',
    icon: AdjustmentsHorizontalIcon,
    current: false,
  },
  // {
  //   name: 'Template',
  //   href: '#',
  //   icon: DocumentDuplicateIcon,
  //   current: false,
  // },
  // { name: 'WorkFlow', href: '#', icon: PlayIcon, current: false },
];

export const workshopNavi = [
  {
    // name: 'Dashboard',
    name: 'sidebar.dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    current: true,
  },
  {
    name: 'sidebar.space',
    href: '/dashboard/space',
    icon: CubeTransparentIcon,
    current: false,
  },
  // {
  //   name: 'sidebar.discussion',
  //   href: '/dashboard/discussion',
  //   icon: UsersIcon,
  //   current: false,
  // },
  {
    name: 'sidebar.manuscript',
    href: '/dashboard/manuscript',
    icon: DocumentTextIcon,
    current: false,
  },

  // {
  //   name: 'Template',
  //   href: '#',
  //   icon: DocumentDuplicateIcon,
  //   current: false,
  // },
  // { name: 'WorkFlow', href: '#', icon: PlayIcon, current: false },
];
