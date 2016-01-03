import React from 'react';

class HTMLPaneLabelComponent extends React.Component {
  render() {
    return <span className='m-styles-pane--label'>
      { this.props.children }
      <span className='m-styles-pane--add-style' onClick={this.props.onAdd.bind(this)}>
        +
      </span>
    </span>;
  }
}

HTMLPaneLabelComponent.defaultProps = {
  onAdd: function() { }
}

export default HTMLPaneLabelComponent;