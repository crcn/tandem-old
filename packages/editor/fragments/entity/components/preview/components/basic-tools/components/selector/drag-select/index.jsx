import './index.scss';
import React from 'react';
import { startDrag } from 'common/utils/component';

class DragSelectComponent extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  startDrag(event) {

    var container = this.refs.container;
    var b = container.getBoundingClientRect();

    this.setState({
      left: event.clientX - b.left,
      top : event.clientY - b.top,
      dragging: true
    });

    startDrag(event, (event, info) => {
      this.setState({
        width: info.delta.x,
        height: info.delta.y
      });
    }, () => {
      this.setState({
        dragging: false,
        left: 0,
        top: 0,
        width: 0,
        height: 0
      })
    });
  }

  render() {

    var style = {
      left   : this.state.left,
      top    : this.state.top,
      width  : this.state.width,
      height : this.state.height
    };

    var box = <div style={style} className='m-drag-select--box'>
    </div>;

    return <div ref='container' className='m-drag-select' onMouseDown={this.startDrag.bind(this)}>
      { this.state.dragging ? box : void 0 }
    </div>;
  }
}

export default DragSelectComponent;