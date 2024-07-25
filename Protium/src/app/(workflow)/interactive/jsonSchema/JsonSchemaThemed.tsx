import { ThemeProps, withTheme } from '@rjsf/core';
import widgets from './CustomWidgets';
import { ObjectFieldTemplate } from './FieldTemplates';

const jsonSchemaTheme: ThemeProps = {
  widgets: widgets,
  //   fields: fields,
  templates: {
    ObjectFieldTemplate: ObjectFieldTemplate,
  },
};

export const JsonSchemaThemedForm = withTheme(jsonSchemaTheme);
