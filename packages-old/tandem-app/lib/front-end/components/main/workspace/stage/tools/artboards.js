"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
require("./artboards.scss");
var React = require("react");
var recompose_1 = require("recompose");
var aerial_common2_1 = require("aerial-common2");
var actions_1 = require("front-end/actions");
var state_1 = require("front-end/state");
var spinner_1 = require("front-end/components/spinner");
var ArtboardItemBase = function (_a) {
    var artboard = _a.artboard, translate = _a.translate, dispatch = _a.dispatch, fullScreenArtboardId = _a.fullScreenArtboardId;
    if (fullScreenArtboardId && fullScreenArtboardId !== artboard.$id) {
        return null;
    }
    var _b = aerial_common2_1.getBoundsSize(artboard.bounds), width = _b.width, height = _b.height;
    var style = {
        width: width,
        height: height,
        left: artboard.bounds.left,
        top: artboard.bounds.top,
        background: "transparent",
    };
    var titleScale = Math.max(1 / translate.zoom, 0.03);
    var titleStyle = {
        transform: "translateY(-" + 20 * titleScale + "px) scale(" + titleScale + ")",
        transformOrigin: "top left",
        whiteSpace: "nowrap",
        // some random height to prevent text from getting cut off
        // when zooming. 
        height: 30,
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: width * translate.zoom,
    };
    var contentStyle = {
        // boxShadow: `0 0 0 ${titleScale}px #DFDFDF`
        background: "transparent"
    };
    return React.createElement("div", { className: "m-artboards-stage-tool-item", style: style },
        React.createElement("div", { className: "m-artboards-stage-tool-item-title", tabIndex: -1, style: titleStyle, onKeyDown: aerial_common2_1.wrapEventToDispatch(dispatch, actions_1.stageToolWindowKeyDown.bind(_this, artboard.$id)), onClick: aerial_common2_1.wrapEventToDispatch(dispatch, actions_1.stageToolArtboardTitleClicked.bind(_this, artboard.$id)) },
            state_1.getArtboardLabel(artboard),
            " ",
            artboard.loading ? React.createElement(spinner_1.Spinner, null) : null,
            React.createElement("i", { className: "ion-share", onClick: aerial_common2_1.wrapEventToDispatch(dispatch, actions_1.openExternalWindowButtonClicked.bind(_this, artboard.$id)) })),
        React.createElement("div", { className: "m-artboards-stage-tool-item-content", style: contentStyle }));
};
var ArtboardItem = recompose_1.pure(ArtboardItemBase);
exports.ArtboardsStageToolBase = function (_a) {
    var workspace = _a.workspace, translate = _a.translate, dispatch = _a.dispatch;
    var _b = workspace.stage, backgroundColor = _b.backgroundColor, fullScreen = _b.fullScreen;
    var backgroundStyle = {
        backgroundColor: backgroundColor || "rgba(0, 0, 0, 0.05)",
        transform: "translate(" + -translate.left / translate.zoom + "px, " + -translate.top / translate.zoom + "px) scale(" + 1 / translate.zoom + ") translateZ(0)",
        transformOrigin: "top left"
    };
    return React.createElement("div", { className: "m-artboards-stage-tool" },
        React.createElement("div", { style: backgroundStyle, className: "m-artboards-stage-tool-background", onClick: aerial_common2_1.wrapEventToDispatch(dispatch, actions_1.stageToolWindowBackgroundClicked) }),
        workspace.artboards.map(function (artboard) { return React.createElement(ArtboardItem, { key: artboard.$id, artboard: artboard, fullScreenArtboardId: fullScreen && fullScreen.artboardId, dispatch: dispatch, translate: translate }); }));
};
exports.ArtboardsStageTool = recompose_1.pure(exports.ArtboardsStageToolBase);
//# sourceMappingURL=artboards.js.map