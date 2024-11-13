import { UiSchema } from '@rjsf/utils';
import { ArrayFieldTemplate, DefaultFieldTemplate } from '../FieldTemplates';

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
  pseudo_dir: {
    'ui:widget': 'textarea',
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
