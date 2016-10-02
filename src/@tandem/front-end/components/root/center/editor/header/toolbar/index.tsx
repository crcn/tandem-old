import "./index.scss";
import * as React from "react";
import { Editor } from "@tandem/front-end/models";
import ToolComponent from "./tool";
import { EditorToolFactoryDependency } from "@tandem/front-end/dependencies";

class ToolsComponent extends React.Component<{ editor: Editor, app: any }, any> {
  render() {

    // TODO - these can be added as entries as well
    return (<div className="m-editor-toolbar">
      <ul className="m-toolbar-tools">
        {
          EditorToolFactoryDependency.findAll(this.props.editor.type, this.props.app.dependencies).map((dep) => (
            <ToolComponent {...this.props} toolDependency={dep} key={dep.id} />
          ))
        }
      </ul>
    </div>);
  }
}

export default ToolsComponent;
