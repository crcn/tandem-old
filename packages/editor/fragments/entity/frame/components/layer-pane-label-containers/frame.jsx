import React from 'react';
import './frame.scss';

class FrameLabelContainerComponent extends React.Component {
  render() {
    console.log(this.props.children);
    return <div className='m-frame-label-container'>
      { this.props.children }
    </div>
  }
}

export default FrameLabelContainerComponent;
