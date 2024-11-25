import { rectSortingStrategy } from '@dnd-kit/sortable';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { GridContainer } from './GridSortable/GridContainer';
import { GridSortable } from './GridSortable/GridSortable';

export default function MatTabs({
  categories,
  gridContainerColumns = 5,
}: {
  categories: any[];
  gridContainerColumns?: number;
}) {

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
              <GridSortable
                gridContainerColumns={gridContainerColumns}
                adjustScale
                // Container={(props: any) => (
                //   <GridContainer {...props} columns={gridContainerColumns} />
                // )}
                strategy={rectSortingStrategy}
                wrapperStyle={() => ({
                  width: 140,
                  height: 140,
                })}
                activationConstraint={{
                  // delay: 250,
                  distance: 1,
                  // tolerance: 5,
                }}
              />
            ) : (
              <ul>
                {posts.map((post: any) => (
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
