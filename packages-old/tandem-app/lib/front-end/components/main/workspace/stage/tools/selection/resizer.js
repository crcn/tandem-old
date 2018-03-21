"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("./resizer.scss");
var React = require("react");
var lodash_1 = require("lodash");
var recompose_1 = require("recompose");
var state_1 = require("front-end/state");
var actions_1 = require("front-end/actions");
var aerial_common2_1 = require("aerial-common2");
var path_1 = require("./path");
var POINT_STROKE_WIDTH = 1;
var POINT_RADIUS = 4;
exports.ResizerBase = function (_a) {
    var workspace = _a.workspace, dispatch = _a.dispatch, onMouseDown = _a.onMouseDown, zoom = _a.zoom;
    var bounds = state_1.getWorkspaceSelectionBounds(workspace);
    // offset stroke
    var resizerStyle = {
        position: "absolute",
        left: bounds.left,
        top: bounds.top,
        width: bounds.right - bounds.left,
        height: bounds.bottom - bounds.top,
        transform: "translate(-" + POINT_RADIUS / zoom + "px, -" + POINT_RADIUS / zoom + "px)",
        transformOrigin: "top left"
    };
    var points = [
        { left: 0, top: 0 },
        { left: .5, top: 0 },
        { left: 1, top: 0 },
        { left: 1, top: .5 },
        { left: 1, top: 1 },
        { left: .5, top: 1 },
        { left: 0, top: 1 },
        { left: 0, top: 0.5 },
    ];
    return React.createElement("div", { className: "m-resizer-component", tabIndex: -1 },
        React.createElement("div", { className: "m-resizer-component--selection", style: resizerStyle, onMouseDown: onMouseDown },
            React.createElement(path_1.Path, { zoom: zoom, points: points, workspace: workspace, bounds: bounds, strokeWidth: POINT_STROKE_WIDTH, dispatch: dispatch, pointRadius: POINT_RADIUS })));
};
var enhanceResizer = recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onMouseDown: function (_a) {
        var dispatch = _a.dispatch, workspace = _a.workspace;
        return function (event) {
            var translate = state_1.getStageTranslate(workspace.stage);
            var bounds = state_1.getWorkspaceSelectionBounds(workspace);
            var translateLeft = translate.left;
            var translateTop = translate.top;
            var onStartDrag = function (event) {
                dispatch(actions_1.resizerMouseDown(workspace.$id, event));
            };
            var onDrag = function (event2, _a) {
                var delta = _a.delta;
                dispatch(actions_1.resizerMoved(workspace.$id, {
                    left: bounds.left + delta.x / translate.zoom,
                    top: bounds.top + delta.y / translate.zoom,
                }));
            };
            // debounce stopped moving so that it beats the stage click event
            // which checks for moving or resizing state.
            var onStopDrag = lodash_1.debounce(function () {
                dispatch(actions_1.resizerStoppedMoving(workspace.$id, null));
            }, 0);
            aerial_common2_1.startDOMDrag(event, onStartDrag, onDrag, onStopDrag);
        };
    }
}));
exports.Resizer = enhanceResizer(exports.ResizerBase);
__export(require("./path"));
//# sourceMappingURL=resizer.js.map