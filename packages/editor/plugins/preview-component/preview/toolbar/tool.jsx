import React from 'react';

class ToolComponent extends React.Component {
  setTool() {
    this.props.preview.setTool(this.props.entry.tool);
  }
  render() {
    var entry = this.props.entry;
    return <li className={'m-preview-tool s s-' + entry.icon } onClick={this.setTool.bind(this)}>

    </li>
  }
}

export default ToolComponent;
