import * as cx from "classnames";
import * as React from "react";
import { IActor } from "@tandem/common/actors";
import { Workspace } from "@tandem/editor/browser/models";
import { SetToolAction } from "@tandem/editor/browser/actions";
import { FrontEndApplication } from "@tandem/editor/browser/application";
import { WorkspaceToolFactoryProvider } from "@tandem/editor/browser/providers";

class ToolComponent extends React.Component<{ app: FrontEndApplication, workspace: Workspace, toolProvider: WorkspaceToolFactoryProvider }, any> {

  setTool = () => {
    this.props.app.bus.execute(new SetToolAction(this.props.toolProvider));
  }

  render() {
    const dep = this.props.toolProvider;

    const className = cx({
      selected: false,
      [`m-preview-tool s s-${this.props.toolProvider.icon}`]: true,
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
