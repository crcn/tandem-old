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
    // over the p99lace
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

    if (/^n/.test(point.id)) {
      props.top = point.currentStyle.top + point.top;
      props.height = point.currentStyle.height - point.top;
    }

    if (/e$/.test(point.id)) {
      props.width = point.left;
    }

    if (/^s/.test(point.id)) {
      props.height = point.top;
    }

    if (/w$/.test(point.id)) {
      props.width = point.currentStyle.width - point.left;
      props.left  = point.currentStyle.left + point.left;
    }

    focus.setStyle(props);
  }

  render() {

    var pointRadius = (this.props.pointRadius || POINT_RADIUS) / this.props.zoom;
    var strokeWidth = (this.props.strokeWidth || POINT_STROKE_WIDTH) / this.props.zoom;

    var focus = this.props.focus;
    var style = focus.getComputedStyle();

    var points = [
      ['nw', 0, 0],
      ['n', style.width / 2, 0],
      ['ne', style.width, 0],
      ['e', style.width, style.height / 2],
      ['se', style.width, style.height],
      ['s', style.width / 2, style.height],
      ['sw', 0, style.height],
      ['w', 0, style.height / 2]
    ].map((point, i) => {

      var ret = ObservableObject.create({
        id: point[0],
        index: i,
        currentStyle: style,
        left: point[1],
        top : point[2]
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
      <PathComponent points={points} strokeWidth={strokeWidth} pointRadius={pointRadius} showPoints={true} zoom={this.props.zoom}  />
    </div>;
  }
}

export default ResizerComponent;
