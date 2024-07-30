import { UiSchema } from '@rjsf/utils';

import { RJSFSchema } from '@rjsf/utils';
import { ArrayFieldTemplate, CustomFieldTemplate } from '../FieldTemplates';

export const siabSystemSchema: RJSFSchema = {
  type: 'object',
  properties: {
    shape: {
      type: 'string',
      title: 'Shape',
      enum: ['dimer', 'trimer'],
      default: 'dimer',
    },
    nbands: {
      type: 'number',
      title: 'Number of bands',
      default: 8,
    },
    nspin: {
      type: 'number',
      title: 'Number of spins',
      default: 1,
    },
    bond_length: {
      type: 'array',
      items: {
        type: 'number',
      },
    },
  },
};

export const siabSystemUiSchema: UiSchema = {
  'ui:submitButtonOptions': {
    submitText: 'Submit',
    norender: true,
    props: {
      disabled: false,
    },
  },
  shape: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
  nbands: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
  nspin: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
  bond_length: {
    'ui:options': {
      canAdd: true,
    },
    'ui:emptyValue': '',
    'ui:ArrayFieldTemplate': ArrayFieldTemplate,
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
