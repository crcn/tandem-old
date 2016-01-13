import './index.scss';
import React from 'react';
import { startDrag } from 'common/utils/component';
import { PREVIEW_STAGE_MOUSE_DOWN } from 'editor/message-types';

class DragSelectComponent extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    this.props.app.notifier.push(this);
  }

  notify(message) {
    if (message.type === PREVIEW_STAGE_MOUSE_DOWN) {
      this.startDrag(message);
    }
  }

  componentWillUnmount() {
    this.props.app.notifier.remove(this);
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

    return null;

    // if (this.props.app.selection.length) {
    //   return null;
    // }

    var style = {
      left   : this.state.left,
      top    : this.state.top,
      width  : this.state.width,
      height : this.state.height
    };

    var box = <div style={style} className='m-drag-select--box'>
    </div>;

    return <div ref='container' className='m-drag-select'>
      { this.state.dragging ? box : void 0 }
    </div>;
  }
}

export default DragSelectComponent;
