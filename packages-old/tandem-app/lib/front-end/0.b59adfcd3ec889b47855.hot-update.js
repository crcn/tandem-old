webpackHotUpdate(0,{

/***/ "./src/front-end/components/main/workspace/stage/tools/affected-nodes.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/workspace/stage/tools/affected-nodes.scss");
var React = __webpack_require__("./node_modules/react/react.js");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var AffectedElementBase = function (_a) {
    var element = _a.element, artboard = _a.artboard, zoom = _a.zoom;
    var computedInfo = artboard.computedDOMInfo && artboard.computedDOMInfo[element.id];
    if (!computedInfo)
        return null;
    var _b = aerial_common2_1.shiftBounds(computedInfo.bounds, artboard.bounds), left = _b.left, top = _b.top, right = _b.right, bottom = _b.bottom;
    var borderWidth = 1 / zoom;
    var style = {
        boxShadow: "inset 0 0 0 " + borderWidth + "px #F5AB35",
        left: left,
        top: top,
        width: right - left,
        height: bottom - top
    };
    return React.createElement("div", { className: "affected-element", style: style });
};
var AffectedElement = recompose_1.compose(recompose_1.pure)(AffectedElementBase);
var AffectedNodesToolBase = function (_a) {
    var workspace = _a.workspace, zoom = _a.zoom;
    var targetElementRef = workspace.selectionRefs.reverse().find(function (_a) {
        var $type = _a[0];
        return $type === state_1.SYNTHETIC_ELEMENT;
    });
    if (!targetElementRef) {
        return null;
    }
    var targetElement = state_1.getWorkspaceNode(targetElementRef[1], workspace);
    if (!targetElement) {
        return null;
    }
    var targetArtboard = state_1.getNodeArtboard(targetElement.id, workspace);
    var affectedElements = []; // getSelectorAffectedElements(targetElement.id, filterMatchingTargetSelectors(workspace.targetCSSSelectors, targetElement, targetWindow), browser, !!workspace.stage.fullScreen) as SyntheticElement[];
    return React.createElement("div", { className: "m-affected-nodes" }, affectedElements.filter(function (element) { return element.id !== targetElement.id; }).map(function (element) { return React.createElement(AffectedElement, { zoom: zoom, key: element.$id, artboard: state_1.getNodeArtboard(element.id, workspace), element: element }); }));
};
exports.AffectedNodesTool = recompose_1.compose(recompose_1.pure)(AffectedNodesToolBase);


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/tools/affected-nodes.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/tools/affected-nodes.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

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

/***/ })

})