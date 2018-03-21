"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./index.scss");
var React = require("react");
var recompose_1 = require("recompose");
var actions_1 = require("front-end/actions");
var aerial_common2_1 = require("aerial-common2");
var TreeNodeBase = function (_a) {
    var rootNode = _a.rootNode, node = _a.node, getLabel = _a.getLabel, collapsed = _a.collapsed, collapsible = _a.collapsible, onLabelClick = _a.onLabelClick, dispatch = _a.dispatch;
    var isCollapsible = collapsible(node);
    return React.createElement("div", { className: "tree-node" },
        React.createElement("div", { className: "tree-node-label", onClick: onLabelClick, style: {
                cursor: "pointer",
                paddingLeft: (aerial_common2_1.getTreeNodeDepth(node, rootNode) - 1) * 2
            } }, getLabel(node)),
        React.createElement("div", { className: "tree-node-children" }, collapsed ? null : node.childNodes.map(function (child, i) { return React.createElement(TreeNode, { key: i, rootNode: rootNode, node: child, getLabel: getLabel, collapsible: collapsible, dispatch: dispatch }); })));
};
var TreeNode = recompose_1.compose(recompose_1.pure, recompose_1.withState("collapsed", "setCollapsed", function () { return false; }), recompose_1.withHandlers({
    onLabelClick: function (_a) {
        var dispatch = _a.dispatch, node = _a.node, collapsed = _a.collapsed, collapsible = _a.collapsible, setCollapsed = _a.setCollapsed;
        return function () {
            if (collapsible(node)) {
                setCollapsed(!collapsed);
            }
            if (dispatch) {
                dispatch(actions_1.treeNodeLabelClicked(node));
            }
        };
    }
}))(TreeNodeBase);
exports.TreeBase = function (_a) {
    var rootNode = _a.rootNode, getLabel = _a.getLabel, collapsible = _a.collapsible, dispatch = _a.dispatch;
    return React.createElement("div", { className: "tree-component" }, rootNode.childNodes.map(function (child, i) { return React.createElement(TreeNode, { key: i, rootNode: rootNode, node: child, getLabel: getLabel, collapsible: collapsible, dispatch: dispatch }); }));
};
exports.Tree = recompose_1.compose(recompose_1.pure, recompose_1.defaultProps({
    collapsible: function () { return false; }
}))(exports.TreeBase);
//# sourceMappingURL=index.js.map