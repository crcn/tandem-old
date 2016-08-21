import "./index.scss";

import * as React from "react";
import CenterComponent from "./center";
import { DocumentSidebarComponent } from "./document-sidebar";
import { SelectionSidebarComponent } from "./selection-sidebar";
import { RootReactComponentDependency } from "sf-front-end/dependencies";

export default class RootEditorComponent extends React.Component<any, any> {
  render() {
    const workspace      = this.props.app.workspace;
    if (!workspace) return null;
    return (<div className="m-editor">
      <DocumentSidebarComponent {...this.props} workspace={workspace} />
      <CenterComponent {...this.props} workspace={workspace}  />
      <SelectionSidebarComponent {...this.props} workspace={workspace} />
    </div>);
  }
}

export const dependency = new RootReactComponentDependency(RootEditorComponent);
