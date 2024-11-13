import InteractivePanel from '../InteractivePanel';
import {
  abacusInputSchema,
  abacusInputUiSchema,
} from '../jsonSchema/schema/abacusInputSchema';
import { abacusSiabSchema, abacusSiabUiSchema } from './schema/abacusSiabSchema';
import { bohriumJobConfigSchema, bohriumJobConfigUiSchema } from './schema/bohriumJobConfigSchema';
import {
  siabOrbitalsSchema,
  siabOrbitalsUiSchema,
} from './schema/siabOrbitalsSchema';
import {
  siabSystemSchema,
  siabSystemUiSchema,
} from './schema/siabSystemSchema';

const jsonSchemaMapping: {
  [key: string]: {
    panelType: React.FC<any>;
    schema: object;
    uiSchema: object;
  };
} = {
  /*
   * 这个 Mapping 用于对不同的 body_key 在 InteractivePanel 面板的情况下，
   * 指定其输入框对应的 schema 和 uiSchema
   */
  "abacus-input": {
    panelType: InteractivePanel,
    schema: abacusInputSchema,
    uiSchema: abacusInputUiSchema,
  },
  "abacus-siab": {
    panelType: InteractivePanel,
    schema: abacusSiabSchema,
    uiSchema: abacusSiabUiSchema,
  },
  "bohrium-job-config": {
    panelType: InteractivePanel,
    schema: bohriumJobConfigSchema,
    uiSchema: bohriumJobConfigUiSchema,
  },
  siab_system: {
    panelType: InteractivePanel,
    schema: siabSystemSchema,
    uiSchema: siabSystemUiSchema,
  },
  siab_orbitals: {
    panelType: InteractivePanel,
    schema: siabOrbitalsSchema,
    uiSchema: siabOrbitalsUiSchema,
  },
};

export default jsonSchemaMapping;
