import './index.scss';
import React from 'react';
import BoundingRect from 'common/geom/bounding-rect';
import { startDrag } from 'common/utils/component';
import { SelectEvent } from 'editor-fragment/selection/events';
import { STAGE_PREVIEW_MOUSE_DOWN } from 'editor-fragment/events';
import { boundsIntersect } from 'common/utils/geom';
import { ReactComponentFactoryFragment } from 'common/react/fragments';

class DragSelectComponent extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    this.props.app.busses.push(this);
  }

  execute(event) {
    if (event.type === STAGE_PREVIEW_MOUSE_DOWN) {
      this.startDrag(event);
    }
  }

  componentWillUnmount() {
    this.props.app.busses.remove(this);
  }

  startDrag(event) {

    var container = this.refs.container;
    var b = container.getBoundingClientRect();

    var entities = this.props.app.rootEntity.childNodes;

    var left = event.clientX - b.left;
    var top  = event.clientY - b.top;

    this.setState({
      left: left,
      top : top,
      dragging: true
    });


    startDrag(event, (event, { delta }) => {

      var x = left;
      var y = top;
      var w = Math.abs(delta.x);
      var h = Math.abs(delta.y);

      if (delta.x < 0) {
        x = left - w;
      }

      if (delta.y < 0) {
        y = top - h;
      }

      this.setState({
        left: x,
        top: y,
        width: w,
        height: h
      });

      var bounds = BoundingRect.create({
        left   : x,
        top    : y,
        right  : x + w,
        bottom : y + h
      });

      var selection = [];

      entities.forEach(function(entity) {
        if (boundsIntersect(entity.preview.getBoundingRect(true), bounds)) {
          selection.push(entity);
        }
      });

      app.bus.execute(SelectEvent.create(selection));

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

    return <div ref='container' className='m-drag-select'>
      { this.state.dragging ? box : void 0 }
    </div>;
  }
}

export const fragment = ReactComponentFactoryFragment.create('components/tools/selectable', DragSelectComponent);
