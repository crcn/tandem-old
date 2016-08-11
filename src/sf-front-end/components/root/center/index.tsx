import "./index.scss";
import * as React from "react";
import RegisteredComponent from "sf-front-end/components/registered";
import { FrontEndApplication } from "sf-front-end/application";
import EditorCommponent from "./editor";

export default class CenterComponent extends React.Component<{ app: FrontEndApplication }, any> {
  render() {
    const editor      = this.props.app.editor;
    const currentFile = editor.file;
    if (!currentFile) return null;
    return (<div className="m-editor-center">
      {currentFile ? <EditorCommponent {...this.props} editor={editor} /> : void 0}
    </div>);
  }
}
