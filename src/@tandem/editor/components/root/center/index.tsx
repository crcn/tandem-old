import "./index.scss";

import * as React from "react";
import EditorCommponent from "./editor";
import { RegisteredComponent } from "@tandem/editor/components/common";

import { FrontEndApplication } from "@tandem/editor/application";

export default class CenterComponent extends React.Component<{ app: FrontEndApplication }, any> {
  render() {
    const { workspace } = this.props.app;
    return (<div className="m-editor-center">
      <EditorCommponent {...this.props} workspace={this.props.app.workspace} allElements={workspace && workspace.documentQuerier.queriedElements || []}  />
    </div>);
  }
}
