import * as React from "react";
import { SettingKeys } from "@tandem/editor/browser/constants";
import { GutterComponent } from "../gutter";
import { FrontEndApplication } from "@tandem/editor/browser/application";
import { ENTITY_PANE_COMPONENT_NS } from "@tandem/editor/browser/providers";

import { Workspace } from "@tandem/editor/browser/models";
import { Metadata } from "@tandem/common";

export class SelectionGutterComponent extends React.Component<{ settings: Metadata, workspace: Workspace }, {}> {
  render() {
    return <GutterComponent
      position="right"
      settings={this.props.settings}
      workspace={this.props.workspace}
      hideKey={SettingKeys.HIDE_RIGHT_SIDEBAR}
      sizeKey="selectionSidebarSize"
      registeredComponentNs={[ENTITY_PANE_COMPONENT_NS, "**"].join("/")} />;
  }
}

