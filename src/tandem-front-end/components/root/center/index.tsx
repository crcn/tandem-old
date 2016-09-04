import "./index.scss";

import * as React from "react";
import EditorCommponent from "./editor";
import RegisteredComponent from "tandem-front-end/components/registered";
import { FrontEndApplication } from "tandem-front-end/application";
import { Workspace } from "tandem-front-end/models";

export default class CenterComponent extends React.Component<{ app: FrontEndApplication, workspace: Workspace }, any> {
  render() {
    return (<div className="m-editor-center">
      <EditorCommponent {...this.props} editor={this.props.workspace.editor} workspace={this.props.workspace} />
    </div>);
  }
}
