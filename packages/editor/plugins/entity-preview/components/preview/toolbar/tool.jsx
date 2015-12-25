import cx from 'classnames';
import React from 'react';

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

    return <li className={className} aria-label={plugin.name} tabIndex="-1" role={plugin.name} onClick={this.setTool.bind(this)}>

    </li>
  }
}

export default ToolComponent;
