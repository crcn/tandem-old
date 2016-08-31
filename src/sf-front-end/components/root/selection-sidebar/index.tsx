import * as React from "react";
import { Workspace } from "sf-front-end/models";
import { SettingKeys } from "sf-front-end/constants";
import { SidebarComponent } from "../sidebar";
import { FrontEndApplication } from "sf-front-end/application";
import { ENTITY_PANE_COMPONENT_NS } from "sf-front-end/dependencies";

export class SelectionSidebarComponent extends React.Component<{ app: FrontEndApplication, workspace: Workspace }, any> {
  render() {
    return <SidebarComponent
      {...this.props}
      position="right"
      hideKey={SettingKeys.HIDE_RIGHT_SIDEBAR}
      sizeKey="selectionSidebarSize"
      registeredComponentNs={[ENTITY_PANE_COMPONENT_NS, "**"].join("/")} />;
  }
}

