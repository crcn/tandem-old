import './index.scss';

import React from 'react';

class PaneContainerComponent extends React.Component {
  render() {
    return <div className='m-pane-container'>
      <div className='m-pane-container--header'>
        { this.props.label }
      </div>
      <div className='m-pane-container--content'>
        { this.props.children }
      </div>
    </div>
  }
}

export default PaneContainerComponent;
