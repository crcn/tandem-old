"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./empty-windows.scss");
var React = require("react");
var recompose_1 = require("recompose");
var actions_1 = require("front-end/actions");
var EmptyWindowsBase = function (_a) {
    var onSubmit = _a.onSubmit;
    return React.createElement("div", { className: "m-empty-windows" },
        React.createElement("form", { onSubmit: onSubmit },
            React.createElement("input", { name: "url", type: "text", placeholder: "URL" }),
            React.createElement("input", { type: "submit", value: "Add window!" })));
};
var enhanceEmptyWindows = recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onSubmit: function (_a) {
        var dispatch = _a.dispatch;
        return function (event) {
            dispatch(actions_1.emptyWindowsUrlAdded(event.target.url.value));
            event.preventDefault();
        };
    }
}));
exports.EmptyWindows = enhanceEmptyWindows(EmptyWindowsBase);
//# sourceMappingURL=empty-windows.js.map