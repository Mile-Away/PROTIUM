import { NavbarFullWidthProps } from '@/@types/navbar';
import { DocumentSite } from '@/config';
import { BookmarkSquareIcon, EnvelopeIcon, PuzzlePieceIcon, RectangleGroupIcon, SquaresPlusIcon } from '@heroicons/react/24/outline';
import { DeePMDIcon, DPGenIcon } from '../Icons';
import { GitHubIcon } from '../SocialIcons';
import NavbarFullWidth from './NavbarFullWidth';

const resources = [
  {
    name: 'Overview',
    description: 'Get review of our projects',
    href: `${DocumentSite}`,
    icon: BookmarkSquareIcon,
  },
  {
    name: 'Workflow',
    description: 'Learn from DeePMD-kit publications',
    href: `${DocumentSite}/deepmd-kit`,
    icon: RectangleGroupIcon,
  },
  {
    name: 'Flociety',
    description: 'Learn from DPGen publications',
    href: `${DocumentSite}/deepmd-kit`,
    icon: PuzzlePieceIcon,
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
