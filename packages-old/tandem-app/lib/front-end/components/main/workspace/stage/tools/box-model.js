"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./box-model.scss");
var React = require("react");
var recompose_1 = require("recompose");
var aerial_common2_1 = require("aerial-common2");
var state_1 = require("front-end/state");
var slim_dom_1 = require("slim-dom");
var pxToNumber = function (px) { return Number(px.replace("px", "")); };
var boxShadow = function (x, y, color, inset) { return (inset ? "inset" : "") + " " + x + "px " + y + "px 0 0px " + color; };
var paddingBoxShadow = function (x, y) { return boxShadow(x, y, '#6EFF27', true); };
var ElementBoxModel = recompose_1.compose(recompose_1.pure)(function (_a) {
    var windowBounds = _a.windowBounds, bounds = _a.bounds, computedStyle = _a.computedStyle;
    var fixedPosition = aerial_common2_1.shiftBounds(bounds, windowBounds);
    var marginLeft = pxToNumber(computedStyle.marginLeft);
    var marginTop = pxToNumber(computedStyle.marginTop);
    var style = {
        left: fixedPosition.left - marginLeft,
        top: fixedPosition.top - marginTop,
        width: fixedPosition.right - fixedPosition.left,
        height: fixedPosition.bottom - fixedPosition.top,
        opacity: 0.3,
        borderColor: "#FF8100",
        borderStyle: "solid",
        boxSizing: "content-box",
        borderLeftWidth: marginLeft,
        borderRightWidth: pxToNumber(computedStyle.marginRight),
        borderTopWidth: marginTop,
        borderBottomWidth: pxToNumber(computedStyle.marginBottom),
        boxShadow: [
            paddingBoxShadow(-pxToNumber(computedStyle.paddingLeft), 0),
            paddingBoxShadow(pxToNumber(computedStyle.paddingRight), 0),
            paddingBoxShadow(0, pxToNumber(computedStyle.paddingTop)),
            paddingBoxShadow(0, -pxToNumber(computedStyle.paddingBottom))
        ].join(", ")
    };
    return React.createElement("div", { className: "element-box-model", style: style });
});
exports.BoxModelStageTool = recompose_1.compose(recompose_1.pure)(function (_a) {
    var workspace = _a.workspace;
    var selectedElements = workspace.selectionRefs.filter(function (_a) {
        var type = _a[0];
        return type === slim_dom_1.SlimVMObjectType.ELEMENT;
    }).map(function (_a) {
        var type = _a[0], $id = _a[1];
        return state_1.getWorkspaceVMObject($id, workspace);
    }).filter(function (element) { return !!element; });
    if (selectedElements.length === 0) {
        return null;
    }
    return React.createElement("div", { className: "m-box-model-tool" }, selectedElements.map(function (element) {
        var window = state_1.getNodeArtboard(element.id, workspace);
        var bounds = window.computedDOMInfo && window.computedDOMInfo[element.id] && window.computedDOMInfo[element.id].bounds;
        var style = window.computedDOMInfo && window.computedDOMInfo[element.id] && window.computedDOMInfo[element.id].style;
        if (!bounds || !style) {
            return null;
        }
        return React.createElement(ElementBoxModel, { key: element.id, windowBounds: window.bounds, bounds: bounds, computedStyle: style });
    }));
});
//# sourceMappingURL=box-model.js.map