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

/***/ "./src/front-end/components/main/workspace/stage/tools/selection/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/workspace/stage/tools/selection/index.scss");
var React = __webpack_require__("./node_modules/react/react.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var resizer_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/tools/selection/resizer.tsx");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
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
__export(__webpack_require__("./src/front-end/components/main/workspace/stage/tools/selection/resizer.tsx"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/tools/selection/index.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/tools/selection/index.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ })

})