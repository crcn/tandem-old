webpackHotUpdate(0,{

/***/ "./src/front-end/components/main/workspace/stage/tools/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./src/front-end/components/main/workspace/stage/tools/grid.tsx"));
__webpack_require__("./src/front-end/components/main/workspace/stage/tools/index.scss");
var React = __webpack_require__("./node_modules/react/react.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var grid_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/tools/grid.tsx");
var artboards_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/tools/artboards.tsx");
var overlay_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/tools/overlay.tsx");
var affected_nodes_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/tools/affected-nodes.tsx");
var selection_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/tools/selection/index.tsx");
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


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/tools/index.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/tools/index.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/stage/tools/overlay.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate, process) {
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/workspace/stage/tools/overlay.scss");
var cx = __webpack_require__("./node_modules/classnames/index.js");
var React = __webpack_require__("./node_modules/react/react.js");
var Hammer = __webpack_require__("./node_modules/react-hammerjs/src/Hammer.js");
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var slim_dom_1 = __webpack_require__("../slim-dom/index.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var NodeOverlayBase = function (_a) {
    var artboardId = _a.artboardId, zoom = _a.zoom, bounds = _a.bounds, node = _a.node, dispatch = _a.dispatch, hovering = _a.hovering;
    if (!bounds) {
        return null;
    }
    var borderWidth = 2 / zoom;
    var style = {
        left: bounds.left,
        top: bounds.top,
        width: bounds.right - bounds.left,
        height: bounds.bottom - bounds.top,
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


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/tools/overlay.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/tools/overlay.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/timers-browserify/main.js").setImmediate, __webpack_require__("./node_modules/process/browser.js")))

/***/ })

})