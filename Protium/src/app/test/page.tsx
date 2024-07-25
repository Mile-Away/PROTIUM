'use client';
import Form, { IChangeEvent } from '@rjsf/core';
import {
  ArrayFieldTemplateItemType,
  ArrayFieldTemplateProps,
  RegistryWidgetsType,
  RJSFSchema,
  UiSchema,
  WidgetProps,
} from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import React, { useCallback } from 'react';
import Editors from '../(workflow)/interactive/Editor';

const Page: React.FC<any> = () => {
  const [formData, setFormData] = React.useState({
    listOfStrings: ['foo', 'bar'],
  });
  const schema: RJSFSchema = {
    type: 'object',
    properties: {
      listOfStrings: {
        type: 'array',
        title: 'A list of strings',
        items: {
          type: 'string',
          default: 'bazinga',
        },
      },
    },
  };

  const uiSchema: UiSchema = {
    listOfStrings: {
      // 'ui:ArrayFieldTemplate': ArrayFieldTemplate,
      'ui:ArrayFieldItemTemplate': ArrayFieldItemTemplate,
      'ui:options': {
        canAdd: true,
      },
      items: {
        'ui:emptyValue': '',
        // 'ui:ArrayFieldItemTemplate': ArrayFieldItemTemplate,
      },
    },
  };

  const CustomTextWidget: React.FC<WidgetProps> = (props) => {
    return (
      <input
        type="text"
        className="h-8 w-48 rounded bg-white/10 p-0.5 px-1 text-sm focus:outline-none"
        value={props.value}
        required={props.required}
        onChange={(event) => props.onChange(event.target.value)}
      />
    );
  };

  const widgets: RegistryWidgetsType = {
    TextWidget: CustomTextWidget,
    // SelectWidget: CustomTextarea,
    // CheckboxWidget: CustomCheckbox,
  };

  function ArrayFieldItemTemplate(props: ArrayFieldTemplateItemType) {
    const { children, className } = props;
    return <div className="w-full flex justify-between bg-neutral-500">{children}</div>;
  }

  function ArrayFieldTemplate(props: ArrayFieldTemplateProps) {
    const { className, items, canAdd, onAddClick } = props;

    return (
      <div className={className}>
        {items &&
          items.map((element) => (
            <div key={element.key} className={element.className}>
              <div className="bg-neutral-500 w-64">{element.children}</div>
              {/* {element.hasMoveDown && (
                <button
                  onClick={element.onReorderClick(
                    element.index,
                    element.index + 1,
                  )}
                >
                  Down
                </button>
              )}
              {element.hasMoveUp && (
                <button
                  onClick={element.onReorderClick(
                    element.index,
                    element.index - 1,
                  )}
                >
                  Up
                </button>
              )} */}
              <button onClick={element.onDropIndexClick(element.index)}>
                Delete
              </button>
              <hr />
            </div>
          ))}

        {canAdd && (
          <div className="row">
            <p className="col-xs-3 col-xs-offset-9 array-item-add text-right">
              <button onClick={onAddClick} type="button">
                Custom +
              </button>
            </p>
          </div>
        )}
      </div>
    );
  }

  const onFormDataChange = useCallback(
    ({ formData }: IChangeEvent, id?: string) => {
      if (id) {
        console.log('Field changed, id: ', id);
      }

      setFormData(formData);
    },
    [setFormData],
  );

  return (
    <>
      <Form
        schema={schema}
        validator={validator}
        uiSchema={uiSchema}
        formData={formData}
        widgets={widgets}
        onChange={onFormDataChange}
      />

      <div>
        <Editors formData={formData} setFormData={setFormData} />
      </div>
    </>
  );
};

export default Page;
