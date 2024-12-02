import PrimaryButton from '@/components/elements/buttons/PrimaryButtons';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { PuzzlePieceIcon } from '@heroicons/react/20/solid';
import { PlusIcon } from '@heroicons/react/24/outline';
import { CalculationEnvProps, LaboratoryEnvProps } from '../../EnvironmentList';
import LabConfigTemp, { LabConfigTempProps } from './LabConfigTemp';

export interface CategoryProps {
  name: string;
  template: React.FC<LabConfigTempProps>;
  currentConfig: LaboratoryEnvProps | CalculationEnvProps;
  configs: LaboratoryEnvProps[] | CalculationEnvProps[];
}

const categories: CategoryProps[] = [
  {
    name: 'Laboratory Config',
    template: LabConfigTemp,
    currentConfig: {
      id: 1,
      uuid: '1',
      name: 'Lab 1',
      address: '123 Main St',
      ip_address: '',
      description: 'This is a lab',
    },
    configs: [
      {
        id: 1,
        uuid: '1',
        name: 'Lab 1',
        address: '123 Main St',
        ip_address: '',
        description: 'This is a lab',
      },
    ],
  },
  {
    name: 'Calculation Config',
    template: LabConfigTemp,
    currentConfig: {
      id: 1,
      uuid: '1',
      name: 'Calculation 1',
      ip_address: '',
      description: 'This is a calculation',
    },
    configs: [],
  },
];

export default function EnvConfigTabs() {
  return (
    <div className="flex w-full">
      <div className="w-full">
        <TabGroup>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center">
                <PuzzlePieceIcon className="mr-2 h-6 w-6" />
                <h2 className=" font-display font-semibold">
                  Environment Configuration
                </h2>
              </div>
              <div className="mx-4 h-6 border-l border-gray-300"></div>
              <TabList className="flex gap-4">
                {categories.map(({ name }) => (
                  <Tab
                    key={name}
                    className="rounded px-3 py-1 text-sm/6 font-semibold text-white 
                    focus:outline-none data-[hover]:bg-white/5 
                    data-[selected]:bg-white/10 data-[selected]:data-[hover]:bg-white/10 
                    data-[focus]:outline-1 data-[focus]:outline-white"
                  >
                    {name}
                  </Tab>
                ))}
              </TabList>
            </div>
            <div>
              <PrimaryButton size="md" className="">
                <div className="flex items-center">
                  <PlusIcon className="mr-2 h-4 w-4 dark:text-white" />
                  <span className="">New</span>
                </div>
              </PrimaryButton>
            </div>
          </div>
          <TabPanels className="mt-3 h-full border-t border-white/10 pt-3">
            {categories.map((item) => (
              <TabPanel key={item.name}>
                <item.template
                  currentConfig={item.currentConfig}
                  configs={item.configs}
                />
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
