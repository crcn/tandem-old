"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var artboards_pane_pc_1 = require("./artboards-pane.pc");
var state_1 = require("front-end/state");
var actions_1 = require("front-end/actions");
var recompose_1 = require("recompose");
var ArtboardsPaneRow = artboards_pane_pc_1.hydrateTdArtboardsPaneRow(recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onClick: function (_a) {
        var onClick = _a.onClick, $id = _a.$id;
        return function (event) {
            onClick(event, $id);
        };
    }
})), {
    TdSpinner: null
});
exports.ArtboardsPane = artboards_pane_pc_1.hydrateTdArtboardsPane(recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onArtboardClicked: function (_a) {
        var dispatch = _a.dispatch;
        return function (event, windowId) {
            dispatch(actions_1.artboardPaneRowClicked(windowId, event));
        };
    }
}), function (Base) { return function (_a) {
    var workspace = _a.workspace, artboards = _a.artboards, onArtboardClicked = _a.onArtboardClicked;
    var artboardProps = artboards.map(function (artboard) { return (__assign({}, artboard, { label: state_1.getArtboardLabel(artboard), selected: workspace.selectionRefs.find(function (_a) {
            var $type = _a[0], $id = _a[1];
            return $id === artboard.$id;
        }) })); });
    return React.createElement(Base, { artboards: artboardProps, onArtboardClicked: onArtboardClicked });
}; }), {
    TdListItem: null,
    TdArtboardsPaneRow: ArtboardsPaneRow,
    TdList: null,
    TdPane: null
});
//# sourceMappingURL=artboards-pane.js.map