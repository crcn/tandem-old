import "./index.scss";
import * as React from "react";
import { Editor } from "@tandem/editor/models";
import { RegisteredComponent } from "@tandem/editor/components/common";

export default class ToolsComponent extends React.Component<{ editor: Editor }, any> {
  render() {
    const allEntities      = [];
    const currentTool      = this.props.editor.currentTool;
    const selectedEntities = [];

    return (<div className="m-stage-tools">
      { currentTool ? <RegisteredComponent {...this.props} tool={currentTool} ns={`components/tools/**`} allEntities={allEntities} selection={selectedEntities} /> : undefined }
    </div>);
  }
}
