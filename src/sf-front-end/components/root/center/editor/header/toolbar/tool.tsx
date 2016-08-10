import * as cx from "classnames";
import * as React from "react";
import { Editor } from "sf-front-end/models/editor";
import { IActor } from "sf-core/actors";
import { FrontEndApplication } from "sf-front-end/application";
import { SetToolAction } from "sf-front-end/actions";

class ToolComponent extends React.Component<{ app: FrontEndApplication, editor: Editor, tool: IActor }, any> {

  setTool() {
    this.props.app.bus.execute(new SetToolAction(this.props.tool));
  }

  render() {
    const tool = this.props.tool;

    const className = cx({
      selected: this.props.editor.currentTool === tool,
      [`m-preview-tool s s-${tool["icon"]}`]: true,
    });

    return (
      <li
        className={className}
        aria-label={tool["name"]}
        tabIndex="-1"
        role={tool["name"]}
        onClick={this.setTool.bind(this)}
      >

      </li>
    );
  }
}

export default ToolComponent;
