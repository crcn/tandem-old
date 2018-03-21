"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./index.scss");
var React = require("react");
var recompose_1 = require("recompose");
var workspace_1 = require("./workspace");
var react_redux_1 = require("react-redux");
var state_1 = require("front-end/state");
exports.MainBase = function (_a) {
    var state = _a.state, dispatch = _a.dispatch;
    var workspace = state_1.getSelectedWorkspace(state);
    return React.createElement("div", { className: "main-component" }, workspace && React.createElement(workspace_1.Workspace, { state: state, workspace: workspace, dispatch: dispatch }));
};
var enhanceMain = recompose_1.compose(react_redux_1.connect(function (state) { return ({ state: state }); }));
exports.Main = enhanceMain(exports.MainBase);
//# sourceMappingURL=index.js.map