"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
require("./windows.scss");
var React = require("react");
var recompose_1 = require("recompose");
var aerial_common2_1 = require("aerial-common2");
var actions_1 = require("front-end/actions");
var WindowItemBase = function (_a) {
    var window = _a.window, translate = _a.translate, dispatch = _a.dispatch, fullScreenWindowId = _a.fullScreenWindowId;
    if (fullScreenWindowId && fullScreenWindowId !== window.$id) {
        return null;
    }
    var _b = aerial_common2_1.getBoundsSize(window.bounds), width = _b.width, height = _b.height;
    var style = {
        width: width,
        height: height,
        left: window.bounds.left,
        top: window.bounds.top,
        background: "transparent",
    };
    var titleScale = Math.max(1 / translate.zoom, 0.03);
    var titleStyle = {
        transform: "translateY(-" + 20 * titleScale + "px) scale(" + titleScale + ")",
        transformOrigin: "top left",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: width * translate.zoom,
    };
    var contentStyle = {
        // boxShadow: `0 0 0 ${titleScale}px #DFDFDF`
        background: "transparent"
    };
    return React.createElement("div", { className: "m-windows-stage-tool-item", style: style },
        React.createElement("div", { className: "m-windows-stage-tool-item-title", tabIndex: -1, style: titleStyle, onKeyDown: aerial_common2_1.wrapEventToDispatch(dispatch, actions_1.stageToolWindowKeyDown.bind(_this, window.$id)), onClick: aerial_common2_1.wrapEventToDispatch(dispatch, actions_1.stageToolWindowTitleClicked.bind(_this, window.$id)) },
            window.document && window.document.title || window.location,
            React.createElement("i", { className: "ion-share", onClick: aerial_common2_1.wrapEventToDispatch(dispatch, actions_1.openExternalWindowButtonClicked.bind(_this, window.$id)) })),
        React.createElement("div", { className: "m-windows-stage-tool-item-content", style: contentStyle }));
};
var WindowItem = recompose_1.pure(WindowItemBase);
exports.WindowsStageToolBase = function (_a) {
    var workspace = _a.workspace, browser = _a.browser, translate = _a.translate, dispatch = _a.dispatch;
    var _b = workspace.stage, backgroundColor = _b.backgroundColor, fullScreen = _b.fullScreen;
    var backgroundStyle = {
        backgroundColor: backgroundColor || "rgba(0, 0, 0, 0.05)",
        transform: "translate(" + -translate.left / translate.zoom + "px, " + -translate.top / translate.zoom + "px) scale(" + 1 / translate.zoom + ") translateZ(0)",
        transformOrigin: "top left"
    };
    return React.createElement("div", { className: "m-windows-stage-tool" },
        React.createElement("div", { style: backgroundStyle, className: "m-windows-stage-tool-background", onClick: aerial_common2_1.wrapEventToDispatch(dispatch, actions_1.stageToolWindowBackgroundClicked) }),
        browser.windows.map(function (window) { return React.createElement(WindowItem, { key: window.$id, window: window, fullScreenWindowId: fullScreen && fullScreen.windowId, dispatch: dispatch, translate: translate }); }));
};
exports.WindowsStageTool = recompose_1.pure(exports.WindowsStageToolBase);
//# sourceMappingURL=windows.js.map