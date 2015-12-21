import React from 'react';
import cx from 'classnames';

class ToolComponent extends React.Component {
  setTool() {
    this.props.preview.setTool(this.props.plugin.tool);
  }
  render() {
    var plugin = this.props.plugin;

    var className = cx({
      selected: this.props.preview.currentTool === this.props.plugin.tool,
      [ 'm-preview-tool s s-' + plugin.icon ]: true
    });

    return <li className={className} onClick={this.setTool.bind(this)}>

    </li>
  }
}

export default ToolComponent;
