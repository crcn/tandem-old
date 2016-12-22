import "./index.scss";
import React =  require("react");
import ToolbarComponent from "./toolbar";

export default class StageEditorHeaderComponent extends React.Component<any, any> {
  render() {
    return (<div className="m-editor-stage-header">
      <ToolbarComponent {...this.props} />
    </div>);
  }
}
