import { UiSchema } from '@rjsf/utils';

import { RJSFSchema } from '@rjsf/utils';
import { ArrayFieldTemplate, CustomFieldTemplate } from '../FieldTemplates';

export const abacusSiabSchema: RJSFSchema = {
  type: 'object',
  properties: {
    // "environment": "",
    // "mpi_command": "mpirun -np 8",
    // "abacus_command": "abacus",
    // "optimizer": "bfgs",
    // "max_steps": 1000,
    // "spill_coefs": [0.0, 1.0],
    // "spill_guess": "atomic",
    // "nthreads_rcut": 4,
    // "jY_type": "reduced",
    environment: {
      type: 'string',
      title: 'Environment',
      default: '',
    },
    mpi_command: {
      type: 'string',
      title: 'MPI Command',
      default: 'mpirun -np 8',
    },
    abacus_command: {
      type: 'string',
      title: 'Abacus Command',
      default: 'abacus',
    },
    optimizer: {
      type: 'string',
      title: 'Optimizer',
      default: 'bfgs',
    },
    max_steps: {
      type: 'number',
      title: 'Max Steps',
      default: 1000,
    },
    spill_coefs: {
      type: 'array',
      items: {
        type: 'number',
      },
      default: [0.0, 1.0],
    },
    spill_guess: {
      type: 'string',
      title: 'Spill Guess',
      default: 'atomic',
    },
    nthreads_rcut: {
      type: 'number',
      title: 'Nthreads Rcut',
      default: 4,
    },
    jY_type: {
      type: 'string',
      title: 'JY Type',
      default: 'reduced',
    },
  },
};

export const abacusSiabUiSchema: UiSchema = {
  'ui:submitButtonOptions': {
    submitText: 'Submit',
    norender: true,
    props: {
      disabled: false,
    },
  },
  environment: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
  mpi_command: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
  abacus_command: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
  optimizer: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
  max_steps: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
  spill_coefs: {
    'ui:options': {
      canAdd: true,
    },
    'ui:emptyValue': '',
    'ui:ArrayFieldTemplate': ArrayFieldTemplate,
  },
  spill_guess: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
  nthreads_rcut: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
  jY_type: {
    'ui:FieldTemplate': CustomFieldTemplate,
  },
};
