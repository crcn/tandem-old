import * as cx from "classnames";
import * as React from "react";
import { IActor } from "@tandem/common/actors";
import { Workspace } from "@tandem/editor/browser/models";
import { SetToolAction } from "@tandem/editor/browser/actions";
import { FrontEndApplication } from "@tandem/editor/browser/application";
import { WorkspaceToolFactoryDependency } from "@tandem/editor/browser/dependencies";

class ToolComponent extends React.Component<{ app: FrontEndApplication, workspace: Workspace, toolDependency: WorkspaceToolFactoryDependency }, any> {

  setTool = () => {
    this.props.app.bus.execute(new SetToolAction(this.props.toolDependency));
  }

  render() {
    const dep = this.props.toolDependency;

    const className = cx({
      selected: this.props.workspace.currentTool instanceof this.props.toolDependency.clazz,
      [`m-preview-tool s s-${this.props.toolDependency.icon}`]: true,
    });

    return (
      <li
        className={className}
        tabIndex={-1}
        onClick={this.setTool}
        title={`${dep.id} (${dep.keyCommand})`}
      >

      </li>
    );
  }
}

export default ToolComponent;
