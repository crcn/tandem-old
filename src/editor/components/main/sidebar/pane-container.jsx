import React from 'react';
import './pane-container.scss';

class PaneContainerComponent extends React.Component {
  render() {
    return <div className='m-pane-container'>
      <div className='m-pane-container--header'>
        { this.props.entry.label }
      </div>
      { this.props.entry.create(this.props) }
    </div>
  } 
}

export default PaneContainerComponent;
