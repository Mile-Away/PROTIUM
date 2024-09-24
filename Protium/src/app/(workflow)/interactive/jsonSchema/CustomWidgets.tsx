import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { RegistryWidgetsType, WidgetProps } from '@rjsf/utils';
import clsx from 'clsx';

export const DefaultTextWidget: React.FC<WidgetProps> = (props) => {
  const {onChange} = props
  return (
    <input
      type="text"
      className="form-input h-8 w-full rounded  bg-white/10 text-sm focus:outline-none"
      value={props.value}
      required={props.required}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};

export const DefaultCheckboxWidget: React.FC<WidgetProps> = (props) => {
  console.log(props)
  return (
    <input
      type="checkbox"
      className="form-checkbox h-4 w-4 "
      checked={props.value}
      required={props.required}
      onChange={(event) => props.onChange(event.target.checked)}
    />
  );
}

export const DefaultTextareaWidget: React.FC<WidgetProps> = (props) => {
  return (
    <textarea
      className="form-textarea h-32 w-full rounded bg-white/10  text-sm focus:outline-none"
      value={props.value}
      required={props.required}
      onChange={(event) => props.onChange(event.target.value)}
    />
  );
};

export const DefaultSelectWidget: React.FC<WidgetProps> = (props) => {

  const { id, name, label, onChange, options, value } = props;
  return (
    <Listbox value={value} onChange={onChange}>
      <ListboxButton
        className={clsx(
          'relative h-10 block w-full rounded bg-white/10 py-1.5 pl-3 pr-8 text-left text-sm/6 text-white',
          'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
        )}
      >
        {value}
        <ChevronDownIcon
          className="group pointer-events-none absolute right-2.5 top-2.5 size-4 "
          aria-hidden="true"
        />
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        className={clsx(
          'z-50 w-[var(--button-width)] rounded border border-white/5 bg-neutral-800 p-1 shadow-lg shadow-black [--anchor-gap:var(--spacing-1)] focus:outline-none',
          'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0',
        )}
      >
        {options.enumOptions!.map((option) => (
          <ListboxOption
            key={option.value}
            value={option.value}
            className="group flex cursor-default select-none items-center gap-2 rounded-lg px-2 py-1.5 data-[focus]:bg-white/10"
          >
            <CheckIcon className="invisible size-4 group-data-[selected]:visible" />
            <div className="text-sm/6 text-white">{option.value}</div>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};

const widgets: RegistryWidgetsType = {
  TextWidget: DefaultTextWidget,
  TextareaWidget: DefaultTextareaWidget,
  SelectWidget: DefaultSelectWidget,
  CheckboxWidget: DefaultCheckboxWidget,
};

export default widgets;
