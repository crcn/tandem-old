import './index.scss';

import React from 'react';
import { startDrag } from 'common/utils/component';
import PathComponent from './path';
import RulerComponent from './ruler';
import ObservableObject from 'common/object/observable';
import CallbackNotifier from 'common/notifiers/callback';

import { ENTITY_PREVIEW_DOUBLE_CLICK } from 'editor/message-types';

const POINT_STROKE_WIDTH = 1;
const POINT_RADIUS       = 2;
const PADDING            = 6;

class ResizerComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      moving: false
    };
  }
  startDragging(event) {
    var focus = this.props.entity;

    var computer = focus.getComputer();

    var sx2 = computer.getZoomedStyle().left;
    var sy2 = computer.getZoomedStyle().top;

    startDrag(event, (event, info) => {

      var nx = sx2 + info.delta.x;
      var ny = sy2 + info.delta.y;

      // TODO - implement tug here. Something like this. Can
      // be a fragment
      // if (nx > 400 && nx < 450) {
      //   nx = 425;
      // }

      this.moveTarget(nx, ny);
    });
  }

  updatePoint(point) {
    var focus = this.props.entity;

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

  onDoubleClick(event) {
    this.props.app.notifier.notify({
      type   : ENTITY_PREVIEW_DOUBLE_CLICK,
      entity : this.props.entity
    });
  }

  componentDidMount() {
    this.props.app.notifier.push(this);
  }

  notify(message) {
    if (message.type !== 'keydown') return;
    this.onKeyDown(message);
  }

  componentWillUnmount() {
    this.props.app.notifier.remove(this);
  }

  onKeyDown(event) {

    var entity = this.props.app.focus;
    var style = entity.getComputedStyle();

    var left = style.left;
    var top  = style.top;

    if (event.keyCode === 38) {
      top--;
    } else if (event.keyCode === 40) {
      top++;
    } else if (event.keyCode === 37) {
      left--;
    } else if (event.keyCode === 39) {
      left++;
    } else {
      return;
    }

    entity.getComputer().setPositionFromAbsolutePoint({
      top  : top,
      left : left
    });

    this._isMoving();
    event.preventDefault();
  }

  moveTarget(left, top) {
    this._isMoving();
    this.props.app.focus.setPositionFromFixedPoint({
      left : left,
      top  : top
    });
  }

  _isMoving() {
    clearTimeout(this._movingTimer);
    this.setState({ moving: true });
    this._movingTimer = setTimeout(() => {
      this.setState({ moving: false });
    }, 1000);
  }

  render() {

    var pointRadius = (this.props.pointRadius || POINT_RADIUS);
    var strokeWidth = (this.props.strokeWidth || POINT_STROKE_WIDTH);

    var focus = this.props.entity;
    var style = focus.getComputer().getZoomedStyle();

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
      left     : style.left - cw / 2,
      top      : style.top - cw / 2
    }

    return <div className='m-resizer-component'>

      <div ref='selection' className='m-resizer-component--selection' style={style} onMouseDown={this.startDragging.bind(this)} onDoubleClick={this.onDoubleClick.bind(this)}>
        <PathComponent points={points} strokeWidth={strokeWidth} pointRadius={pointRadius} showPoints={true}  />
      </div>

      { this.state.moving ? <RulerComponent {...this.props} bounds={style} /> : void 0 }
    </div>
  }
}

export default ResizerComponent;
