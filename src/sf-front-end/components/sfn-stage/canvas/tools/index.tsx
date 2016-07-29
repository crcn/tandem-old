import "./index.scss";
import * as React from "react";
import RegisteredComponent from "sf-front-end/components/registered";

export default class ToolsComponent extends React.Component<any, any> {
  render() {
    const entity           = this.props.entity;
    const allEntities      = entity.flatten();
    const currentTool      = this.props.app.currentTool || {};
    const selectedEntities = this.props.app.selection || [];
    const zoom             = this.props.app.zoom;

    return (<div className="m-stage-tools">
      <RegisteredComponent {...this.props} ns={`components/tools/${currentTool.name}/**`} allEntities={allEntities} selection={selectedEntities} zoom={zoom} />
    </div>);
  }
}
