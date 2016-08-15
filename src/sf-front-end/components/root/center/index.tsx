import "./index.scss";

import * as React from "react";
import EditorCommponent from "./editor";
import RegisteredComponent from "sf-front-end/components/registered";
import { FrontEndApplication } from "sf-front-end/application";
import { Workspace } from "sf-front-end/models";

export default class CenterComponent extends React.Component<{ app: FrontEndApplication, workspace: Workspace }, any> {
  render() {
    return (<div className="m-editor-center">
      <EditorCommponent {...this.props} editor={this.props.workspace.editor} workspace={this.props.workspace} />
    </div>);
  }
}
