import "./index.scss";
import * as React from "react";
import { Workspace } from "sf-front-end/models";
import { PANE_COMPONENT_NS } from "sf-front-end/dependencies";
import RegisteredComponent from "sf-front-end/components/registered";

export class SidebarComponent extends React.Component<{ workspace: Workspace }, any> {
  render() {
    return <div className="m-sidebar">
      <RegisteredComponent {...this.props} ns={[PANE_COMPONENT_NS, "**"].join("/")} />
    </div>;
  }
}

