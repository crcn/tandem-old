import './index.scss';

import React from 'react';
import { startDrag } from 'common/utils/component';
import EntityGuide from './guides/entity';
import PathComponent from './path';
import RulerComponent from './ruler';
import GuideComponent from './guide';
import ObservableObject from 'common/object/observable';
import CallbackNotifier from 'common/notifiers/callback';

import { ENTITY_PREVIEW_DOUBLE_CLICK } from 'editor/message-types';

const POINT_STROKE_WIDTH = 1;
const POINT_RADIUS       = 2;
const PADDING            = 6;
const SNAP_MARGIN        = 4;

function _zoom(style, zoom) {
  return {
    ...style,
    left: style.left * zoom,
    top: style.top * zoom,
    width: style.width * zoom,
    height: style.height * zoom
  }
}

class ResizerComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      moving: false
    };
  }

  _zoom(number) {
    return number / this.props.zoom;
  }

  startDragging(event) {
    var selection = this.props.selection;

    var guide = EntityGuide.create(
      this.props.app.rootEntity.flatten().filter((entity) => {
        return !~this.props.app.selection.indexOf(entity);
      }),
      this._zoom(SNAP_MARGIN)
    );

    var style = selection.preview.getStyle();

    var sx2 = style.left;
    var sy2 = style.top;

    startDrag(event, (event, info) => {

      var nx = sx2 + this._zoom(info.delta.x);
      var ny = sy2 + this._zoom(info.delta.y);

      var bounds = guide.snap({
        left   : nx,
        top    : ny,
        width  : style.width,
        height : style.height
      });

      this.setState({
        dragBounds: bounds
      });

      this.moveTarget(bounds.left, bounds.top);
    });
  }

  updatePoint(point) {

    var selection = this.props.selection;

    var style = selection.preview.getStyle();

    var props = {
      left: style.left,
      top: style.top,
      width: style.width,
      height: style.height
    };

    if (/^n/.test(point.id)) {
      props.top = point.currentStyle.top / this.props.zoom + point.top;
      props.height = point.currentStyle.height / this.props.zoom - point.top;
    }

    if (/e$/.test(point.id)) {
      props.width = point.left;
    }

    if (/^s/.test(point.id)) {
      props.height = point.top;
    }

    if (/w$/.test(point.id)) {
      props.width = point.currentStyle.width / this.props.zoom - point.left;
      props.left  = point.currentStyle.left / this.props.zoom + point.left;
    }

    if (point.keepAspectRatio) {
      // todo
    }

    selection.preview.setBounds(props);
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

  onKeyDown(message) {

    var selection = this.props.app.selection;
    var style = selection.preview.getStyle();

    var left = style.left;
    var top  = style.top;

    if (message.keyCode === 38) {
      top--;
    } else if (message.keyCode === 40) {
      top++;
    } else if (message.keyCode === 37) {
      left--;
    } else if (message.keyCode === 39) {
      left++;
    } else {
      return;
    }

    selection.preview.setPositionFromAbsolutePoint({
      top  : top,
      left : left
    });

    this._isMoving();
    event.preventDefault();
  }

  moveTarget(left, top) {
    this._isMoving();
    this.props.app.selection.preview.setPositionFromAbsolutePoint({
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

    var selection = this.props.selection;
    var style = _zoom(selection.preview.getStyle(), this.props.zoom);

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

    // offset stroke
    var style = {
      left     : style.left - cw / 2 + strokeWidth,
      top      : style.top - cw / 2 + strokeWidth
    }

    var sections = {};

    if (this.state.moving) {
      sections.guides = <div>
        <RulerComponent {...this.props} bounds={style} /> 
        { this.state.dragBounds ? <GuideComponent {...this.props} bounds={this.state.dragBounds} /> : void 0 }
      </div>;
    }

    return <div className='m-resizer-component'>

      <div ref='selection' className='m-resizer-component--selection' style={style} onMouseDown={this.startDragging.bind(this)} onDoubleClick={this.onDoubleClick.bind(this)}>
        <PathComponent zoom={this.props.zoom} points={points} strokeWidth={strokeWidth} pointRadius={pointRadius} showPoints={true}  />
      </div>

      { sections.guides }
    </div>
  }
}

export default ResizerComponent;
