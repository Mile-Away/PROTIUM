'use client';
import validator from '@rjsf/validator-ajv8';
import { JsonSchemaThemedForm } from '../(workflow)/interactive/jsonSchema/JsonSchemaThemed';

export default function Page() {
  return (
    <JsonSchemaThemedForm
      schema={{
        type: 'object',
        properties: {
          ecutwfc: { type: 'number' },
          pseudo_dir: {
            type: 'string',
            description: "Directory containing the pseudopotential files",
            default:
              '/root/abacus-develop/pseudopotentials/sg15_oncv_upf_2020-02-06/1.0',
          },
          pseudo_name: { type: 'string' },
          smearing_sigma: { type: 'number' },
          bessel_nao_rcut: { type: 'array', items: { type: 'number' } },
          bessel_nao_smooth: { type: 'number' },
        },
      }}
      // uiSchema={item.jsonSchema.uiSchema}
      validator={validator}
      formData={""}
    />
  );
}
