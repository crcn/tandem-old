import "./index.scss";

import * as React from "react";

class PaneContainerComponent extends React.Component<{ title: string }, any> {
  render() {
    return <div className="m-pane-container">
      <div className="m-pane-container--header">
        { this.props.title }
      </div>
      <div className="m-pane-container--content">
        { this.props.children }
      </div>
    </div>;
  }
}

export default PaneContainerComponent;
