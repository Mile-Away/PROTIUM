import { NavbarFullWidthPreviewProps } from '@/@types/navbar';
import { EnvelopeIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { GitHubIcon } from '../SocialIcons';

import Logo from '@/@brand/Logo';
import { DocumentSite } from '@/config';
import { ABACUSIcon, AISSquareIcon, DeePMDIcon, DPGenIcon } from '../Icons';
import NavbarFullWidthPreview from './NavbarFullWidthPreview';

const options = {
  'Molecule Dynamics': [
    {
      name: 'DeePMD-kit',
      description: 'Learn how to use DeePMD-kit',
      href: `/space/DeePMD-kit`,
      icon: DeePMDIcon,
    },
    {
      name: 'DPGen',
      description: 'Learn from DPGen publications',
      href: `/dp-gen`,
      icon: DPGenIcon,
    },
    {
      name: 'DeePMD-kit',
      description: 'Learn how to use DeePMD-kit',
      href: `${DocumentSite}/DeePMD-kit`,
      icon: DeePMDIcon,
    },
    {
      name: 'DPGen',
      description: 'Learn from DPGen publications',
      href: `${DocumentSite}/DeePMD-kit`,
      icon: DPGenIcon,
    },
    {
      name: 'DeePMD-kit',
      description: 'Learn how to use DeePMD-kit',
      href: `${DocumentSite}/DeePMD-kit`,
      icon: DeePMDIcon,
    },
    {
      name: 'DPGen',
      description: 'Learn from DPGen publications',
      href: `${DocumentSite}/DeePMD-kit`,
      icon: DPGenIcon,
    },
    {
      name: 'DeePMD-kit',
      description: 'Learn how to use DeePMD-kit',
      href: `${DocumentSite}/DeePMD-kit`,
      icon: DeePMDIcon,
    },
    {
      name: 'DPGen',
      description: 'Learn from DPGen publications',
      href: `${DocumentSite}/DeePMD-kit`,
      icon: DPGenIcon,
    },
  ],
  'Density Functional Theory': [
    {
      name: 'ABACUS',
      description: 'Learn how to use ABACUS',
      href: `${DocumentSite}/abacus`,
      icon: ABACUSIcon,
    },
  ],
  'Finite Element Method': [
    {
      name: 'DeepModeling',
      description: 'Get all of our website information',
      href: `${DocumentSite}`,
      icon: Logo,
    },
    {
      name: 'DeePMD-kit',
      description: 'Learn how to use DeePMD-kit',
      href: `${DocumentSite}/DeePMD-kit`,
      icon: DeePMDIcon,
    },
  ],
  'Community Platform': [
    {
      name: 'DeepModeling',
      description: 'Get all of our website information',
      href: `${DocumentSite}`,
      icon: Logo,
    },
    {
      name: 'AIS-Square',
      description: 'Learn how to use DeePMD-kit',
      href: `${DocumentSite}/DeePMD-kit`,
      icon: AISSquareIcon,
    },
  ],
};

const callsToAction = [
  { name: 'See All Projects', href: '/space', icon: RocketLaunchIcon },
  {
    name: 'Follow in Github',
    href: 'https://github.com/deepmodeling',
    icon: GitHubIcon,
  },
  { name: 'Contact us', href: '#', icon: EnvelopeIcon },
];

export default function Projects(
  props: Omit<
    NavbarFullWidthPreviewProps,
    'callsToAction' | 'buttonName' | 'options'
  >,
) {
  return (
    <NavbarFullWidthPreview
      buttonName="project"
      options={options}
      callsToAction={callsToAction}
      {...props}
    />
  );
}
