import React from 'react';
import './pane-container.scss';

class PaneContainerComponent extends React.Component {
  render() {
    return <div className='m-pane-container'>
      <div className='m-pane-container--header'>
        { this.props.plugin.label }
      </div>
      { this.props.plugin.factory.create(this.props) }
    </div>
  }
}

export default PaneContainerComponent;
