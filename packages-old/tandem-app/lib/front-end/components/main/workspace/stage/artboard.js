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
require("./artboard.scss");
var VOID_ELEMENTS = require("void-elements");
var React = require("react");
var react_motion_1 = require("react-motion");
var recompose_1 = require("recompose");
var actions_1 = require("front-end/actions");
var stiffSpring = function (amount) { return react_motion_1.spring(amount, { stiffness: 330, damping: 30 }); };
var ArtboardMountBase = function (_a) {
    var setContainer = _a.setContainer;
    return React.createElement("div", { ref: setContainer });
};
var enhanceArtboardMount = recompose_1.compose(recompose_1.pure, recompose_1.withState("container", "setContainer", null), recompose_1.lifecycle({
    shouldComponentUpdate: function (props) {
        return this.props.mount !== props.mount || this.props.container !== props.container;
    },
    componentDidUpdate: function () {
        var _a = this.props, dispatch = _a.dispatch, container = _a.container, mount = _a.mount, artboardId = _a.artboardId;
        if (container && mount) {
            if (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            container.appendChild(mount);
            dispatch(actions_1.artboardMounted(artboardId));
            // TODO - dispatch mounted here
        }
    }
}));
var ArtboardMount = enhanceArtboardMount(ArtboardMountBase);
var ArtboardBase = function (_a) {
    var artboard = _a.artboard, fullScreenArtboardId = _a.fullScreenArtboardId, dispatch = _a.dispatch, smooth = _a.smooth;
    var bounds = artboard.bounds, document = artboard.document;
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
        display: fullScreenArtboardId && artboard.$id !== fullScreenArtboardId ? "none" : undefined
    };
    var smoothStyle = smooth ? {
        left: stiffSpring(style.left),
        top: stiffSpring(style.top),
        width: stiffSpring(style.width),
        height: stiffSpring(style.height)
    } : style;
    return React.createElement(react_motion_1.Motion, { defaultStyle: style, style: smoothStyle, onRest: function () { return dispatch(actions_1.canvasMotionRested()); } }, function (style) {
        return React.createElement("div", { className: "preview-artboard-component", style: __assign({}, style, defaultStyle) },
            React.createElement(ArtboardMount, { artboardId: artboard.$id, mount: artboard.mount, dispatch: dispatch }));
    });
};
exports.Artboard = recompose_1.pure(ArtboardBase);
exports.Preview = function () { return React.createElement("div", null, "PREVIEW!"); };
//# sourceMappingURL=artboard.js.map