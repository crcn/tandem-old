"use strict";
require('./index.scss');
const React = require('react');
const bounding_rect_1 = require('saffron-common/src/geom/bounding-rect');
const index_1 = require('saffron-common/src/utils/component/index');
const index_2 = require('saffron-front-end/src/actions/index');
const index_3 = require('saffron-common/src/utils/geom/index');
const index_4 = require('saffron-common/src/react/fragments/index');
class DragSelectComponent extends React.Component {
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
        var container = this.refs.container;
        var b = container.getBoundingClientRect();
        var entities = this.props.entity.childNodes;
        var left = event.clientX - b.left;
        var top = event.clientY - b.top;
        this.setState({
            left: left,
            top: top,
            dragging: true,
        });
        index_1.startDrag(event, (event2, { delta }) => {
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
            var bounds = new bounding_rect_1.default({
                left: x,
                top: y,
                right: x + w,
                bottom: y + h,
            });
            var selection = [];
            entities.forEach(function (entity) {
                if (entity.preview && index_3.boundsIntersect(entity.preview.getBoundingRect(true), bounds)) {
                    selection.push(entity);
                }
            });
            this.props.app.bus.execute(new index_2.SelectAction(selection));
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
            left: this.state.left,
            top: this.state.top,
            width: this.state.width,
            height: this.state.height,
        };
        var box = (React.createElement("div", {style: style, className: 'm-drag-select--box'}));
        return (React.createElement("div", {ref: 'container', className: 'm-drag-select'}, this.state.dragging ? box : void 0));
    }
}
exports.fragment = new index_4.ReactComponentFactoryFragment('components/tools/pointer/drag-select', DragSelectComponent);
//# sourceMappingURL=index.js.map