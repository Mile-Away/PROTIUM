import { UiSchema } from '@rjsf/utils';

import { RJSFSchema } from '@rjsf/utils';
import { CustomFieldTemplate } from '../FieldTemplates';

export const siabOrbitalsSchema: RJSFSchema = {
  type: 'object',
  properties: {
    zeta_notation: {
      type: 'string',
      title: 'Zeta Notation',
      default: 'Z',
    },
    shape: {
      type: 'string',
      title: 'Shape',
      enum: ['dimer', 'trimer'],
      default: 'dimer',
    },
    nbands_ref: {
      type: 'number',
      title: 'Number of bands',
      default: 4,
    },
    orb_ref: {
      type: 'string',
      title: 'Orbital Reference',
    },
  },
};

export const siabOrbitalsUiSchema: UiSchema = {
  'ui:submitButtonOptions': {
    submitText: 'Submit',
    norender: true,
    props: {
      disabled: false,
    },
  },
  zeta_notation: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
  shape: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
  nbands_ref: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
  orb_ref: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
};
