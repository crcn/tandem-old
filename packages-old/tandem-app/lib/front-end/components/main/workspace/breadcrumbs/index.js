"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./index.scss");
var React = require("react");
var cx = require("classnames");
var recompose_1 = require("recompose");
var aerial_common2_1 = require("aerial-common2");
var state_1 = require("front-end/state");
var slim_dom_1 = require("slim-dom");
var actions_1 = require("front-end/actions");
var getBreadcrumbNodes = aerial_common2_1.weakMemo(function (workspace) {
    if (workspace.selectionRefs.length === 0) {
        return [];
    }
    var _a = workspace.selectionRefs[workspace.selectionRefs.length - 1], type = _a[0], $id = _a[1];
    if (type !== slim_dom_1.SlimVMObjectType.ELEMENT) {
        return [];
    }
    var artboard = state_1.getNodeArtboard($id, workspace);
    if (!artboard) {
        return [];
    }
    var node = slim_dom_1.getNestedObjectById($id, artboard.document);
    // not ready yet
    if (!node) {
        return [];
    }
    var ancestors = slim_dom_1.getNodeAncestors(node, artboard.document).filter(function (node) { return node.type === slim_dom_1.SlimVMObjectType.ELEMENT; }).reverse();
    return ancestors.concat([node]).filter(function (node) { return node.type === slim_dom_1.SlimVMObjectType.ELEMENT; });
});
var BreadcrumbBase = function (_a) {
    var element = _a.element, onClick = _a.onClick, selected = _a.selected, onMouseEnter = _a.onMouseEnter, onMouseLeave = _a.onMouseLeave;
    return React.createElement("div", { className: cx("breadcrumb fill-text", { selected: selected }), onClick: onClick, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave },
        slim_dom_1.getElementLabel(element),
        selected ? null : React.createElement("span", { className: "arrow" },
            React.createElement("i", { className: "ion-ios-arrow-right" })));
};
var enhanceBreadcrumb = recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onClick: function (_a) {
        var dispatch = _a.dispatch, element = _a.element, artboardId = _a.artboardId;
        return function () {
            dispatch(actions_1.breadcrumbItemClicked(element.id, artboardId));
        };
    },
    onMouseEnter: function (_a) {
        var dispatch = _a.dispatch, element = _a.element, artboardId = _a.artboardId;
        return function () {
            dispatch(actions_1.breadcrumbItemMouseEnter(element.id, artboardId));
        };
    },
    onMouseLeave: function (_a) {
        var dispatch = _a.dispatch, element = _a.element, artboardId = _a.artboardId;
        return function () {
            dispatch(actions_1.breadcrumbItemMouseEnter(element.id, artboardId));
        };
    }
}));
var Breadcrumb = enhanceBreadcrumb(BreadcrumbBase);
var BreadcrumbsBase = function (_a) {
    var workspace = _a.workspace, dispatch = _a.dispatch;
    var breadcrumbNodes = getBreadcrumbNodes(workspace);
    return React.createElement("div", { className: "m-html-breadcrumbs" }, breadcrumbNodes.map(function (node, i) {
        return React.createElement(Breadcrumb, { key: node.id, dispatch: dispatch, element: node, artboardId: state_1.getNodeArtboard(node.id, workspace).$id, selected: i === breadcrumbNodes.length - 1 });
    }));
};
var Breadcrumbs = BreadcrumbsBase;
exports.Breadcrumbs = Breadcrumbs;
//# sourceMappingURL=index.js.map