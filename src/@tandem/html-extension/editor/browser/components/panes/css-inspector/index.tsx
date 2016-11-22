import "./index.scss";
import * as React from "react";
import { Workspace } from "@tandem/editor/browser/models";
import { BaseApplicationComponent } from "@tandem/common";

export class ElementCSSInspectorComponent extends BaseApplicationComponent<{ workspace: Workspace }, any> {
  render() {
    const { workspace } = this.props;
    if (!workspace || !workspace.selection.length) return null;

    return <div className="css-inspector">
      <div className="header">
        Style
        <div className="controls show">
          <i className="ion-paintbrush" />
          <i className="ion-code" />
        </div>
      </div>
      <div className="container">
      </div>
    </div>
  }
}