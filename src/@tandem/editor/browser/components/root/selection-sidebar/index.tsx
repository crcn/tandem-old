import * as React from "react";
import { SettingKeys } from "@tandem/editor/browser/constants";
import { GutterComponent } from "../gutter";
import { FrontEndApplication } from "@tandem/editor/browser/application";
import { ENTITY_PANE_COMPONENT_NS } from "@tandem/editor/browser/dependencies";

export class SelectionGutterComponent extends React.Component<{}, {}> {
  render() {
    return <GutterComponent
      position="right"
      hideKey={SettingKeys.HIDE_RIGHT_SIDEBAR}
      sizeKey="selectionSidebarSize"
      registeredComponentNs={[ENTITY_PANE_COMPONENT_NS, "**"].join("/")} />;
  }
}

