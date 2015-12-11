import './resizer.scss';
import React from 'react';
import PathComponent from './path';
import ObservableObject from 'common/object/observable';
import CallbackNotifier from 'common/notifiers/callback';
import startDrag from 'common/utils/component/start-drag';

const POINT_STROKE_WIDTH = 1;
const POINT_RADIUS       = 3;
const PADDING            = 6;

class ResizerComponent extends React.Component {
  startDragging(event) {
    var focus = this.props.focus;

    var sx = this.props.focus.attributes.style.left;
    var sy = this.props.focus.attributes.style.top;

    startDrag(event, (data) => {
      focus.setStyle({
        left: sx + data.leftDelta,
        top: sy + data.topDelta
      });
    });
  }
  updatePoint(point) {
    var focus = this.props.focus;
    var props = {};

    if (point.index === 0) {
      props = {
        left   : point.currentStyle.left + point.left,
        top    : point.currentStyle.top + point.top,
        height : point.currentStyle.height - point.top,
        width  : point.currentStyle.width - point.left
      };
    } else if (point.index === 1) {
      props = {
        top    :  point.currentStyle.top + point.top,
        height : point.currentStyle.height - point.top,
        width  : point.left
      };
    } else if (point.index === 2) {
      props = {
        height : point.top,
        width  : point.left
      };
    } else if (point.index === 3) {
      props = {
        left   : point.currentStyle.left + point.left,
        height : point.top,
        width  : point.currentStyle.width - point.left
      };
    }

    focus.setStyle(focus.attributes.style);
  }
  render() {


    var focus = this.props.focus;
    var style = focus.getComputedStyle();

    var points = [
      [0, 0],
      [style.width, 0],
      [style.width, style.height],
      [0, style.height]
    ].map((point, i) => {

      var ret = ObservableObject.create({
        index: i,
        currentStyle: style,
        left: point[0],
        top : point[1]
      });

      ret.notifier = CallbackNotifier.create(this.updatePoint.bind(this, ret));
      return ret;
    });

    var cw = (POINT_RADIUS + POINT_STROKE_WIDTH * 2) * 2;

    var style = {
      position: 'absolute',
      left: style.left - cw / 2,
      top: style.top - cw / 2
    }

    return <div className='m-resizer-component' style={style} onMouseDown={this.startDragging.bind(this)}>
      <PathComponent points={points} strokeWidth={POINT_STROKE_WIDTH} pointRadius={POINT_RADIUS} showPoints={true}  />
    </div>;
  }
}

export default ResizerComponent;
