import { JsonSchemaThemedForm } from '@/app/(dashboard)/workflow/interactive/jsonSchema/JsonSchemaThemed';
import reorderProperties from '@/lib/reorderSchema';
import validator from '@rjsf/validator-ajv8';
import { useState } from 'react';

export default function InfoTab() {
  const [schema, setSchema] = useState<any>({
    type: 'object',
    properties: {
      template: {
        enum: ['Bioyand', 'Biaozhi'],
        type: 'string',
        title: 'Template',
        default: 'Bioyand',
      },

      // bond_length: { type: 'array', items: { type: 'number' } },
      layout: {
        type: 'object',
        properties: {
          numOfPos: {
            type: 'number',
            title: 'Number of Position',
            default: 15,
          },
          numOfCol: { type: 'number', title: 'Number of Columns', default: 5 },
        },
      },
      disable: {
        type: 'boolean',
        title: 'Disable',
        default: false,
      },
    },
  });
  const [data, setData] = useState({
    template: 'Bioyand',
    layout: {
      numOfPos: 15,
      numOfCol: 5,
    },
    disable: false,
  });
  return (
    <JsonSchemaThemedForm
      schema={reorderProperties(schema as any)}
      // uiSchema={item.jsonSchema.uiSchema}
      validator={validator}
      formData={data}
      // onChange={onFormDataChange}
    />
  );
}
