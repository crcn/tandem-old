import * as cx from "classnames";
import * as React from "react";
import { Editor } from "sf-front-end/models/editor";
import { IActor } from "sf-core/actors";
import { SetToolAction } from "sf-front-end/actions";
import { FrontEndApplication } from "sf-front-end/application";
import { EditorToolFactoryDependency } from "sf-front-end/dependencies";

class ToolComponent extends React.Component<{ app: FrontEndApplication, editor: Editor, toolDependency: EditorToolFactoryDependency }, any> {

  setTool = () => {
    this.props.app.bus.execute(new SetToolAction(this.props.toolDependency));
  }

  render() {
    const className = cx({
      selected: this.props.editor.currentTool instanceof this.props.toolDependency.clazz,
      [`m-preview-tool s s-${this.props.toolDependency.icon}`]: true,
    });

    return (
      <li
        className={className}
        tabIndex="-1"
        onClick={this.setTool}
      >

      </li>
    );
  }
}

export default ToolComponent;
