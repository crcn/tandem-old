"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./label.scss");
var React = require("react");
var recompose_1 = require("recompose");
var state_1 = require("front-end/state");
var slim_dom_1 = require("slim-dom");
var SelectionLabelBase = function (_a) {
    var workspace = _a.workspace, zoom = _a.zoom;
    if (zoom < 0.15) {
        return null;
    }
    var _b = state_1.getWorkspaceSelectionBounds(workspace), left = _b.left, top = _b.top;
    var _c = workspace.selectionRefs[workspace.selectionRefs.length - 1], type = _c[0], id = _c[1];
    var targetSelectors = workspace.targetCSSSelectors;
    if (type !== slim_dom_1.SlimVMObjectType.ELEMENT) {
        return null;
    }
    var element = state_1.getWorkspaceVMObject(id, workspace);
    var label = slim_dom_1.getElementLabel(element);
    var titleScale = Math.max(1 / zoom, 0.3);
    var style = {
        left: left,
        top: top,
        transform: "translate(" + 13 * titleScale + "px, -" + 15 * titleScale + "px) scale(" + titleScale + ")"
    };
    return React.createElement("div", { className: "m-selection-label", style: style }, label);
};
var enhanceSelectionLabel = recompose_1.compose(recompose_1.pure);
exports.SelectionLabel = enhanceSelectionLabel(SelectionLabelBase);
//# sourceMappingURL=label.js.map