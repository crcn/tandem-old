"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./index.scss");
var React = require("react");
var cx = require("classnames");
exports.GutterBase = function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? "" : _b;
    return React.createElement("div", { className: cx("gutter", className) }, children);
};
exports.Gutter = exports.GutterBase;
//# sourceMappingURL=index.js.map