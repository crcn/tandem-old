import "./index.scss";
import * as React from "react";
import { BaseApplicationComponent } from "@tandem/common";

export class NavigatorPaneComponent extends BaseApplicationComponent<any, any> {
  render() {
    return <div className="modules-pane">
      <div className="td-section-header">
        Files
        <div className="pull-right">
          <input type="text" />
        </div>
      </div>
      <div className="container">
        <div className="row">
          <i className="ion-document" />
          index.tsx
        </div>
      </div>
    </div>
  }
}