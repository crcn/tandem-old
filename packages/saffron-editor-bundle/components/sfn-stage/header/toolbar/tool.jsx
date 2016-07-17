import cx from 'classnames';
import React from 'react';

class ToolComponent extends React.Component {

  setTool() {
    this.props.app.bus.execute({
      type: 'setCurrentTool',
      tool: this.props.tool
    });
  }

  render() {
    const tool = this.props.tool;

    const className = cx({
      selected: this.props.app.currentTool === tool,
      [`m-preview-tool s s-${tool.icon}`]: true,
    });

    return (
      <li
        className={className}
        aria-label={tool.name}
        tabIndex='-1'
        role={tool.name}
        onClick={this.setTool.bind(this)}
      >

      </li>
    );
  }
}

export default ToolComponent;
