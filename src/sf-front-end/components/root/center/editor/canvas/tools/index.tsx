import "./index.scss";
import * as React from "react";
import RegisteredComponent from "sf-front-end/components/registered";
import { Editor, Workspace } from "sf-front-end/models";
import { IEntity } from "sf-core/entities";

export default class ToolsComponent extends React.Component<{ editor: Editor, workspace: Workspace, entity: IEntity }, any> {
  render() {
    const entity           = this.props.entity;
    const allEntities      = entity.flatten();
    const currentTool      = this.props.editor.currentTool;
    const selectedEntities = this.props.workspace.selection || [];

    return (<div className="m-stage-tools">
      { currentTool ? <RegisteredComponent {...this.props} ns={`components/tools/${currentTool.name}/**`} allEntities={allEntities} selection={selectedEntities} /> : undefined }
    </div>);
  }
}
