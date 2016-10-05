import "./index.scss";

import * as React from "react";
import CenterComponent from "./center";
import { DocumentGutterComponent } from "./document-sidebar";
import { SelectionGutterComponent } from "./selection-sidebar";
import { RootReactComponentDependency } from "@tandem/editor/dependencies";

export default class RootEditorComponent extends React.Component<any, any> {
  render() {
    const workspace      = this.props.app.workspace;
    return (<div className="m-editor editor">
      <DocumentGutterComponent {...this.props} workspace={workspace} />
      <CenterComponent {...this.props} workspace={workspace}  />
      <SelectionGutterComponent {...this.props} workspace={workspace} />
    </div>);
  }
}

export const rootComponentDependency = new RootReactComponentDependency(RootEditorComponent);
