"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("./windows.scss");
var VOID_ELEMENTS = require("void-elements");
var React = require("react");
var recompose_1 = require("recompose");
var window_1 = require("./window");
exports.WindowsBase = function (_a) {
    var _b = _a.browser, browser = _b === void 0 ? null : _b, fullScreenWindowId = _a.fullScreenWindowId, dispatch = _a.dispatch, smooth = _a.smooth;
    return browser && React.createElement("div", { className: "preview-component" }, browser.windows.map(function (window) { return React.createElement(window_1.Window, { smooth: smooth, fullScreenWindowId: fullScreenWindowId, dispatch: dispatch, key: window.$id, window: window }); }));
};
exports.Windows = recompose_1.pure(exports.WindowsBase);
__export(require("./window"));
//# sourceMappingURL=windows.js.map