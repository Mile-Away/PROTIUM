import { RegistryWidgetsType, WidgetProps } from "@rjsf/utils";

export const CustomTextWidget: React.FC<WidgetProps> = (props) => {
    return (
      <input
        type="text"
        className="h-8 w-48 rounded bg-white/10 p-0.5 px-1 text-sm focus:outline-none"
        value={props.value}
        required={props.required}
        onChange={(event) => props.onChange(event.target.value)}
      />
    );
  };
  
  export const CustomTextareaWidget: React.FC<WidgetProps> = (props) => {
    return (
      <textarea
        className="h-32 w-48 rounded bg-white/10 p-0.5 px-1 text-sm focus:outline-none"
        value={props.value}
        required={props.required}
        onChange={(event) => props.onChange(event.target.value)}
      />
    );
  };

  const widgets: RegistryWidgetsType = {
    TextWidget: CustomTextWidget,
    TextareaWidget: CustomTextareaWidget,
    // SelectWidget: CustomTextarea,
    // CheckboxWidget: CustomCheckbox,
  };

  export default widgets;