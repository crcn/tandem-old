import "./index.scss";

import React =  require("react");

export class PaneComponent extends React.Component<{ title?: string, onTitleClick?: (event: React.MouseEvent<any>) => any }, any> {
  render() {
    return <div className="td-pane">
      <div style={{ display: this.props.title ? "block" : "none", cursor: this.props.onTitleClick ? "pointer" : "default" }} className="td-section-header" onClick={this.props.onTitleClick}>
        { this.props.title }
      </div>
      { this.props.children }
    </div>;
  }
}

