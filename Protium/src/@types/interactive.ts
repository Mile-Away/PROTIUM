import { BasicNodeProps } from '@/@types/workflow';

export interface InteractivePanelProps extends BasicNodeProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  idx: number;
  tabItems: {
    name: string;
    jsonSchema?: {
      schema: object;
      uiSchema: object;
    };
  }[];
}