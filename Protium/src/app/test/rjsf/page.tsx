'use client';
import Editors from '@/app/(dashboard)/workflow/interactive/Editor';
import { JsonSchemaThemedForm } from '@/app/(dashboard)/workflow/interactive/jsonSchema/JsonSchemaThemed';
import validator from '@rjsf/validator-ajv8';
import { useState } from 'react';

export default function Page() {
  const [formData, setFormData] = useState<any[]>([]);
  return (
    <>
      <JsonSchemaThemedForm
        schema={{
          type: 'array',
          items: {
            type: 'object',
            properties: {
              device: { type: 'string', description: 'device id' },
              flowrate: { type: 'number', description: 'in µl/s' },
              valve_position: {
                type: 'string',
                enum: ['Output', 'Input'],
              },
              plunger_position: { type: 'number', description: 'in µl' },
            },
          },
          title: 'Movement Endpoints',
        }}
        // uiSchema={item.jsonSchema.uiSchema}
        validator={validator}
        formData={formData}
        onChange={({ formData }) => setFormData(formData)}
      />
      <div className="-m-1 rounded-sm bg-[rgb(31,31,31)] p-1">
        <Editors formData={formData} setFormData={setFormData} />
      </div>
    </>
  );
}
