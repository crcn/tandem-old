import "./index.scss";
import * as React from "react";
import { IEntity } from "@tandem/common/lang/entities";
import { RegisteredComponent } from "@tandem/editor/components/common";
import { Editor, Workspace } from "@tandem/editor/models";

export default class ToolsComponent extends React.Component<{ editor: Editor, workspace: Workspace }, any> {
  render() {
    const allEntities      = [];
    const currentTool      = this.props.editor.currentTool;
    const selectedEntities = [];

    return (<div className="m-stage-tools">
      { currentTool ? <RegisteredComponent {...this.props} tool={currentTool} ns={`components/tools/**`} allEntities={allEntities} selection={selectedEntities} /> : undefined }
    </div>);
  }
}
