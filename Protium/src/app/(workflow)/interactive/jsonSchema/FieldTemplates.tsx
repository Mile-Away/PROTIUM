import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';

import {
  ArrayFieldTemplateProps,
  FieldTemplateProps,
  ObjectFieldTemplatePropertyType,
  ObjectFieldTemplateProps,
} from '@rjsf/utils';
import { useState } from 'react';

export function CustomFieldTemplate(props: FieldTemplateProps) {
  const {
    id,
    classNames,
    style,
    label,
    help,
    required,
    description,
    errors,
    children,
  } = props;
  return (
    <div className="flex justify-between">
      <label htmlFor={id}>
        <span className="font-semibold">{label}</span>
        {required ? '*' : null}
      </label>
      {/* {description} */}

      <div className="">{children}</div>
      {/* {errors} */}
      {/* {help} */}
    </div>
  );
}

export function ArrayFieldTemplate(props: ArrayFieldTemplateProps) {
  const [value, setValue] = useState<number | null>(null);

  return (
    <div className="w-full ">
      <div className="flex w-full justify-between">
        <div className="font-semibold">{props.title}</div>
        <div className="w-48 flex-col pb-2 ">
          <div className="relative ">
            <input
              className="h-8 w-48 cursor-not-allowed rounded bg-white/10 p-0.5 px-1 focus:outline-none"
              type="text"
              disabled={true}
              value={value || ''}
            />
            <button
              className=" absolute right-0 top-0 cursor-not-allowed p-2 hover:bg-white/20"
              type="button"
              disabled={true}
              onClick={props.onAddClick}
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {props.items.map((element) => (
              <div
                className="group relative w-fit min-w-8 cursor-pointer select-none rounded-lg bg-white/15 px-2
           py-1 text-center text-sm text-white hover:bg-white/5"
                key={element.key}
                onClick={element.onDropIndexClick(element.index)}
              >
                {element.children.props.formData}
                <button className="rihgt-0 absolute top-0 -translate-y-1/3 translate-x-1/4 opacity-0 group-hover:opacity-100">
                  <XMarkIcon className="h-3 w-3 dark:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* {props.canAdd && (
          <button
            className="flex w-full items-end justify-end"
            type="button"
            onClick={props.onAddClick}
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        )} */}
    </div>
  );
}

export function ObjectFieldTemplate(props: ObjectFieldTemplateProps) {
  const {
    registry,
    properties,
    title,
    description,
    uiSchema,
    required,
    schema,
    idSchema,
  } = props;

  return (
    <div className="flex flex-col gap-y-3">
      {properties.map((element: ObjectFieldTemplatePropertyType) => (
        <div
          className="-m-2 rounded p-3 hover:bg-white/5"
          key={element.content.key}
        >
          {element.content}
        </div>
      ))}
    </div>
  );
}
