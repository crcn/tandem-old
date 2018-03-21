"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = require("../actions");
var global_pc_1 = require("./global.pc");
var recompose_1 = require("recompose");
var React = require("react");
var react_motion_1 = require("react-motion");
var SPRING_OPS = {
    stiffness: 300,
    damping: 30
};
var enhanceWorkspaceBanner = recompose_1.compose(recompose_1.pure, recompose_1.withState("closeButtonClicked", "setCloseButtonClicked", null), recompose_1.withHandlers({
    onClose: function (_a) {
        var setCloseButtonClicked = _a.setCloseButtonClicked;
        return function () {
            setCloseButtonClicked(true);
        };
    },
    onBannerRest: function (_a) {
        var dispatch = _a.dispatch, closeButtonClicked = _a.closeButtonClicked, setCloseButtonClicked = _a.setCloseButtonClicked;
        return function () {
            if (closeButtonClicked) {
                dispatch(actions_1.bannerClosed());
                setCloseButtonClicked(false);
            }
        };
    }
}), function (Base) { return function (_a) {
    var onClose = _a.onClose, workspace = _a.workspace, closeButtonClicked = _a.closeButtonClicked, onBannerRest = _a.onBannerRest;
    var uncaughtError = workspace.uncaughtError;
    var banner;
    if (uncaughtError) {
        banner = React.createElement(Base, { error: true, onClose: onClose }, uncaughtError.message);
    }
    return React.createElement(react_motion_1.Motion, { defaultStyle: { top: -100 }, style: { top: react_motion_1.spring(!closeButtonClicked && banner ? 0 : -100, SPRING_OPS) }, onRest: onBannerRest }, function (_a) {
        var top = _a.top;
        return React.createElement("div", { style: { position: "absolute", top: 0, transform: "translateY(" + top + "%)", zIndex: 1024, width: "100%" } }, banner);
    });
}; });
exports.WorkspaceBanner = global_pc_1.hydrateTdBanner(enhanceWorkspaceBanner, {});
//# sourceMappingURL=banner.js.map