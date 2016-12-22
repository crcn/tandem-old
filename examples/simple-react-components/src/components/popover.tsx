import React = require("react");

export class Popover extends React.Component<{ text: string, className?: string }, any> {
  render() {
    const { text } = this.props;
    return <div className="popover">
      { text }
    </div>
  }
}