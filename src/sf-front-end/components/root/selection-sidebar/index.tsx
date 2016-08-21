import * as React from "react";
import { Workspace } from "sf-front-end/models";
import { ENTITY_PANE_COMPONENT_NS } from "sf-front-end/dependencies";
import RegisteredComponent from "sf-front-end/components/registered";

export class SelectionSidebarComponent extends React.Component<{ workspace: Workspace }, any> {
  render() {
    return <div className="m-sidebar right">
      <RegisteredComponent {...this.props} ns={[ENTITY_PANE_COMPONENT_NS, "**"].join("/")} />
    </div>;
  }
}

