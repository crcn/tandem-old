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
var windows_pane_pc_1 = require("./windows-pane.pc");
var recompose_1 = require("recompose");
var WindowsPaneRow = windows_pane_pc_1.hydrateTdWindowsPaneRow(recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onClick: function (_a) {
        var onClick = _a.onClick, $id = _a.$id;
        return function (event) {
            onClick(event, $id);
        };
    }
})), {});
exports.WindowsPane = windows_pane_pc_1.hydrateTdWindowsPane(recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onWindowClicked: function (_a) {
        var dispatch = _a.dispatch;
        return function (event, windowId) {
            // dispatch(ArtboardPaneRowClicked(windowId, event));
        };
    }
}), function (Base) { return function (_a) {
    var workspace = _a.workspace, windows = _a.windows, onWindowClicked = _a.onWindowClicked;
    var windowProps = windows.map(function (window) { return (__assign({}, window, { selected: workspace.selectionRefs.find(function (_a) {
            var $type = _a[0], $id = _a[1];
            return $id === window.$id;
        }) })); });
    return React.createElement(Base, { windows: windowProps, onWindowClicked: onWindowClicked });
}; }), {
    TdListItem: null,
    TdWindowsPaneRow: WindowsPaneRow,
    TdList: null,
    TdPane: null
});
//# sourceMappingURL=windows-pane.js.map