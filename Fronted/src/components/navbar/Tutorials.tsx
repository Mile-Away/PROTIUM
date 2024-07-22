import { NavbarFullWidthProps } from '@/@types/navbar';
import { DocumentSite } from '@/config';
import { BookmarkSquareIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { DeePMDIcon, DPGenIcon } from '../Icons';
import { GitHubIcon } from '../SocialIcons';
import NavbarFullWidth from './NavbarFullWidth';

const resources = [
  {
    name: 'Review',
    description: 'Get review of our projects',
    href: `${DocumentSite}`,
    icon: BookmarkSquareIcon,
  },
  {
    name: 'DeePMD-kit',
    description: 'Learn from DeePMD-kit publications',
    href: `${DocumentSite}/deepmd-kit`,
    icon: DeePMDIcon,
  },
  {
    name: 'DPGen',
    description: 'Learn from DPGen publications',
    href: `${DocumentSite}/deepmd-kit`,
    icon: DPGenIcon,
  },
];

const callsToAction = [
  {
    name: 'Follow in Github',
    href: 'https://github.com/Protium',
    icon: GitHubIcon,
  },
  { name: 'Contact us', href: '#', icon: EnvelopeIcon },
];

export default function Tutorial(
  props: Omit<
    NavbarFullWidthProps,
    'solutions' | 'callsToAction' | 'buttonName'
  >,
) {
  return (
    <NavbarFullWidth
      buttonName="tutorial"
      solutions={resources}
      callsToAction={callsToAction}
      numberOfCallsToAction={2}
      numberOfSolutions={3}
      {...props}
    />
  );
}
