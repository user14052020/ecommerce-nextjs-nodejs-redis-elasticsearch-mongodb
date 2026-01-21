import React, { useState } from "react";
import "braft-editor/dist/index.css";
import BraftEditor from "braft-editor";
import { message } from "antd";
import type { FormInstance } from "antd";

const maxFileSize = 102400; //100 kb

type EditorProps = {
  value?: string;
  form: FormInstance;
};

const Default = ({ value = "", form }: EditorProps) => {
  type EditorState = ReturnType<typeof BraftEditor.createEditorState>;
  const [state, setState] = useState<EditorState>(
    BraftEditor.createEditorState(value)
  );

  const handleChange = (editorState: EditorState) => {
    setState(editorState);
    const formData = form.getFieldsValue();
    formData.description = editorState.toHTML();
    form.setFieldsValue(formData);
  };

  const controls = [
    "undo",
    "redo",
    "separator",
    "font-size",
    "line-height",
    "letter-spacing",
    "separator",
    "text-color",
    "bold",
    "italic",
    "underline",
    "strike-through",
    "separator",
    "superscript",
    "subscript",
    "remove-styles",
    "emoji",
    "separator",
    "text-indent",
    "text-align",
    "separator",
    "headings",
    "list-ul",
    "list-ol",
    "blockquote",
    "code",
    "separator",
    "link",
    "separator",
    "hr",
    "separator",
    "media",
    "separator",
    "clear",
  ] as any;

  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const customUpload = (props: any) => {
    const { file, success, error } = props;

    toBase64(file)
      .then((res) => {
        success({ url: String(res) });
      })
      .catch((err) => {
        message.warn(" File upload failed");
        if (typeof error === "function") {
          error(String(err));
        }
      });
  };

  const validateFn = (file: File) => {
    if (file.size > maxFileSize) {
      message.error("File Should be less than 1 mb");
      return false;
    }
    return true;
  };

  return (
    <div className="w-full">
      <BraftEditor
        language="en"
        controls={controls}
        value={state}
        onChange={handleChange}
        media={{ uploadFn: customUpload as any, validateFn: validateFn }}
        className="h-10 w-full"
        contentStyle={{
          height: 350,
          boxShadow: "inset 0 1px 3px rgba(0,0,0,.1)",
        }}
      />
    </div>
  );
};

export default Default;
