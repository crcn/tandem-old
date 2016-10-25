import "./index.scss";

import * as React from "react";
import EditorCommponent from "./editor";
import { RegisteredComponent } from "@tandem/editor/browser/components/common";

import { FrontEndApplication } from "@tandem/editor/browser/application";

export default class CenterComponent extends React.Component<{}, {}> {
  render() {
    // const { workspace } = this.props.app;
    const workspace: any = null;
    if (1 + 1) return null;
    // <EditorCommponent {...this.props} workspace={this.props.app.workspace} allElements={workspace && workspace.documentQuerier.queriedElements || []}  />
    return (<div className="m-editor-center">

    </div>);
  }
}
