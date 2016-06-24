import cx from 'classnames';
import React from 'react';

class ToolComponent extends React.Component {
  setTool() {
    this.props.preview.setTool(this.props.fragment.tool);
  }
  render() {
    var fragment = this.props.fragment;

    var className = cx({
      selected: this.props.preview.currentTool === this.props.fragment.tool,
      [ 'm-preview-tool s s-' + fragment.icon ]: true
    });

    return <li className={className} aria-label={fragment.name} tabIndex="-1" role={fragment.name} onClick={this.setTool.bind(this)}>

    </li>
  }
}

export default ToolComponent;
