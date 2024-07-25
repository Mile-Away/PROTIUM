import MonacoEditor from '@monaco-editor/react';
import isEqualWith from 'lodash/isEqualWith';
import { useCallback, useState } from 'react';

const monacoEditorOptions = {
  minimap: {
    enabled: false,
  },
  automaticLayout: true,
};

type EditorProps = {
  code: string;
  onChange: (code: string) => void;
};

function Editor({ code, onChange }: EditorProps) {
  const [valid, setValid] = useState(true);

  const onCodeChange = useCallback(
    (code: string | undefined) => {
      if (!code) {
        return;
      }

      try {
        const parsedCode = JSON.parse(code);
        setValid(true);
        // 通过传入的 onChange 参数，在代码发生修改时，将修改后的代码传递给父组件
        // 实现表单内容也跟随代码的变化而变化
        onChange(parsedCode);
      } catch (err) {
        setValid(false);
      }
    },
    [setValid, onChange],
  );

  const icon = valid ? 'ok' : 'remove';
  const cls = valid ? 'valid' : 'invalid';

  return (
    <div className="">
      {/* <div className="">
        <span className={``} />
        {cls}
      </div> */}
      <MonacoEditor
        language="json"
        value={code}
        theme="vs-dark"
        onChange={onCodeChange}
        height={"84vh"}
        options={monacoEditorOptions}
      />
    </div>
  );
}

export const toJson = (val: unknown) => JSON.stringify(val, null, 2);

type EditorsProps = {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
};

function Editors({
  formData,
  setFormData,
}: EditorsProps) {

  const onFormDataEdited = useCallback(
    (newFormData: any) => {
      if (
        !isEqualWith(newFormData, formData, (newValue, oldValue) => {
          // Since this is coming from the editor which uses JSON.stringify to trim undefined values compare the values
          // using JSON.stringify to see if the trimmed formData is the same as the untrimmed state
          // Sometimes passing the trimmed value back into the Form causes the defaults to be improperly assigned
          return JSON.stringify(oldValue) === JSON.stringify(newValue);
        })
      ) {
        setFormData(newFormData);
      }
    },
    [formData, setFormData],
  );

  return (
    <div className="flex flex-col space-y-4">
      <Editor code={toJson(formData)} onChange={onFormDataEdited} />
    </div>
  );
}

export default Editors;
