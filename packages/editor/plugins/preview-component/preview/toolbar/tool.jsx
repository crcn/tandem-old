import React from 'react';
import cx from 'classnames';

class ToolComponent extends React.Component {
  setTool() {
    this.props.preview.setTool(this.props.entry.tool);
  }
  render() {
    var entry = this.props.entry;

    var className = cx({
      selected: this.props.preview.currentTool === this.props.entry.tool,
      [ 'm-preview-tool s s-' + entry.icon ]: true
    });

    return <li className={className} onClick={this.setTool.bind(this)}>

    </li>
  }
}

export default ToolComponent;
