import "./index.scss";
import * as React from "react";
import { Workspace } from "@tandem/editor/browser/stores";
import ToolComponent from "./tool";
import { WorkspaceToolFactoryProvider } from "@tandem/editor/browser/providers";

class ToolsComponent extends React.Component<{ workspace: Workspace, app: any }, any> {
  render() {

    // TODO - these can be added as entries as well
    return (<div className="m-editor-toolbar">
      <ul className="m-toolbar-tools">
        {
          WorkspaceToolFactoryProvider.findAll(this.props.workspace.type, this.props.app.injector).map((dep) => (
            <ToolComponent {...this.props} toolProvider={dep} key={dep.id} />
          ))
        }
      </ul>
    </div>);
  }
}

export default ToolsComponent;
