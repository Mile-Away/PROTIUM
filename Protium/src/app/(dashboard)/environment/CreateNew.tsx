import { RootReducerProps, useAppDispatch } from '@/app/store';
import createAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import {
  LaboratoryStateProps,
  setLaboratoryData,
} from '@/store/environment/laboratorySlice';
import { createLaboratoryEnv } from '@/store/environment/middleware';
import {
  Button,
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Field,
  Fieldset,
  Input,
  Label,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Textarea,
} from '@headlessui/react';
import { LinkIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

interface PanelProps {
  close: () => void;
}

type FormDataProps = Omit<LaboratoryStateProps, 'uuid'>;

const CreateLabEnvPanel: React.FC<PanelProps> = ({ close }) => {
  const jwtAxios = createAxiosWithInterceptors();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
      isDirty,
      isLoading,
      disabled,
      submitCount,
      isSubmitting,
      isValid,
      touchedFields,
    },
  } = useForm<FormDataProps>();

  const dispatch = useAppDispatch();

  const { uuid } = useSelector((state: RootReducerProps) => state.environment.laboratory);

  const onSubmit = async (data: FormDataProps) => {
    dispatch(setLaboratoryData(data));

    try {
      const resultAction = await dispatch(createLaboratoryEnv(data));

      if (createLaboratoryEnv.fulfilled.match(resultAction)) {
        close();
        router.push(`/environment/laboratory/${resultAction.payload.uuid}`);
      } else {
        // Handle the error case, e.g., show an error message
        console.error(
          'Failed to create laboratory environment:',
          resultAction.payload,
        );
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      console.log('finally');
      console.log(uuid);
    }
  };

  return (
    <Fieldset as="form" className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Field>
        <Label className="text-sm/6 font-medium text-white">Name</Label>
        <Description className="text-sm/6 text-white/50">
          Create a name for your laboratory environment.
        </Description>
        <Input
          {...register('name', {
            required: 'Name is required',
            maxLength: 20,
          })}
          className={clsx(
            'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
          )}
        />
        {errors.name && (
          <p className=" mt-2 text-xs text-red-400">{errors.name.message}</p>
        )}
      </Field>
      <Field>
        <Label className="text-sm/6 font-medium text-white">
          Server IP Address
        </Label>
        <Description className="text-sm/6 text-white/50">
          Use your real name so people will recognize you.
        </Description>
        <Input
          {...register('ip_address', {
            required: 'Server IP Address Required',
          })}
          className={clsx(
            'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
          )}
        />
        {errors.ip_address && (
          <p className=" mt-2 text-xs text-red-400">
            {errors.ip_address.message}
          </p>
        )}
      </Field>
      <Field>
        <Label className="text-sm/6 font-medium text-white">Lab Address</Label>
        <Description className="text-sm/6 text-white/50">
          Real Address in the world
        </Description>
        <Input
          {...register('address', { required: 'Address Required' })}
          className={clsx(
            'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
          )}
        />
        {errors.address && (
          <p className=" mt-2 text-xs text-red-400">{errors.address.message}</p>
        )}
      </Field>
      <Field>
        <Label className="text-sm/6 font-medium text-white">Description</Label>
        <Description className="text-sm/6 text-white/50">
          Write a short description about your laboratory environment.
        </Description>
        <Textarea
          {...register('description', { required: false })}
          className={clsx(
            'mt-3 block w-full resize-none rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
          )}
          rows={3}
        />
      </Field>

      <div className="flex justify-end gap-2 pt-16">
        <Button
          className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm/6 font-semibold text-neutral-400 focus:outline-none data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white"
          type="button"
          onClick={close}
        >
          Cancel
        </Button>
        <Button
          className="inline-flex items-center gap-2 rounded-md bg-neutral-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-neutral-600 data-[open]:bg-neutral-700 data-[focus]:outline-1 data-[focus]:outline-white"
          type="submit"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Create</span>
        </Button>
      </div>
    </Fieldset>
  );
};

const ConnectLabEnvPanel: React.FC<PanelProps> = ({ close }) => {
  return (
    <Fieldset className="space-y-6">
      <Field>
        <Label className="text-sm/6 font-medium text-white">Name</Label>
        <Description className="text-sm/6 text-white/50">
          Create a name for your laboratory environment.
        </Description>
        <Input
          className={clsx(
            'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
          )}
        />
      </Field>
      <Field>
        <Label className="text-sm/6 font-medium text-white">
          Server IP Address
        </Label>
        <Description className="text-sm/6 text-white/50">
          Use your real name so people will recognize you.
        </Description>
        <Input
          className={clsx(
            'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
          )}
        />
      </Field>
      <Field>
        <Label className="text-sm/6 font-medium text-white">Description</Label>
        <Description className="text-sm/6 text-white/50">
          Write a short description about your laboratory environment.
        </Description>
        <Textarea
          className={clsx(
            'mt-3 block w-full resize-none rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
          )}
          rows={3}
        />
      </Field>

      <div className="flex justify-end gap-2 pt-16">
        <Button
          className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm/6 font-semibold text-neutral-400 focus:outline-none data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white"
          onClick={close}
        >
          Cancel
        </Button>
        <Button
          className="inline-flex items-center gap-2 rounded-md bg-neutral-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-neutral-600 data-[open]:bg-neutral-700 data-[focus]:outline-1 data-[focus]:outline-white"
          onClick={close}
        >
          <LinkIcon className="h-4 w-4" />
          <span>Connect</span>
        </Button>
      </div>
    </Fieldset>
  );
};

const tabs = [
  { name: 'Create', panel: CreateLabEnvPanel, current: true },
  { name: 'Connect', panel: ConnectLabEnvPanel, current: false },
];

export default function EnvironmentModalButton({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ComponentProps<typeof Button>) {
  let [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      <Button
        type="button"
        onClick={open}
        className="relative flex w-full items-center rounded-lg border-2 border-dashed border-neutral-300 px-8 py-4 text-center hover:border-neutral-400 focus:outline-none dark:border-neutral-500 hover:dark:border-neutral-300"
        {...props}
      >
        {children}
      </Button>

      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <DialogBackdrop className="fixed inset-0 bg-black/70" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4">
            <DialogPanel
              transition
              className="data-[closed]:transform-[scale(95%)] h-[95vh] w-full max-w-xl 
              rounded-lg bg-white/5 p-6 backdrop-blur-2xl duration-300 overflow-scroll
              ease-out data-[closed]:opacity-0"
            >
              <DialogTitle
                as="h3"
                className="text-base/7 font-semibold text-white"
              >
                Create Laboratory Environment
              </DialogTitle>
              <p className="mt-2 text-sm/6 text-white/50">
                Already have an ILab environment?{' '}
                <Link href="#" className=" text-blue-400">
                  Connect from invite code.
                </Link>
              </p>
              <TabGroup as="div" className="w-full pt-8 ">
                <TabList className="flex gap-4">
                  {tabs.map((tab) => (
                    <Tab
                      key={tab.name}
                      className="flex items-center rounded px-3 py-1 text-sm/6 font-semibold text-white focus:outline-none data-[hover]:bg-white/5 data-[selected]:bg-white/10 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                    >
                      {tab.name}
                    </Tab>
                  ))}
                </TabList>
                <TabPanels className="mt-3 w-full rounded-lg bg-white/5 p-3">
                  {tabs.map((tab) => (
                    <TabPanel key={tab.name} className="">
                      <tab.panel close={close} />
                    </TabPanel>
                  ))}
                </TabPanels>
              </TabGroup>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
