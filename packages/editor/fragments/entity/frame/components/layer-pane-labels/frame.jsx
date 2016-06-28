import './frame.scss';
import React from 'react';

class FrameLabelComponent extends React.Component {
  render() {
    return <div className='m-frame-label'>
        { this.props.entity.label || 'Frame'}
    </div>;
  }
}

export default FrameLabelComponent;
