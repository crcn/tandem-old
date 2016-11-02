
import * as React from "react";
import { SettingKeys } from "@tandem/editor/browser/constants";
import { Workspace } from "@tandem/editor/browser/models";
import { Metadata } from "@tandem/common";
import { GutterComponent } from "../gutter";
import { FrontEndApplication } from "@tandem/editor/browser/application";
import { DOCUMENT_PANE_COMPONENT_NS } from "@tandem/editor/browser/providers";

export class DocumentGutterComponent extends React.Component<{ settings: Metadata, workspace: Workspace }, {}> {

  render() {
    // console.log(this.context.injector, "DEP");
    return <GutterComponent
      workspace={this.props.workspace}
      settings={this.props.settings}
      position="left"
      hideKey={SettingKeys.HIDE_LEFT_SIDEBAR}
      maxWidth={800}
      sizeKey="documentSidebarSize"
      registeredComponentNs={[DOCUMENT_PANE_COMPONENT_NS, "**"].join("/")} />;
  }
}

