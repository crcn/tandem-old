"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./index.scss");
var React = require("react");
var recompose_1 = require("recompose");
var cx = require("classnames");
// TODOS
// collapsible
var enhancePane = recompose_1.pure;
exports.PaneBase = function (_a) {
    var title = _a.title, controls = _a.controls, children = _a.children, className = _a.className;
    return React.createElement("div", { className: cx("m-pane", className) },
        React.createElement("div", { className: "header" },
            title,
            " ",
            React.createElement("span", { className: "controls" }, controls)),
        React.createElement("div", { className: "body" }, children));
};
exports.Pane = enhancePane(exports.PaneBase);
//# sourceMappingURL=index.js.map