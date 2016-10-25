import "./index.scss";
import * as React from "react";
import { Workspace } from "@tandem/editor/browser/models";
import ToolComponent from "./tool";
import { WorkspaceToolFactoryDependency } from "@tandem/editor/browser/dependencies";

class ToolsComponent extends React.Component<{ workspace: Workspace, app: any }, any> {
  render() {

    // TODO - these can be added as entries as well
    return (<div className="m-editor-toolbar">
      <ul className="m-toolbar-tools">
        {
          WorkspaceToolFactoryDependency.findAll(this.props.workspace.type, this.props.app.dependencies).map((dep) => (
            <ToolComponent {...this.props} toolDependency={dep} key={dep.id} />
          ))
        }
      </ul>
    </div>);
  }
}

export default ToolsComponent;
