import { UiSchema } from '@rjsf/utils';
import { ArrayFieldTemplate, CustomFieldTemplate } from '../FieldTemplates';

import { RJSFSchema } from '@rjsf/utils';

export const abacusInputSchema: RJSFSchema = {
  type: 'object',
  properties: {
    pseudo_dir: {
      type: 'string',
      default:
        '/root/abacus-develop/pseudopotentials/sg15_oncv_upf_2020-02-06/1.0',
    },
    pseudo_name: {
      type: 'string',
    },
    ecutwfc: {
      type: 'number',
    },
    bessel_nao_smooth: {
      type: 'number',
    },
    bessel_nao_rcut: {
      type: 'array',
      items: {
        type: 'number',
      },
    },
    smearing_sigma: {
      type: 'number',
    },
  },
};

export const abacusInputUiSchema: UiSchema = {
  'ui:submitButtonOptions': {
    submitText: 'Submit',
    norender: true,
    props: {
      disabled: false,
    },
  },
  pseudo_dir: {
    'ui:widget': 'textarea',
    'ui:FieldTemplate': CustomFieldTemplate,
  },
  pseudo_name: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
  ecutwfc: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
  bessel_nao_smooth: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
  bessel_nao_rcut: {
    'ui:options': {
      canAdd: true,
    },
    'ui:emptyValue': '',
    'ui:ArrayFieldTemplate': ArrayFieldTemplate,
  },
  smearing_sigma: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
};

// // 将 schema.properties 的每个键值对转换为一个对象，其中 key 为键名，键值为：'ui:FieldTemplate': CustomFieldTemplate,
// // 以此来自定义每个字段的样式
// uiSchema = Object.keys(abacusInputSchema.properties!).reduce((acc, key) => {
//   if (key === 'pseudo_dir') {
//     acc[key] = {
//       'ui:widget': 'textarea',
//       'ui:FieldTemplate': CustomFieldTemplate,
//     };
//   } else if (key === 'bessel_nao_rcut') {
//     acc[key] = {};
//   } else {
//     acc[key] = {
//       'ui:FieldTemplate': CustomFieldTemplate,
//     };
//   }
//   return acc;
// }, uiSchema);
