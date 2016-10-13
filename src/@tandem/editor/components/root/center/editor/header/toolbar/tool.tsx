import * as cx from "classnames";
import * as React from "react";
import { Editor } from "@tandem/editor/models/editor";
import { IActor } from "@tandem/common/actors";
import { SetToolAction } from "@tandem/editor/actions";
import { FrontEndApplication } from "@tandem/editor/application";
import { EditorToolFactoryDependency } from "@tandem/editor/dependencies";

class ToolComponent extends React.Component<{ app: FrontEndApplication, editor: Editor, toolDependency: EditorToolFactoryDependency }, any> {

  setTool = () => {
    this.props.app.bus.execute(new SetToolAction(this.props.toolDependency));
  }

  render() {
    const dep = this.props.toolDependency;

    const className = cx({
      selected: this.props.editor.currentTool instanceof this.props.toolDependency.clazz,
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
