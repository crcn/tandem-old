import React from 'react';
import PathComponent from '../path';
import { CallbackNotifier } from 'common/notifiers';
import ObservableObject from 'common/object/observable';
import { startDrag } from 'common/utils/component';


const POINT_STROKE_WIDTH = 1;
const POINT_RADIUS       = 2;

class ResizerComponent extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  onDoubleClick(event) {
    this.props.app.notifier.notify({
      type   : ENTITY_PREVIEW_DOUBLE_CLICK,
      selection : this.props.selection
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
    if (this._dragger) this._dragger.dispose();
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

    event.preventDefault();
  }

  get targetPreview() {
    return this.props.selection.preview;
  }

  updatePoint(point) {
    var selection = this.props.selection;

    selection.preview.getStyle.clear();
    var style = selection.preview.getStyle(true);

    var props = {
      left: style.left,
      top: style.top,
      width: style.width,
      height: style.height
    };

    if (/^n/.test(point.id)) {
      props.top = point.currentStyle.top + point.top / this.props.zoom;
      props.height = point.currentStyle.height - point.top / this.props.zoom;
    }

    if (/e$/.test(point.id)) {
      props.width = point.left / this.props.zoom;
    }

    if (/^s/.test(point.id)) {
      props.height = point.top / this.props.zoom;
    }

    if (/w$/.test(point.id)) {
      props.width = point.currentStyle.width - point.left / this.props.zoom;
      props.left  = point.currentStyle.left + point.left / this.props.zoom;
    }

    if (point.keepAspectRatio) {
      // todo
    }

    selection.preview.setBoundingRect(props);
  }

  startDragging(event) {
    var selection = this.props.selection;

    //var guide = EntityGuide.create(
    //  this.props.app.rootEntity.flatten().filter((entity) => {
    //    return !~this.props.app.selection.indexOf(entity);
    //  }),
    //  SNAP_MARGIN / this.props.zoom
    //);

    var style = selection.preview.getBoundingRect();

    var sx2 = style.left;
    var sy2 = style.top;

    this.setState({ dragging: true });

    this._dragger = startDrag(event, (event, info) => {

      if (!this.targetPreview.getCapabilities().movable) return;

      var nx = sx2 + info.delta.x / this.props.zoom;
      var ny = sy2 + info.delta.y / this.props.zoom;

      // guide.snap - todo
      var bounds = {
        left   : nx,
        top    : ny,
        width  : style.width,
        height : style.height
      };

      this.setState({
        dragBounds: bounds
      });

      this.moveTarget(bounds.left, bounds.top);
    }, () => {
      this.setState({ dragging: false });
      this._dragger = void 0;
    });
  }


  moveTarget(left, top) {
    this.props.app.selection.preview.setPositionFromAbsolutePoint({
      left : left,
      top  : top
    });
  }

  render() {

    var pointRadius = (this.props.pointRadius || POINT_RADIUS);
    var strokeWidth = (this.props.strokeWidth || POINT_STROKE_WIDTH);
    var preview = this.props.selection.preview;

    var rect = preview.getBoundingRect(true);
    var actStyle = preview.getStyle(true);

    var cw = (pointRadius + strokeWidth * 2) * 2;

    // offset stroke
    var resizerStyle = {
      left     : rect.left - cw / 2 + strokeWidth,
      top      : rect.top - cw / 2 + strokeWidth
    };

    var capabilities = preview.getCapabilities();
    var movable = capabilities.movable;

    var points = [
      ['nw', movable == true, 0, 0],
      ['n', movable === true, rect.width / 2, 0],
      ['ne', movable === true, rect.width, 0],
      ['e', true, rect.width, rect.height / 2],
      ['se', true, rect.width, rect.height],
      ['s', true, rect.width / 2, rect.height],
      ['sw', movable === true, 0, rect.height],
      ['w', movable === true, 0, rect.height / 2]
    ].map(([id, show, left, top], i) => {

      var ret = ObservableObject.create({
        id: id,
        index: i,
        show: show,
        currentStyle: actStyle,
        left: left,
        top: top
      });

      ret.notifier = CallbackNotifier.create(this.updatePoint.bind(this, ret));
      return ret;
    });

    return <div ref='selection' className='m-selector-component--selection' style={resizerStyle}
                            onMouseDown={this.startDragging.bind(this)}
                            onDoubleClick={this.onDoubleClick.bind(this)}>
      <PathComponent showPoints={capabilities.resizable && !this.state.dragging} zoom={this.props.zoom} points={points}
                     strokeWidth={strokeWidth} pointRadius={pointRadius}/>
    </div>;

  }
}

export default ResizerComponent;