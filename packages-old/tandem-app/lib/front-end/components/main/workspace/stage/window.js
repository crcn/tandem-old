"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./window.scss");
var VOID_ELEMENTS = require("void-elements");
var React = require("react");
var react_motion_1 = require("react-motion");
var recompose_1 = require("recompose");
var actions_1 = require("front-end/actions");
var stiffSpring = function (amount) { return react_motion_1.spring(amount, { stiffness: 330, damping: 30 }); };
var WindowMountBase = function (_a) {
    var setContainer = _a.setContainer;
    return React.createElement("div", { ref: setContainer });
};
var enhanceWindowMount = recompose_1.compose(recompose_1.pure, recompose_1.withState("container", "setContainer", null), recompose_1.lifecycle({
    shouldComponentUpdate: function (props) {
        return this.props.renderContainer !== props.renderContainer || this.props.container !== props.container;
    },
    componentDidUpdate: function () {
        var _a = this.props, container = _a.container, renderContainer = _a.renderContainer;
        if (container && renderContainer) {
            if (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            container.appendChild(renderContainer);
            // TODO - dispatch mounted here
        }
    }
}));
var WindowMount = enhanceWindowMount(WindowMountBase);
var WindowBase = function (_a) {
    var window = _a.window, fullScreenWindowId = _a.fullScreenWindowId, dispatch = _a.dispatch, smooth = _a.smooth;
    var bounds = window.bounds, document = window.document;
    var style = {
        left: bounds.left,
        top: bounds.top,
        width: bounds.right - bounds.left,
        height: bounds.bottom - bounds.top,
    };
    var defaultStyle = {
        // default to white since window background colors
        // are white too (CC)
        background: "white",
        display: fullScreenWindowId && window.$id !== fullScreenWindowId ? "none" : undefined
    };
    var smoothStyle = smooth ? {
        left: stiffSpring(style.left),
        top: stiffSpring(style.top),
        width: stiffSpring(style.width),
        height: stiffSpring(style.height)
    } : style;
    return React.createElement(react_motion_1.Motion, { defaultStyle: style, style: smoothStyle, onRest: function () { return dispatch(actions_1.canvasMotionRested()); } }, function (style) {
        return React.createElement("div", { className: "preview-window-component", style: __assign({}, style, defaultStyle) },
            React.createElement(WindowMount, { renderContainer: window.renderContainer }));
    });
};
exports.Window = recompose_1.pure(WindowBase);
exports.Preview = function () { return React.createElement("div", null, "PREVIEW!"); };
//# sourceMappingURL=window.js.map