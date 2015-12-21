import './resizer.scss';

import React from 'react';
import startDrag from 'common/utils/component/start-drag';
import PathComponent from './path';
import ObservableObject from 'common/object/observable';
import CallbackNotifier from 'common/notifiers/callback';

const POINT_STROKE_WIDTH = 1;
const POINT_RADIUS       = 3;
const PADDING            = 6;

class ResizerComponent extends React.Component {
  startDragging(event) {
    var focus = this.props.focus;
    var zoom = this.props.zoom;

    var computer = focus.getComputer();

    var sx2 = computer.getZoomedStyle().left;
    var sy2 = computer.getZoomedStyle().top;
    var mx = event.clientX;
    var my = event.clientY;

    startDrag(event, (event) => {
      focus.setPositionFromFixedPoint({
        left: sx2 + event.clientX - mx,
        top: sy2 + event.clientY - my
      });
    });
  }
  updatePoint(point) {
    var focus = this.props.focus;
    var zoom  = this.props.zoom;

    var style = focus.getComputedStyle();

    var props = {
      left: style.left,
      top: style.top,
      width: style.width,
      height: style.height
    };

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

    focus.getComputer().setBounds(props);
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
