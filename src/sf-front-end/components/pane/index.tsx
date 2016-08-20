import "./index.scss";

import * as React from "react";

class PaneContainerComponent extends React.Component<{ title: string, onTitleClick?: Function }, any> {
  render() {
    return <div className="m-pane-container">
      <div style={{ cursor: this.props.onTitleClick ? "pointer" : "default" }} className="m-pane-container--header" onClick={this.props.onTitleClick}>
        { this.props.title }
      </div>
      <div className="m-pane-container--content">
        { this.props.children }
      </div>
    </div>;
  }
}

export default PaneContainerComponent;
