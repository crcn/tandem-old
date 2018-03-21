"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./affected-nodes.scss");
var React = require("react");
var aerial_common2_1 = require("aerial-common2");
var recompose_1 = require("recompose");
var state_1 = require("front-end/state");
var slim_dom_1 = require("slim-dom");
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
        return $type === slim_dom_1.SlimVMObjectType.ELEMENT;
    });
    if (!targetElementRef) {
        return null;
    }
    var targetElement = state_1.getWorkspaceVMObject(targetElementRef[1], workspace);
    if (!targetElement) {
        return null;
    }
    var targetArtboard = state_1.getNodeArtboard(targetElement.id, workspace);
    var affectedElements = []; // getSelectorAffectedElements(targetElement.id, filterMatchingTargetSelectors(workspace.targetCSSSelectors, targetElement, targetWindow), browser, !!workspace.stage.fullScreen) as SyntheticElement[];
    return React.createElement("div", { className: "m-affected-nodes" }, affectedElements.filter(function (element) { return element.id !== targetElement.id; }).map(function (element) { return React.createElement(AffectedElement, { zoom: zoom, key: element.$id, artboard: state_1.getNodeArtboard(element.id, workspace), element: element }); }));
};
exports.AffectedNodesTool = recompose_1.compose(recompose_1.pure)(AffectedNodesToolBase);
//# sourceMappingURL=affected-nodes.js.map