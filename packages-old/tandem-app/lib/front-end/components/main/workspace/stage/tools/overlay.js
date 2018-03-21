"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
require("./overlay.scss");
var cx = require("classnames");
var React = require("react");
var Hammer = require("react-hammerjs");
var lodash_1 = require("lodash");
var slim_dom_1 = require("slim-dom");
var recompose_1 = require("recompose");
var aerial_common2_1 = require("aerial-common2");
var actions_1 = require("front-end/actions");
var NodeOverlayBase = function (_a) {
    var artboardId = _a.artboardId, zoom = _a.zoom, bounds = _a.bounds, node = _a.node, dispatch = _a.dispatch, hovering = _a.hovering;
    if (!bounds) {
        return null;
    }
    var borderWidth = 2 / zoom;
    var style = {
        left: bounds.left,
        top: bounds.top,
        // round to ensure that the bounds match up with the selection bounds
        width: Math.ceil(bounds.right - bounds.left),
        height: Math.ceil(bounds.bottom - bounds.top),
        boxShadow: "inset 0 0 0 " + borderWidth + "px #00B5FF"
    };
    return React.createElement("div", { className: cx("visual-tools-node-overlay", { hovering: hovering }), style: style });
};
var NodeOverlay = recompose_1.pure(NodeOverlayBase);
var ArtboardOverlayToolsBase = function (_a) {
    var dispatch = _a.dispatch, artboard = _a.artboard, hoveringNodes = _a.hoveringNodes, zoom = _a.zoom, onPanStart = _a.onPanStart, onPan = _a.onPan, onPanEnd = _a.onPanEnd;
    if (!artboard.computedDOMInfo) {
        return null;
    }
    var style = {
        position: "absolute",
        left: artboard.bounds.left,
        top: artboard.bounds.top,
        width: artboard.bounds.right - artboard.bounds.left,
        height: artboard.bounds.bottom - artboard.bounds.top
    };
    return React.createElement("div", { style: style },
        React.createElement(Hammer, { onPanStart: onPanStart, onPan: onPan, onPanEnd: onPanEnd, direction: "DIRECTION_ALL" },
            React.createElement("div", { style: { width: "100%", height: "100%", position: "absolute" }, onDoubleClick: aerial_common2_1.wrapEventToDispatch(dispatch, actions_1.stageToolOverlayMouseDoubleClicked.bind(_this, artboard.$id)) }, hoveringNodes.map(function (node) { return React.createElement(NodeOverlay, { artboardId: artboard.$id, zoom: zoom, key: node.id, node: node, bounds: artboard.computedDOMInfo[node.id] && artboard.computedDOMInfo[node.id].bounds, dispatch: dispatch, hovering: true }); }))));
};
var enhanceArtboardOverlayTools = recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onPanStart: function (_a) {
        var dispatch = _a.dispatch, artboard = _a.artboard;
        return function (event) {
            dispatch(actions_1.stageToolOverlayMousePanStart(artboard.$id));
        };
    },
    onPan: function (_a) {
        var dispatch = _a.dispatch, artboard = _a.artboard;
        return function (event) {
            dispatch(actions_1.stageToolOverlayMousePanning(artboard.$id, { left: event.center.x, top: event.center.y }, event.deltaY, event.velocityY));
        };
    },
    onPanEnd: function (_a) {
        var dispatch = _a.dispatch, artboard = _a.artboard;
        return function (event) {
            event.preventDefault();
            setImmediate(function () {
                dispatch(actions_1.stageToolOverlayMousePanEnd(artboard.$id));
            });
        };
    }
}));
var ArtboardOverlayTools = enhanceArtboardOverlayTools(ArtboardOverlayToolsBase);
var getNodes = aerial_common2_1.weakMemo(function (refs, allNodes) {
    return refs.map(function (_a) {
        var type = _a[0], id = _a[1];
        return allNodes[id];
    }).filter(function (flattenedObject) { return !!flattenedObject; }).map(function (object) { return object.value; });
});
var getHoveringSyntheticNodes = aerial_common2_1.weakMemo(function (workspace, artboard) {
    var allNodes = artboard.document && slim_dom_1.flattenObjects(artboard.document) || {};
    return lodash_1.difference(getNodes(workspace.hoveringRefs, allNodes), getNodes(workspace.selectionRefs, allNodes));
});
exports.NodeOverlaysToolBase = function (_a) {
    var workspace = _a.workspace, dispatch = _a.dispatch, zoom = _a.zoom;
    return React.createElement("div", { className: "visual-tools-layer-component" }, workspace.artboards.map(function (artboard) {
        return React.createElement(ArtboardOverlayTools, { key: artboard.$id, hoveringNodes: getHoveringSyntheticNodes(workspace, artboard), artboard: artboard, dispatch: dispatch, zoom: zoom });
    }));
};
exports.NodeOverlaysTool = recompose_1.pure(exports.NodeOverlaysToolBase);
//# sourceMappingURL=overlay.js.map