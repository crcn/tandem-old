import "./index.scss";
import * as React from "react";
import RegisteredComponent from "sf-front-end/components/registered";
import { FrontEndApplication } from "sf-front-end/application";

export default class CenterComponent extends React.Component<{ app: FrontEndApplication }, any> {
  render() {
    const currentFile = this.props.app.editor.file;
    if (!currentFile) return null;
    return (<div className="m-editor-center">
      {currentFile ? <RegisteredComponent {...this.props} ns={`components/stage/${currentFile.ext}`} file={currentFile} /> : void 0}
    </div>);
  }
}
