import { ThemeProps, withTheme } from '@rjsf/core';
import { DefaultSchemaField, ObjectField } from './CustomFields';
import widgets from './CustomWidgets';
import {
  ArrayFieldTemplate,
  DefaultFieldTemplate,
  ObjectFieldTemplate,
  SubmitButton,
} from './FieldTemplates';

const jsonSchemaTheme: ThemeProps = {
  widgets: widgets,
  //   fields: fields,
  templates: {
    ObjectFieldTemplate: ObjectFieldTemplate,
    FieldTemplate: DefaultFieldTemplate,
    ArrayFieldTemplate: ArrayFieldTemplate,
    ButtonTemplates: {
      SubmitButton: SubmitButton,
    },
  },
  fields: {
    // SchemaField: DefaultSchemaField,
    // ObjectField: ObjectField,
    // StringField: ObjectField,
    // AnyOfField: ObjectField,
    // TitleField: ObjectField,
  },
};

export const JsonSchemaThemedForm = withTheme(jsonSchemaTheme);

const di = {
  ecutwfc: { type: 'number' },
  pseudo_dir: {
    type: 'string',
    default:
      '/root/abacus-develop/pseudopotentials/sg15_oncv_upf_2020-02-06/1.0',
  },
  pseudo_name: { type: 'string' },
  smearing_sigma: { type: 'number' },
  bessel_nao_rcut: { type: 'array', items: { type: 'number' } },
  bessel_nao_smooth: { type: 'number' },
};
