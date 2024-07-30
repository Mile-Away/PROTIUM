import { UiSchema } from '@rjsf/utils';

import { RJSFSchema } from '@rjsf/utils';
import { CustomFieldTemplate } from '../FieldTemplates';

export const bohriumJobConfigSchema: RJSFSchema = {
  type: 'object',
  properties: {
    project_id: {
      type: 'number',
      title: 'Project ID',
    },
    job_name: {
      type: 'string',
      title: 'Job Name',
      default: 'abacus_siab',
    },
    machine_type: {
      type: 'string',
      title: 'Machine Type',
      default: 'c16_m32_cpu',
    },
    command: {
      type: 'string',
      title: 'Command',
      default:
        '/opt/mamba/envs/orbgen/bin/python /root/deepmodeling/abacus_orbital_generation/SIAB/SIAB_nouvelle.py -i SIAB_INPUT.json 2>abacus_std.err',
    },

    image_address: {
      type: 'string',
      title: 'Image Address',
      default: 'registry.dp.tech/dptech/prod-16047/apns:orbgen',
    },
  },
};

export const bohriumJobConfigUiSchema: UiSchema = {
  'ui:submitButtonOptions': {
    submitText: 'Submit',
    norender: true,
    props: {
      disabled: false,
    },
  },
  project_id: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
  job_name: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
  machine_type: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
  command: {
    'ui:widget': 'textarea',
    'ui:FieldTemplate': CustomFieldTemplate,
  },
  image_address: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
};
