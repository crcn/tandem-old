import "./index.scss";
import * as React from "react";

export class PromptComponent extends React.Component<{ closeable: boolean, render: (props: any) => any, onClose }, any> {
  close = (event?: React.MouseEvent<any>) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.props.onClose();
  }
  render() {
    const { render, onClose, closeable } = this.props;
    return <div className="prompt">
      <div className="modal">
        <a href="#" className="close-button" onClick={this.close}>&times;</a>
        { render({ onClose: onClose }) }
      </div>
    </div>
  }
}