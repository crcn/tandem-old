import "./index.scss";

import * as React from "react";
import EditorCommponent from "./editor";
import RegisteredComponent from "@tandem/editor/components/registered";
import { FrontEndApplication } from "@tandem/editor/application";
import { Workspace } from "@tandem/editor/models";

export default class CenterComponent extends React.Component<{ app: FrontEndApplication, workspace: Workspace }, any> {
  render() {
    return (<div className="m-editor-center">
      <EditorCommponent {...this.props} editor={this.props.app.editor}  />
    </div>);
  }
}
