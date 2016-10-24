import "./index.scss";

import * as React from "react";
import CenterComponent from "./center";
import { DocumentGutterComponent } from "./document-sidebar";
import { SelectionGutterComponent } from "./selection-sidebar";
import { RootReactComponentDependency } from "@tandem/editor/dependencies";

export default class RootEditorComponent extends React.Component<any, any> {
  render() {
    return (<div className="m-editor editor">
      <DocumentGutterComponent {...this.props} />
      <CenterComponent {...this.props} />
      <SelectionGutterComponent {...this.props} />
    </div>);
  }
}

export const rootComponentDependency = new RootReactComponentDependency(RootEditorComponent);
