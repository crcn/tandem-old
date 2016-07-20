"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
require('./index.scss');
const React = require('react');
const index_1 = require('saffron-front-end/src/actions/index');
const index_2 = require('./preview/index');
const index_3 = require('./tools/index');
const isolate_1 = require('saffron-common/src/react/components/isolate');
class EditorStageLayersComponent extends React.Component {
    constructor(...args) {
        super(...args);
        this.onMouseMove = (event) => {
            this._mousePosition = {
                left: event.pageX,
                top: event.pageY
            };
        };
        this.onWheel = (event) => {
            this.onMouseMove(event);
            if (event.metaKey) {
                event.preventDefault();
                this.props.bus.execute({
                    type: 'zoom',
                    delta: event.deltaY / 250
                });
            }
        };
        this.onScroll = () => {
            if (!this._hideTools()) {
                this.forceUpdate();
            }
        };
        this._showTools = () => {
            this._toolsHidden = void 0;
            this.forceUpdate();
        };
        this._center = (newZoom, oldZoom) => {
            function calcPrev(value) {
                return Math.round((value / newZoom) * oldZoom);
            }
            const isolateBody = this.refs.isolate.body;
            var newHeight = isolateBody.scrollHeight;
            var prevHeight = calcPrev(newHeight);
            var newWidth = isolateBody.scrollWidth;
            var prevWidth = calcPrev(newWidth);
            var changeLeft = (newHeight - prevHeight) / 2;
            var changeTop = (newWidth - prevWidth) / 2;
            var scrollTop = isolateBody.scrollTop + changeTop;
            var scrollLeft = isolateBody.scrollLeft + changeLeft;
            isolateBody.scrollTop = scrollTop;
            isolateBody.scrollLeft = scrollLeft;
            this.forceUpdate();
        };
    }
    onMouseDown(event) {
        this.props.app.bus.execute(Object.assign({}, event, {
            type: {
                mousedown: index_1.STAGE_CANVAS_MOUSE_DOWN,
            }[event.type]
        }));
    }
    componentWillUpdate(props) {
        if (this.props.zoom !== props.zoom) {
            requestAnimationFrame(this._center.bind(this, props.zoom, this.props.zoom));
        }
    }
    componentDidMount() {
        const isolateBody = this.refs.isolate.body;
        isolateBody.scrollTop = isolateBody.scrollHeight / 2;
        isolateBody.scrollLeft = isolateBody.scrollWidth / 2;
        this._mousePosition = { left: 0, top: 0 };
    }
    _hideTools() {
        var paused = !!this._toolsHidden;
        if (this._toolsHidden)
            clearTimeout(this._toolsHidden);
        this._toolsHidden = setTimeout(this._showTools, 100);
        return paused;
    }
    render() {
        var app = this.props.app;
        var style = {
            cursor: app.currentTool.cursor
        };
        return (React.createElement(isolate_1.default, {ref: 'isolate', onWheel: this.onWheel, onScroll: this.onScroll, inheritCSS: true, className: 'm-editor-stage-isolate'}, 
            React.createElement("div", {className: 'm-editor-stage-canvas', onMouseMove: this.onMouseMove, style: style, onMouseDown: this.onMouseDown.bind(this)}, 
                React.createElement(index_2.default, __assign({}, this.props)), 
                this._toolsHidden ? void 0 : React.createElement(index_3.default, __assign({}, this.props)))
        ));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EditorStageLayersComponent;
//# sourceMappingURL=index.js.map