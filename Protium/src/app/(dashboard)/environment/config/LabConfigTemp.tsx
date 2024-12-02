import { CursorArrowRippleIcon } from '@heroicons/react/24/outline';
import { CiBoxList } from 'react-icons/ci';
import { CategoryProps } from './Tabs';
import { ConfigList } from './ConfigList';

export interface LabConfigTempProps {
  currentConfig: CategoryProps['currentConfig'];
  configs: CategoryProps['configs'];
}

interface TitleProps {
  children: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ children }) => {
  return <div className="flex items-center">{children}</div>;
};

const LabConfigTemp: React.FC<LabConfigTempProps> = ({
  currentConfig,
  configs,
}) => {
  return (
    <div className="flex h-full">
      <div className=" h-full">
        <Title>
          <CursorArrowRippleIcon className="mr-2 h-4 w-4" />
          <h3 className="text-sm font-semibold">Current Configuration</h3>
        </Title>

        <div className="flex flex-col items-start">
          <Title>
            <CiBoxList className="mr-2 h-4 w-4" />
            <h3 className="text-sm  font-semibold">Configuration List</h3>
          </Title>
          <div>
            {configs.map((config) => (
              <div key={config.id} className="flex items-center">
                <span>{config.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-4 h-full border-l border-gray-300"></div>
      <div className="h-full flex-1">
        <ConfigList />
      </div>
    </div>
  );
};

export default LabConfigTemp;
