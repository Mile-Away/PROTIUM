import { genClickMaterialDir } from '@/app/(dashboard)/environment/laboratory/[uuid]/materials/[...dirs]/TreeSortable/utilities';
import { RootReducerProps } from '@/app/store';
import {
  Description,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
  Radio,
  RadioGroup,
  Textarea,
} from '@headlessui/react';
import { CalendarIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import {
  BeakerIcon,
  CheckIcon,
  InboxIcon,
  MapPinIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const plans = [
  {
    name: 'Repository',
    logo: Squares2X2Icon,
    ram: '12GB',
    cpus: '6 CPUs',
    disk: '256GB SSD disk',
    description: 'A sub repository for storing materials',
  },
  {
    name: 'Plate',
    logo: InboxIcon,
    ram: '16GB',
    cpus: '8 CPUs',
    disk: '512GB SSD disk',
    description: 'A plate for storing materials',
  },
  {
    name: 'Container',
    logo: BeakerIcon,
    ram: '32GB',
    cpus: '12 CPUs',
    disk: '1TB SSD disk',
    description: 'A container for storing materials',
  },
];

export default function AddNew() {
  const currentUrl = usePathname();

  const [selected, setSelected] = useState(plans[0]);
  const { activeItem } = useSelector(
    (state: RootReducerProps) => state.laboratory,
  );

  return (
    <div className=" relative mt-6 flex-1 px-4 sm:px-6">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <nav className="flex" aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-2">
              {activeItem?.dirs?.map((dir, idx) => (
                <li key={dir}>
                  <div className="flex items-center">
                    {idx === 0 ? null : (
                      <ChevronRightIcon
                        className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500"
                        aria-hidden="true"
                      />
                    )}
                    <Link
                      href={
                        genClickMaterialDir(
                          currentUrl,
                          activeItem?.dirs?.slice(0, idx + 1),
                        )?.toString() || '#'
                      }
                      className="text-xs font-medium text-gray-400 hover:text-white"
                    >
                      {dir}
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
          <div className="mt-2 flex items-center  ">
            {activeItem?.type === 'Plate' ? (
              <InboxIcon className="mr-2 h-6 w-6 dark:text-white" />
            ) : activeItem?.type === 'Repository' ? (
              <Squares2X2Icon className="mr-2 h-6 w-6 dark:text-white" />
            ) : activeItem?.type === 'Container' ? (
              <BeakerIcon className="mr-2 h-6 w-6 dark:text-white" />
            ) : null}
            <h2 className=" text-xl font-bold leading-7 text-white sm:truncate sm:text-2xl sm:tracking-tight">
              {activeItem?.id}
            </h2>
          </div>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-xs text-gray-400">
              <CalendarIcon
                className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-500"
                aria-hidden="true"
              />
              Use on January 9, 2020
            </div>
          </div>
        </div>
        <div className="mt-5 flex items-center lg:ml-4 lg:mt-0">
          <div className="flex h-20 w-48 justify-between rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 p-4 shadow-lg">
            <div className="flex flex-col">
              <div className="mb-2 flex items-center justify-start">
                <MapPinIcon className="mr-2 h-4 w-4 text-white" />
                <h2 className="font-display text-sm font-semibold text-white">
                  Position
                </h2>
              </div>
              <div className="ml-6 flex items-center gap-2 text-sm/6">
                <div className="font-semibold text-white">
                  X: {activeItem?.position?.x || 1}
                </div>
                <div className="font-semibold text-white">
                  Y: {activeItem?.position?.y || 1}
                </div>
              </div>
            </div>
            <div className=" mr-4 flex items-center justify-center font-display text-3xl font-bold">
              A1
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 w-full">
        <Fieldset className="space-y-6 rounded-xl bg-white/5 p-6 sm:p-10">
          <Legend className="text-base/7 font-semibold text-white">
            Item details
          </Legend>
          <Field>
            <Label className="text-sm/6 font-medium text-white">Name</Label>
            <Input
              className={clsx(
                'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
              )}
            />
          </Field>
          <Field>
            <Label className="text-sm/6 font-medium text-white">Type</Label>
            <Description className="text-sm/6 text-white/50">
              Please choose the type of item you are adding.
            </Description>

            <div className="mx-auto mt-2 w-full max-w-md">
              <RadioGroup
                // by="name"
                value={selected}
                onChange={setSelected}
                aria-label="Server size"
                className="space-y-2"
              >
                {plans.map((plan) => (
                  <Radio
                    key={plan.name}
                    value={plan}
                    className="group relative flex cursor-pointer rounded-lg bg-white/5 px-5 py-4 text-white shadow-md transition focus:outline-none data-[checked]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="text-sm/6">
                        <div className="flex items-center">
                          <plan.logo className="mr-2 h-4 w-4" />
                          <p className="font-semibold text-white">
                            {plan.name}
                          </p>
                        </div>
                        <div className="flex gap-2 text-white/50">
                          {/* <div>{plan.ram}</div>
                          <div aria-hidden="true">&middot;</div>
                          <div>{plan.cpus}</div>
                          <div aria-hidden="true">&middot;</div>
                          <div>{plan.disk}</div> */}
                          <div>{plan.description}</div>
                        </div>
                      </div>
                      <CheckIcon className="size-6 text-white opacity-0 transition group-data-[checked]:opacity-100" />
                    </div>
                  </Radio>
                ))}
              </RadioGroup>
            </div>
          </Field>

          <Field>
            <Label className="text-sm/6 font-medium text-white">
              Description
            </Label>
            <Description className="text-sm/6 text-white/50">
              Please provide a brief description of the item
            </Description>
            <Textarea
              className={clsx(
                'mt-3 block w-full resize-none rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
              )}
              rows={3}
            />
          </Field>
        </Fieldset>
      </div>
    </div>
  );
}
