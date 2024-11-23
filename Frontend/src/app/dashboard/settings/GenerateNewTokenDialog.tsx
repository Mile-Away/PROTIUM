import {
  Button,
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Field,
  Input,
  Label,
} from '@headlessui/react';
import clsx from 'clsx';
import { useState } from 'react';

export default function GenerateNewTokenDialog({
  isOpen,
  setIsOpen,
  handleAccessTokenSubmit,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  handleAccessTokenSubmit: (name: string) => void;
}) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    handleAccessTokenSubmit(name);
    setIsOpen(false);
  };

  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={() => setIsOpen(false)}
      >
        {/* 遮罩层 */}
        {isOpen && (
          <div className="fixed inset-0 z-10 bg-black bg-opacity-50 backdrop-blur-sm"></div>
        )}

        <div className="fixed inset-0 z-20 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="data-[closed]:transform-[scale(95%)] w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:opacity-0"
            >
              <DialogTitle
                as="h3"
                className="border-b pb-2 text-base/7 font-semibold text-white dark:border-white/10"
              >
                Generate New Access Token
              </DialogTitle>
              <Field as="div" className="mt-8">
                <Label className="text-sm/6 font-medium text-white">Name</Label>
                <Description className="mb-4 text-xs text-white/50">
                  What’s this token for?
                </Description>
                <Input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter new token name"
                  className={clsx(
                    'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                  )}
                />
              </Field>
              <div className="mt-4 flex justify-end">
                <Button
                  className="inline-flex items-center  gap-2 rounded-md bg-neutral-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-neutral-600 data-[open]:bg-neutral-700 data-[focus]:outline-1 data-[focus]:outline-white"
                  onClick={handleSubmit}
                >
                  Generate
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
