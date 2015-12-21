import './index.scss';
import React from 'react';
import { startDrag } from 'common/utils/component';

class ScrollableLabelInput extends React.Component {
  startDrag(event) {
    startDrag(event, function(event, info) {
      console.log(event, info.delta);
    });
  }
  render() {
    return <label className='m-scrollable-label' onMouseDown={this.startDrag.bind(this)}>
      {this.props.children}
    </label>
  }
}

export default ScrollableLabelInput;
