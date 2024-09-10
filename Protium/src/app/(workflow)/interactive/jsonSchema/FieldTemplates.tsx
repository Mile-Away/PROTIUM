import { ChevronDoubleUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';

import {
  ArrayFieldTemplateProps,
  FieldTemplateProps,
  getSubmitButtonOptions,
  ObjectFieldTemplatePropertyType,
  ObjectFieldTemplateProps,
  SubmitButtonProps,
} from '@rjsf/utils';
import clsx from 'clsx';
import { JSONSchema7TypeName } from 'json-schema';
import { useState } from 'react';

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
          className="w-full rounded p-2 hover:bg-white/5"
          key={element.content.key}
        >
          {element.content}
        </div>
      ))}
    </div>
  );
}

export function DefaultFieldTemplate(props: FieldTemplateProps) {
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
    <div className="w-full">
      <label htmlFor={id}>
        <div className="flex items-center gap-2">
          <span className="font-semibold">{label}</span>
        </div>
        <i className=" text-2xs">{help}</i>
        <i className=" text-2xs">{description}</i>
      </label>

      <div className="mt-2">{children}</div>
      {/* {errors} */}
      {/* {help} */}
    </div>
  );
}

export function ArrayFieldTemplate(props: ArrayFieldTemplateProps) {
  const { schema, title, items, formData, onAddClick } = props;

  console.log('ArrayFieldTemplate', props);

  const [minimized, setMinimized] = useState<string[]>([]);

  const handleMinimizeOrExpand = (key: string) => {
    if (minimized.includes(key)) {
      setMinimized((prev) => prev.filter((e) => e !== key));
    } else {
      setMinimized((prev) => [...prev, key]);
    }
  };

  let itemType: JSONSchema7TypeName | JSONSchema7TypeName[] | undefined =
    undefined;

  if (
    props.schema.items &&
    !Array.isArray(props.schema.items) &&
    typeof props.schema.items !== 'boolean'
  ) {
    itemType = props.schema.items.type;
  }

  return (
    <div className="w-full flex-col pb-2 ">
      <button
        className=" flex w-full items-center justify-center gap-2 border border-white/10 bg-white/5 p-2 hover:bg-white/10"
        type="button"
        onClick={onAddClick}
      >
        <span>Add New</span>
        <PlusIcon className="h-4 w-4" />
      </button>

      <div className="flex w-full flex-wrap">
        {items.map((element) => (
          <div
            key={element.key}
            className={clsx(
              'relative mt-2 w-full overflow-scroll border border-white/10 p-4 shadow',
              // 'transition-all duration-500 ease-in-out',
              minimized.includes(element.key) ? 'h-14' : 'h-fit',
            )}
          >
            {element.children}
            <div className=" absolute right-4 top-4">
              {/* 删除按钮 */}
              <button
                type="button"
                className="rounded p-1 hover:bg-white/5 hover:text-red-400"
                onClick={element.onDropIndexClick(element.index)}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
            {/* 减小宽度按钮 */}
            {itemType === 'object' && (
              <div
                className=" absolute inset-x-0 bottom-0
  z-10 flex items-center justify-center opacity-0  hover:bg-white/5 hover:opacity-100"
              >
                <button
                  type="button"
                  onClick={() => handleMinimizeOrExpand(element.key)}
                >
                  <ChevronDoubleUpIcon
                    className={clsx(
                      'h-4 w-4',
                      'transition-all duration-300 ease-in-out',
                      minimized.includes(element.key) && 'rotate-180 transform',
                    )}
                  />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SubmitButton(props: SubmitButtonProps) {
  const { uiSchema } = props;
  const { norender } = getSubmitButtonOptions(uiSchema);
  if (norender) {
    return null;
  }
  return <></>;
}
