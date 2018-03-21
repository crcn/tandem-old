"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./grid"));
require("./index.scss");
var React = require("react");
var recompose_1 = require("recompose");
var grid_1 = require("./grid");
var artboards_1 = require("./artboards");
var overlay_1 = require("./overlay");
var affected_nodes_1 = require("./affected-nodes");
var selection_1 = require("./selection");
exports.ToolsLayerBase = function (_a) {
    var workspace = _a.workspace, dispatch = _a.dispatch, translate = _a.translate;
    var showTools = workspace.stage.showTools !== false;
    var windowElement = React.createElement(artboards_1.ArtboardsStageTool, { workspace: workspace, dispatch: dispatch, translate: translate });
    if (showTools === false) {
        return React.createElement("div", { className: "m-stage-tools" }, windowElement);
    }
    return React.createElement("div", { className: "m-stage-tools" },
        React.createElement(grid_1.GridStageTool, { translate: translate }),
        React.createElement(overlay_1.NodeOverlaysTool, { zoom: translate.zoom, workspace: workspace, dispatch: dispatch }),
        workspace.stage.smooth ? null : React.createElement(selection_1.SelectionStageTool, { zoom: translate.zoom, workspace: workspace, dispatch: dispatch }),
        windowElement,
        React.createElement(affected_nodes_1.AffectedNodesTool, { zoom: translate.zoom, workspace: workspace }));
};
exports.ToolsLayer = recompose_1.compose(recompose_1.pure)(exports.ToolsLayerBase);
//# sourceMappingURL=index.js.map