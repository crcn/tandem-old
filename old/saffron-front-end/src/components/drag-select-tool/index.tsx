import './index.scss';
import * as React from 'react';
import BoundingRect from 'sf-front-end/geom/bounding-rect';
import { startDrag } from 'sf-front-end/utils/component/index';
import { SelectAction } from 'sf-front-end/actions/index';
import { ReactComponentFactoryFragment } from 'sf-front-end/fragments/index';

class DragSelectComponent extends React.Component<any, any> {

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    this.props.app.actors.push(this);
  }

  execute(event) {
    if (event.type === 'stageCanvasMouseDown') {
      this.startDrag(event);
    }
  }

  componentWillUnmount() {
    this.props.app.actors.remove(this);
  }

  startDrag(event) {

    var container = (this.refs as any).container;
    var b = container.getBoundingClientRect();

    var entities = this.props.entity.childNodes;

    var left = event.clientX - b.left;
    var top  = event.clientY - b.top;

    this.setState({
      left: left,
      top : top,
      dragging: true,
    });

    startDrag(event, (event2, { delta }) => {

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
        height: h,
      });

      var bounds = new BoundingRect(x, y, x + w, y + h);

      var selection = [];

      entities.forEach(function (entity) {
        if (entity.preview && entity.preview.bounds.intersects(bounds)) {
          selection.push(entity);
        }
      });

      this.props.app.bus.execute(new SelectAction(selection));

    }, () => {
      this.setState({
        dragging: false,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      });
    });
  }

  render() {

    var style = {
      left   : this.state.left,
      top    : this.state.top,
      width  : this.state.width,
      height : this.state.height,
    };

    var box = (<div style={style} className='m-drag-select--box'>
    </div>);

    return (<div ref='container' className='m-drag-select'>
      {this.state.dragging ? box : void 0}
    </div>);
  }
}

export const fragment = new ReactComponentFactoryFragment('components/tools/pointer/drag-select', DragSelectComponent);
