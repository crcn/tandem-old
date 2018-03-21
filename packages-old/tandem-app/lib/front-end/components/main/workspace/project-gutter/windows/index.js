"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./index.scss");
var React = require("react");
var state_1 = require("front-end/state");
var index_1 = require("front-end/components/pane/index");
var recompose_1 = require("recompose");
var actions_1 = require("front-end/actions");
var WindowRow = function (_a) {
    var window = _a.window, dispatch = _a.dispatch;
    return React.createElement("div", { className: "m-windows-pane-window-row" }, window.document && window.document.title || window.location);
};
var WindowsPaneControlsBase = function (_a) {
    var workspace = _a.workspace, dispatch = _a.dispatch, onAddWindow = _a.onAddWindow;
    return React.createElement("span", null,
        React.createElement("i", { className: "icon ion-plus", onClick: onAddWindow }));
};
var enhanceControls = recompose_1.compose(recompose_1.withHandlers({
    onAddWindow: function (_a) {
        var workspace = _a.workspace, dispatch = _a.dispatch;
        return function (event) {
            var location = prompt("Type in a URL");
            if (!location)
                return;
            dispatch(actions_1.promptedNewWindowUrl(workspace.$id, location));
        };
    }
}));
var WindowsPaneControls = enhanceControls(WindowsPaneControlsBase);
exports.WindowsPaneBase = function (_a) {
    var workspace = _a.workspace, browser = _a.browser, dispatch = _a.dispatch;
    return React.createElement(index_1.Pane, { title: "Windows", className: "m-windows-pane", controls: React.createElement(WindowsPaneControls, { workspace: workspace, dispatch: dispatch }) }, browser.windows.map(function (window) { return React.createElement(WindowRow, { key: window.$id, window: window, dispatch: dispatch }); }));
};
exports.WindowsPane = recompose_1.compose(recompose_1.pure)(exports.WindowsPaneBase);
exports.Preview = function () { return React.createElement(exports.WindowsPane, { workspace: state_1.createWorkspace({}), browser: state_1.createSyntheticBrowser({
        windows: [
            state_1.createSyntheticWindow({
                document: state_1.createSyntheticDocument({
                    title: "Window 1"
                })
            }),
            state_1.createSyntheticWindow({
                document: state_1.createSyntheticDocument({
                    title: "Window 2"
                })
            })
        ]
    }), dispatch: function () { } }); };
//# sourceMappingURL=index.js.map