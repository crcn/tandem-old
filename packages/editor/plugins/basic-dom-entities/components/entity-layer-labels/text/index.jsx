import React from 'react';

class TextLayerLabelComponent extends React.Component {
  render() {
    return <span className='m-label'>
      <i className='s s-text' />
      { this.props.entity.value }
    </span>;
  }
}

export default TextLayerLabelComponent;
