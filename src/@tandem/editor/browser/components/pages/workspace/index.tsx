import "./index.scss";

import * as React from "react";
import { WorkspaceMidComponent } from "./mid";
import { WorkspaceTitlebarComponent } from "./titlebar";
import { BaseApplicationComponent } from "@tandem/common";

export class WorkspaceComponent extends BaseApplicationComponent<{}, {}> {
  render() {
    return <div className="td-workspace">
      <WorkspaceTitlebarComponent />
      <WorkspaceMidComponent />
    </div>;
  }
}
