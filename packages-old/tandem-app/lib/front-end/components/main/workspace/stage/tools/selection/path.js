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
require("./path.scss");
var React = require("react");
var recompose_1 = require("recompose");
var actions_1 = require("front-end/actions");
var aerial_common2_1 = require("aerial-common2");
// padding prevents the SVG from getting cut off when transform is applied - particularly during zoom. 
var PADDING = 10;
exports.PathBase = function (_a) {
    var bounds = _a.bounds, points = _a.points, zoom = _a.zoom, pointRadius = _a.pointRadius, strokeWidth = _a.strokeWidth, _b = _a.showPoints, showPoints = _b === void 0 ? true : _b, onPointClick = _a.onPointClick;
    var width = bounds.right - bounds.left;
    var height = bounds.bottom - bounds.top;
    var cr = pointRadius;
    var crz = cr / zoom;
    var cw = cr * 2;
    var cwz = cw / zoom;
    var w = width + PADDING + Math.max(cw, cwz);
    var h = height + PADDING + Math.max(cw, cwz);
    var p = 100;
    var style = {
        width: w,
        height: h,
        left: -PADDING / 2,
        top: -PADDING / 2,
        position: "relative"
    };
    return React.createElement("svg", { style: style, viewBox: [0, 0, w, h].join(" "), className: "resizer-path" }, showPoints !== false ? points.map(function (path, key) {
        return React.createElement("rect", { onMouseDown: function (event) { return onPointClick(path, event); }, className: "point-circle-" + (path.top * 100) + "-" + path.left * 100, strokeWidth: 0, stroke: "black", fill: "transparent", width: cwz, height: cwz, x: path.left * width + PADDING / 2, y: path.top * height + PADDING / 2, rx: 0, ry: 0, key: key });
    }) : void 0);
};
var enhancePath = recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onPointClick: function (_a) {
        var bounds = _a.bounds, dispatch = _a.dispatch, zoom = _a.zoom, workspace = _a.workspace;
        return function (point, event) {
            event.stopPropagation();
            var sourceEvent = __assign({}, event);
            aerial_common2_1.startDOMDrag(event, (function () { }), function (event2, info) {
                var delta = {
                    left: info.delta.x / zoom,
                    top: info.delta.y / zoom
                };
                dispatch(actions_1.resizerPathMoved(workspace.$id, point, bounds, {
                    left: point.left === 0 ? bounds.left + delta.left : bounds.left,
                    top: point.top === 0 ? bounds.top + delta.top : bounds.top,
                    right: point.left === 1 ? bounds.right + delta.left : bounds.right,
                    bottom: point.top === 1 ? bounds.bottom + delta.top : bounds.bottom,
                }, event2));
            }, function (event) {
                dispatch(actions_1.resizerPathStoppedMoving(workspace.$id, event));
            });
        };
    }
}));
exports.Path = enhancePath(exports.PathBase);
//# sourceMappingURL=path.js.map