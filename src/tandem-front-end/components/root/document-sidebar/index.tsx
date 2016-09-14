
import * as React from "react";
import { Workspace } from "tandem-front-end/models";
import { SettingKeys } from "tandem-front-end/constants";
import { GutterComponent } from "../gutter";
import { FrontEndApplication } from "tandem-front-end/application";
import { DOCUMENT_PANE_COMPONENT_NS } from "tandem-front-end/dependencies";

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

