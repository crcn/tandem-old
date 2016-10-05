import * as React from "react";
import { Workspace } from "@tandem/editor/models";
import { SettingKeys } from "@tandem/editor/constants";
import { GutterComponent } from "../gutter";
import { FrontEndApplication } from "@tandem/editor/application";
import { ENTITY_PANE_COMPONENT_NS } from "@tandem/editor/dependencies";

export class SelectionGutterComponent extends React.Component<{ app: FrontEndApplication, workspace: Workspace }, any> {
  render() {
    return <GutterComponent
      {...this.props}
      position="right"
      hideKey={SettingKeys.HIDE_RIGHT_SIDEBAR}
      sizeKey="selectionSidebarSize"
      registeredComponentNs={[ENTITY_PANE_COMPONENT_NS, "**"].join("/")} />;
  }
}

