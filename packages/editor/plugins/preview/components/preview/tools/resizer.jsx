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
    var zoom = this.props.zoom;

    // augment this shit so that we don't sprinkle zoom around all
    // over the place
    // TODO componentUtils.getActualComputedStyle(this.props)
    var sx = this.props.focus.attributes.style.left * zoom;
    var sy = this.props.focus.attributes.style.top * zoom;
    var mx = event.clientX;
    var my = event.clientY;

    startDrag(event, (event) => {
      focus.setStyle({
        left: (sx + event.clientX - mx) / zoom,
        top: (sy + event.clientY - my) / zoom
      });
    });
  }
  updatePoint(point) {
    var focus = this.props.focus;
    var zoom  = this.props.zoom;
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

    console.log(props);

    for (var key in props) {
      // props[key] /= this.props.zoom;
    }

    focus.setStyle(props);
  }
  render() {

    var pointRadius = (this.props.pointRadius || POINT_RADIUS) / this.props.zoom;
    var strokeWidth = (this.props.strokeWidth || POINT_STROKE_WIDTH) / this.props.zoom;

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

    var cw = (pointRadius + strokeWidth * 2) * 2;

    var style = {
      position: 'absolute',
      left: style.left - cw / 2,
      top: style.top - cw / 2
    }

    return <div className='m-resizer-component' style={style} onMouseDown={this.startDragging.bind(this)}>
      <PathComponent points={points} strokeWidth={strokeWidth} pointRadius={pointRadius} showPoints={true}  />
    </div>;
  }
}

export default ResizerComponent;
