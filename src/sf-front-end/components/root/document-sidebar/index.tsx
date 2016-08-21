import * as React from "react";
import { Workspace } from "sf-front-end/models";
import { DOCUMENT_PANE_COMPONENT_NS } from "sf-front-end/dependencies";
import RegisteredComponent from "sf-front-end/components/registered";

export class DocumentSidebarComponent extends React.Component<{ workspace: Workspace }, any> {
  render() {
    return <div className="m-sidebar left">
      <RegisteredComponent {...this.props} ns={[DOCUMENT_PANE_COMPONENT_NS, "**"].join("/")} />
    </div>;
  }
}
