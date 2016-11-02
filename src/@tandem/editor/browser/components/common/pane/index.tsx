import "./index.scss";

import * as React from "react";

export class PaneComponent extends React.Component<{ title?: string, onTitleClick?: (event: React.MouseEvent<any>) => any }, any> {
  render() {
    return <div className="td-gutter-pane">
      <div style={{ display: this.props.title ? "block" : "none", cursor: this.props.onTitleClick ? "pointer" : "default" }} className="td-section-header" onClick={this.props.onTitleClick}>
        { this.props.title }
      </div>
      <div className="td-gutter-pane-content">
        { this.props.children }
      </div>
    </div>;
  }
}

