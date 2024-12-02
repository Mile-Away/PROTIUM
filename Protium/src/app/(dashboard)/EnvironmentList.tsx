'use client';
import { WorkflowProps } from '@/@types/workflow';
import { RootReducerProps, useAppDispatch } from '@/app/store';
import PrimaryButton from '@/components/elements/buttons/PrimaryButtons';
import createAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { fetchEnvironmentConfig } from '@/store/environment/middleware';
import {
  Button,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import {
  ArrowsUpDownIcon,
  BeakerIcon,
  ChevronDownIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import EnvironmentModalButton from './environment/CreateNew';

export interface LaboratoryEnvProps {
  id: number;
  uuid: string;
  name: string;
  address: string;
  ip_address: string;
  description: string;
}

export interface CalculationEnvProps {
  id: number;
  uuid: string;
  name: string;
  ip_address: string;
  description: string;
}

export interface EnvironmentListProps {
  experiment_env: LaboratoryEnvProps;
  calculation_env: CalculationEnvProps;
}

const EnvironmentList: React.FC = () => {
  const url = usePathname();
  // 判断这个用户是否已有 environment 配置
  const jwtAxios = createAxiosWithInterceptors();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { uuid, name, ip_address, address, description } = useSelector(
    (state: RootReducerProps) => state.environment.laboratory,
  );

  const [contextMenuPos, setContextMenuPos] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WorkflowProps | null>(null);
  const [expanded, setExpanded] = useState(false);

  // const fetchEnv = async () => {
  //   try {
  //     const res = await jwtAxios.get<EnvironmentListProps>(
  //       '/environment/judge/',
  //     );

  //     console.log(res);
  //     if (res.status === 200) {
  //       if (res.data.experiment_env) {
  //         setExperimentEnv(res.data.experiment_env);
  //       }
  //       if (res.data.calculation_env) {
  //         setCalculationEnv(res.data.calculation_env);
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    dispatch(fetchEnvironmentConfig());
  }, []);

  const handleCloseContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuVisible(false);
    setSelectedItem(null);
  };

  return (
    <Disclosure
      defaultOpen
      as="div"
      className="-mt-5 flex h-fit flex-col border-t pt-4 dark:border-white/10"
    >
      <div
        className={clsx('inert group/expand flex w-full flex-col gap-y-4 px-2')}
      >
        <div
          className={clsx(
            'mb-4 flex w-full items-center justify-between gap-x-2',
          )}
        >
          <div className=" flex items-center justify-center gap-2">
            <span className=" font-display text-sm font-bold">Environment</span>
            <DisclosureButton
              onClick={() => setExpanded(!expanded)}
              name="button"
              type="button"
              className="flex items-center rounded bg-transparent p-0.5 opacity-0 transition-opacity duration-300 ease-in-out hover:bg-neutral-300/20 group-hover/expand:opacity-100 dark:hover:bg-neutral-700/20"
            >
              <ChevronDownIcon
                className={clsx(
                  'h-4 w-4 transition-transform duration-300 ease-in-out dark:text-white',
                  expanded && '-rotate-90 transform ',
                )}
              />
            </DisclosureButton>
          </div>
          <div className="flex items-center justify-center">
            <PrimaryButton
              size="sm"
              onClick={() => router.push('/environment/config')}
              className={clsx(
                'flex items-center gap-1 ',
                url.includes('config')
                  ? 'dark:bg-indigo-600'
                  : 'bg-transparent hover:bg-neutral-300/30 dark:hover:bg-white/5',
              )}
            >
              <ArrowsUpDownIcon className="h-4 w-4 dark:text-white" />
            </PrimaryButton>
          </div>
        </div>
      </div>
      <DisclosurePanel
        transition
        className="inert flex origin-top flex-col items-center gap-4 pb-2 transition duration-200 ease-in-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
      >
        {uuid ? (
          <Button
            type="button"
            onClick={() => router.push(`/environment/laboratory/${uuid}`)}
            className={clsx(
              'relative flex h-20 w-full items-center justify-center rounded-lg border-neutral-300 px-8 py-4 focus:outline-none',
              url.includes(uuid) &&
                ' bg-gradient-to-r  from-sky-100 to-teal-100 dark:from-sky-600  dark:to-indigo-600',
            )}
          >
            <div className="absolute -inset-px -z-10 rounded-lg border border-transparent opacity-100 [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.slate.800)]" />
            <div className="absolute -inset-px -z-10 rounded-lg border border-transparent opacity-0 [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.slate.800)]" />
            <div className=" mr-4 w-8">
              <BeakerIcon className="h-fit w-full text-gray-400 dark:text-gray-300" />
            </div>

            <div className="flex flex-1 flex-col justify-center py-2 text-start">
              <p className="text line-clamp-1 font-semibold text-gray-900 dark:text-white">
                {name}
              </p>
              <p className=" line-clamp-1 text-xs ">
                {address} ({ip_address})
              </p>
            </div>
          </Button>
        ) : (
          <EnvironmentModalButton>
            <BeakerIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300" />
            <span className="ml-2 block text-xs font-semibold text-gray-900 dark:text-white">
              Create Laboratory Environment
            </span>
          </EnvironmentModalButton>
        )}
        <EnvironmentModalButton>
          <CpuChipIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300" />
          <span className="ml-2 block text-xs font-semibold text-gray-900 dark:text-white">
            Create Calculation Environment
          </span>
        </EnvironmentModalButton>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default EnvironmentList;
