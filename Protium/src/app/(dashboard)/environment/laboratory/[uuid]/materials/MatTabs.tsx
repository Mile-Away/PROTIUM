import { rectSortingStrategy } from '@dnd-kit/sortable';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import {
  InformationCircleIcon,
  PaperClipIcon,
  RectangleGroupIcon,
} from '@heroicons/react/24/outline';
import { GridContainer } from './GridContainer';
import { Sortable, Props as SortableProps } from './Sortable';

const categories = [
  {
    icon: RectangleGroupIcon,
    name: 'Layout',
    posts: [
      {
        id: 1,
        title: 'Does drinking coffee make you smarter?',
        date: '5h ago',
        commentCount: 5,
        shareCount: 2,
      },
      {
        id: 2,
        title: "So you've bought coffee... now what?",
        date: '2h ago',
        commentCount: 3,
        shareCount: 2,
      },
    ],
  },
  {
    icon: InformationCircleIcon,
    name: 'Info',
    posts: [
      {
        id: 1,
        title: 'Is tech making coffee better or worse?',
        date: 'Jan 7',
        commentCount: 29,
        shareCount: 16,
      },
      {
        id: 2,
        title: 'The most innovative things happening in coffee',
        date: 'Mar 19',
        commentCount: 24,
        shareCount: 12,
      },
      {
        id: 3,
        title: "The worst advice we've ever heard about coffee",
        date: '4d ago',
        commentCount: 1,
        shareCount: 2,
      },
      {
        id: 4,
        title: "The worst advice we've ever heard about coffee",
        date: '4d ago',
        commentCount: 1,
        shareCount: 2,
      },
      {
        id: 5,
        title: "The worst advice we've ever heard about coffee",
        date: '4d ago',
        commentCount: 1,
        shareCount: 2,
      },
    ],
  },
  {
    icon: PaperClipIcon,
    name: 'Logs',
    posts: [
      {
        id: 1,
        title: 'Ask Me Anything: 10 answers to your questions about coffee',
        date: '2d ago',
        commentCount: 9,
        shareCount: 5,
      },
      {
        id: 2,
        title: "The worst advice we've ever heard about coffee",
        date: '4d ago',
        commentCount: 1,
        shareCount: 2,
      },
      {
        id: 3,
        title: "The worst advice we've ever heard about coffee",
        date: '4d ago',
        commentCount: 1,
        shareCount: 2,
      },
      {
        id: 4,
        title: "The worst advice we've ever heard about coffee",
        date: '4d ago',
        commentCount: 1,
        shareCount: 2,
      },
      {
        id: 5,
        title: "The worst advice we've ever heard about coffee",
        date: '4d ago',
        commentCount: 1,
        shareCount: 2,
      },
    ],
  },
];

const props: Partial<SortableProps> = {
  adjustScale: true,
  Container: (props: any) => <GridContainer {...props} columns={5} />,
  strategy: rectSortingStrategy,
  wrapperStyle: () => ({
    width: 140,
    height: 140,
  }),
};

export default function MatTabs() {
  return (
    <TabGroup as="div" className="w-full py-8">
      <TabList className="flex gap-4">
        {categories.map(({ icon: Icon, name }) => (
          <Tab
            key={name}
            className="flex items-center  rounded-full px-3 py-1 text-sm/6 font-semibold text-white focus:outline-none data-[hover]:bg-white/5 data-[selected]:bg-white/10 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
          >
            <Icon className="mr-2 h-4 w-4" />
            {name}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="mt-3 w-full rounded-xl bg-white/5 p-3">
        {categories.map(({ name, posts }) => (
          <TabPanel key={name} className="">
            {name === 'Layout' ? (
              <Sortable
                {...props}
                activationConstraint={{
                  delay: 250,
                  tolerance: 5,
                }}
              />
            ) : (
              <ul>
                {posts.map((post) => (
                  <li
                    key={post.id}
                    className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5"
                  >
                    <a href="#" className="font-semibold text-white">
                      <span className="absolute inset-0" />
                      {post.title}
                    </a>
                    <ul className="flex gap-2 text-white/50" aria-hidden="true">
                      <li>{post.date}</li>
                      <li aria-hidden="true">&middot;</li>
                      <li>{post.commentCount} comments</li>
                      <li aria-hidden="true">&middot;</li>
                      <li>{post.shareCount} shares</li>
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
