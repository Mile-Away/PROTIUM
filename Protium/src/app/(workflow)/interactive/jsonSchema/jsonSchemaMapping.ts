import {
  abacusInputSchema,
  abacusInputUiSchema,
} from '../jsonSchema/schema/abacusInputSchema';

const jsonSchemaMapping: {
  [key: string]: {
    schema: object;
    uiSchema: object;
  };
} = {
  abacus_input: {
    schema: abacusInputSchema,
    uiSchema: abacusInputUiSchema,
  },
  orbitals: {
    schema: {},
    uiSchema: {},
  },
};

export default jsonSchemaMapping;
