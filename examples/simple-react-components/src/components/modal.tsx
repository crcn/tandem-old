import "./modal.scss";
import React = require("react");

export class Modal extends React.Component<{ text: string, className?: string }, any> {
  render() {
    const { text } = this.props;
    return <div className="button">
      { text }
    </div>
  }
}