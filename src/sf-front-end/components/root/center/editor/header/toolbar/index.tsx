import "./index.scss";
import * as React from "react";
import ToolComponent from "./tool";
import { Editor } from "sf-front-end/models";

class ToolsComponent extends React.Component<{ editor: Editor }, any> {
  render() {

    // TODO - these can be added as entries as well
    return (<div className="m-editor-toolbar">
      <ul className="m-toolbar-tools">
        {
          this
            .props
            .editor
            .tools
            .filter((stageTool) => !!stageTool.icon).map((stageTool) => (
              <ToolComponent {...this.props} tool={stageTool} key={stageTool.name} />)
            )
        }
      </ul>
    </div>);
  }
}

export default ToolsComponent;
