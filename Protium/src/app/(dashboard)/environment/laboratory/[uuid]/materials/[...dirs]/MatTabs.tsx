import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';

export interface MatTabProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  name: string;
  panel: React.ReactNode;
}

export default function MatTabs({
  tabs,
  gridContainerColumns = 5,
}: {
  tabs: MatTabProps[];
  gridContainerColumns?: number;
}) {
  return (
    <TabGroup as="div" className="w-full py-8">
      <TabList className="flex gap-4">
        {tabs.map(({ icon: Icon, name }) => (
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
        {tabs.map(({ name, panel }) => (
          <TabPanel key={name} className="">
            {panel}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
