import "./index.scss";

import * as React from "react";

export class PaneComponent extends React.Component<{ title?: string, onTitleClick?: (event: React.MouseEvent) => any }, any> {
  render() {
    return <div className="gutter-pane">
      <div style={{ display: this.props.title ? "block" : "none", cursor: this.props.onTitleClick ? "pointer" : "default" }} className="gutter-pane-header" onClick={this.props.onTitleClick}>
        { this.props.title }
      </div>
      <div className="gutter-pane-content">
        { this.props.children }
      </div>
    </div>;
  }
}

