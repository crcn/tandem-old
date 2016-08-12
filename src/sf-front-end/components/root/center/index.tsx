import "./index.scss";
import * as React from "react";
import RegisteredComponent from "sf-front-end/components/registered";
import { FrontEndApplication } from "sf-front-end/application";
import EditorCommponent from "./editor";

export default class CenterComponent extends React.Component<{ app: FrontEndApplication }, any> {
  render() {
    const workspace      = this.props.app.workspace;
    return (<div className="m-editor-center">
      {workspace ? <EditorCommponent {...this.props} editor={workspace.editor} workspace={workspace} /> : undefined}
    </div>);
  }
}
