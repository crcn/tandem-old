import "./index.scss";
import React = require("react");

export interface IMonacoTextEditorComponentProps {
  onChange(value: string): any;
  contentType?: string;
  value: any;
}

export class MonacoTextEditorComponent extends React.Component<IMonacoTextEditorComponentProps, any> {
  render() {
    return <div className="monaco-editor-component">
      COMPONENT ME THIS
    </div>
  }
}