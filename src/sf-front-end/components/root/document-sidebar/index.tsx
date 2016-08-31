
import * as React from "react";
import { Workspace } from "sf-front-end/models";
import { SettingKeys } from "sf-front-end/constants";
import { SidebarComponent } from "../sidebar";
import { FrontEndApplication } from "sf-front-end/application";
import { DOCUMENT_PANE_COMPONENT_NS } from "sf-front-end/dependencies";

export class DocumentSidebarComponent extends React.Component<{ app: FrontEndApplication, workspace: Workspace }, any> {
  render() {
    return <SidebarComponent
      {...this.props}
      position="left"
      hideKey={SettingKeys.HIDE_LEFT_SIDEBAR}
      maxWidth={800}
      sizeKey="documentSidebarSize"
      registeredComponentNs={[DOCUMENT_PANE_COMPONENT_NS, "**"].join("/")} />;
  }
}

