
import * as React from "react";
import { Workspace } from "@tandem/editor/models";
import { SettingKeys } from "@tandem/editor/constants";
import { GutterComponent } from "../gutter";
import { FrontEndApplication } from "@tandem/editor/application";
import { DOCUMENT_PANE_COMPONENT_NS } from "@tandem/editor/dependencies";

export class DocumentGutterComponent extends React.Component<{ app: FrontEndApplication, workspace: Workspace }, any> {
  render() {
    return <GutterComponent
      {...this.props}
      position="left"
      hideKey={SettingKeys.HIDE_LEFT_SIDEBAR}
      maxWidth={800}
      sizeKey="documentSidebarSize"
      registeredComponentNs={[DOCUMENT_PANE_COMPONENT_NS, "**"].join("/")} />;
  }
}

