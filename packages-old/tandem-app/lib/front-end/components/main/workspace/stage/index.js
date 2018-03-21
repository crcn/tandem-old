"use strict";
// https://github.com/tandemcode/tandem/blob/master/src/%40tandem/editor/browser/components/pages/workspace/mid/center/canvas/index.tsx#L270
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("./index.scss");
var React = require("react");
var state_1 = require("front-end/state");
var cx = require("classnames");
var tools_1 = require("./tools");
var artboards_1 = require("./artboards");
var isolated_1 = require("front-end/components/isolated");
var empty_artboards_1 = require("./empty-artboards");
var react_motion_1 = require("react-motion");
var actions_1 = require("front-end/actions");
var recompose_1 = require("recompose");
var stiffSpring = function (amount) { return react_motion_1.spring(amount, { stiffness: 330, damping: 30 }); };
var PANE_SENSITIVITY = process.platform === "win32" ? 0.1 : 1;
var ZOOM_SENSITIVITY = process.platform === "win32" ? 2500 : 250;
var enhanceStage = recompose_1.compose(recompose_1.pure, recompose_1.withState('canvasOuter', 'setCanvasOuter', null), recompose_1.withState('stageContainer', 'setStageContainer', null), recompose_1.withHandlers({
    onMouseEvent: function (_a) {
        var dispatch = _a.dispatch;
        return function (event) {
            dispatch(actions_1.stageMouseMoved(event));
        };
    },
    onDragOver: function (_a) {
        var dispatch = _a.dispatch;
        return function (event) {
            dispatch(actions_1.stageMouseMoved(event));
        };
    },
    onMotionRest: function (_a) {
        var dispatch = _a.dispatch;
        return function () {
            dispatch(actions_1.canvasMotionRested());
        };
    },
    onMouseClick: function (_a) {
        var dispatch = _a.dispatch;
        return function (event) {
            dispatch(actions_1.stageMouseClicked(event));
        };
    },
    setStageContainer: function (_a) {
        var dispatch = _a.dispatch, setStageContainer = _a.setStageContainer;
        return function (element) {
            setStageContainer(element);
            dispatch(actions_1.stageContainerMounted(element));
        };
    },
    onWheel: function (_a) {
        var workspace = _a.workspace, dispatch = _a.dispatch, canvasOuter = _a.canvasOuter;
        return function (event) {
            var rect = canvasOuter.getBoundingClientRect();
            event.preventDefault();
            event.stopPropagation();
            dispatch(actions_1.stageWheel(workspace.$id, rect.width, rect.height, event));
        };
    }
}));
exports.StageBase = function (_a) {
    var setCanvasOuter = _a.setCanvasOuter, setStageContainer = _a.setStageContainer, workspace = _a.workspace, dispatch = _a.dispatch, onWheel = _a.onWheel, onDrop = _a.onDrop, onMouseEvent = _a.onMouseEvent, shouldTransitionZoom = _a.shouldTransitionZoom, onDragOver = _a.onDragOver, onMouseClick = _a.onMouseClick, onMotionRest = _a.onMotionRest, onDragExit = _a.onDragExit;
    if (!workspace)
        return null;
    var _b = workspace.stage, translate = _b.translate, cursor = _b.cursor, fullScreen = _b.fullScreen, smooth = _b.smooth;
    var fullScreenArtboard = fullScreen ? state_1.getArtboardById(fullScreen.artboardId, workspace) : null;
    var outerStyle = {
        cursor: cursor || "default"
    };
    // TODO - motionTranslate must come from fullScreen.translate
    // instead of here so that other parts of the app can access this info
    var hasArtboards = Boolean(workspace.artboards.length);
    var motionTranslate = hasArtboards ? translate : { left: 0, top: 0, zoom: 1 };
    return React.createElement("div", { className: "stage-component", ref: setStageContainer },
        React.createElement(isolated_1.Isolate, { inheritCSS: true, ignoreInputEvents: true, className: "stage-component-isolate", onWheel: onWheel, scrolling: false, translateMousePositions: false },
            React.createElement("span", null,
                React.createElement("style", null, "html, body {\n              overflow: hidden;\n            }"),
                React.createElement("div", { ref: setCanvasOuter, onMouseMove: onMouseEvent, onDragOver: onDragOver, onDrop: onDrop, onClick: onMouseClick, tabIndex: -1, onDragExit: onDragExit, className: "stage-inner", style: outerStyle },
                    React.createElement(react_motion_1.Motion, { defaultStyle: { left: 0, top: 0, zoom: 1 }, style: { left: smooth ? stiffSpring(motionTranslate.left) : motionTranslate.left, top: smooth ? stiffSpring(motionTranslate.top) : motionTranslate.top, zoom: smooth ? stiffSpring(motionTranslate.zoom) : motionTranslate.zoom }, onRest: onMotionRest }, function (translate) {
                        return React.createElement("div", { style: { transform: "translate(" + translate.left + "px, " + translate.top + "px) scale(" + translate.zoom + ")" }, className: cx({ "stage-inner": true }) },
                            hasArtboards ? React.createElement(artboards_1.Artboards, { workspace: workspace, smooth: smooth, dispatch: dispatch, fullScreenArtboardId: workspace.stage.fullScreen && workspace.stage.fullScreen.artboardId }) : React.createElement(empty_artboards_1.EmptyArtboards, null),
                            hasArtboards ? React.createElement(tools_1.ToolsLayer, { workspace: workspace, translate: translate, dispatch: dispatch }) : null);
                    })))));
};
exports.Stage = enhanceStage(exports.StageBase);
__export(require("./tools"));
//# sourceMappingURL=index.js.map