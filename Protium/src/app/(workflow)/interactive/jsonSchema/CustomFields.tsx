import { FieldProps } from '@rjsf/utils';

export const DefaultSchemaField = function (props: FieldProps) {
  console.log('DefaultSchemaField', props);
  return (
    <div id="custom">
      <p>Yeah, I'm pretty dumb.</p>
    </div>
  );
};

export const ObjectField = function (props: FieldProps) {
  console.log(props);
  const { schema } = props;
  return (
    <div id="custom">
      <p>Yeah, I'm pretty dumb.</p>
    </div>
  );
};


// const obj = 