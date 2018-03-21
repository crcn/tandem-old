"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("./index.scss");
var React = require("react");
var recompose_1 = require("recompose");
var resizer_1 = require("./resizer");
var aerial_common2_1 = require("aerial-common2");
var state_1 = require("front-end/state");
var actions_1 = require("front-end/actions");
var SelectionBounds = function (_a) {
    var workspace = _a.workspace, zoom = _a.zoom;
    var selection = state_1.getBoundedWorkspaceSelection(workspace);
    var entireBounds = aerial_common2_1.mergeBounds.apply(void 0, selection.map(function (value) { return state_1.getWorkspaceItemBounds(value, workspace); }));
    var style = {};
    var borderWidth = 1 / zoom;
    var boundsStyle = {
        position: "absolute",
        top: entireBounds.top,
        left: entireBounds.left,
        // round bounds so that they match up with the NWSE resizer
        width: entireBounds.right - entireBounds.left,
        height: entireBounds.bottom - entireBounds.top,
        boxShadow: "inset 0 0 0 " + borderWidth + "px #00B5FF"
    };
    return React.createElement("div", { style: boundsStyle });
};
exports.SelectionStageToolBase = function (_a) {
    var workspace = _a.workspace, dispatch = _a.dispatch, onDoubleClick = _a.onDoubleClick, zoom = _a.zoom;
    var selection = state_1.getBoundedWorkspaceSelection(workspace);
    if (!selection.length || workspace.stage.secondarySelection)
        return null;
    return React.createElement("div", { className: "m-stage-selection-tool", tabIndex: -1, onDoubleClick: onDoubleClick },
        React.createElement(SelectionBounds, { workspace: workspace, zoom: zoom }),
        React.createElement(resizer_1.Resizer, { workspace: workspace, dispatch: dispatch, zoom: zoom }));
};
var enhanceSelectionStageTool = recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onDoubleClick: function (_a) {
        var dispatch = _a.dispatch, workspace = _a.workspace;
        return function (event) {
            var selection = state_1.getBoundedWorkspaceSelection(workspace);
            if (selection.length === 1) {
                dispatch(actions_1.selectorDoubleClicked(selection[0], event));
            }
        };
    }
}));
exports.SelectionStageTool = enhanceSelectionStageTool(exports.SelectionStageToolBase);
__export(require("./resizer"));
//# sourceMappingURL=index.js.map