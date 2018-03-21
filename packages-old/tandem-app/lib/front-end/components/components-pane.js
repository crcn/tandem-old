"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var recompose_1 = require("recompose");
var components_pane_pc_1 = require("./components-pane.pc");
var pane_1 = require("./pane");
var actions_1 = require("../actions");
var state_1 = require("front-end/state");
var ICON_SIZE = 110;
var enhanceComponentsPaneCell = recompose_1.compose(recompose_1.pure, state_1.withDragSource({
    getData: function (_a) {
        var tagName = _a.tagName;
        return [state_1.AVAILABLE_COMPONENT, tagName];
    },
    start: function (props) { return function (event) {
        if (props.screenshots.length) {
            var screenshot = props.screenshots[0];
            // TODO - this isn't working for now
            var nativeEvent = event.nativeEvent;
            var image = new Image();
            image.src = "/components/" + props.tagName + "/screenshots/" + screenshot.previewName + "/latest.png";
            nativeEvent.dataTransfer.setDragImage(image, 0, 0);
        }
    }; }
}), recompose_1.withHandlers({
    onClick: function (_a) {
        var dispatch = _a.dispatch, tagName = _a.tagName;
        return function (event) {
            dispatch(actions_1.componentsPaneComponentClicked(tagName, event));
        };
    }
}), function (Base) { return function (_a) {
    var label = _a.label, selected = _a.selected, screenshots = _a.screenshots, connectDragSource = _a.connectDragSource, onClick = _a.onClick, dispatch = _a.dispatch;
    var screenshot = screenshots.length ? screenshots[0] : null;
    var width = screenshot && screenshot.clip.right - screenshot.clip.left;
    var height = screenshot && screenshot.clip.bottom - screenshot.clip.top;
    var scale = 1;
    if (width >= height && width > ICON_SIZE) {
        scale = ICON_SIZE / width;
    }
    else if (height >= width && height > ICON_SIZE) {
        scale = ICON_SIZE / height;
    }
    return connectDragSource(React.createElement(Base, { label: label, onClick: onClick, selected: selected, screenshot: screenshot, screenshotScale: scale, hovering: false, onDragStart: null, onDragEnd: null }));
}; });
var enhanceComponentsPane = recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onAddComponentClick: function (_a) {
        var dispatch = _a.dispatch;
        return function (event) {
            dispatch(actions_1.componentsPaneAddComponentClicked());
        };
    }
}), function (Base) { return function (_a) {
    var workspace = _a.workspace, dispatch = _a.dispatch, onAddComponentClick = _a.onAddComponentClick;
    var components = (workspace.availableComponents || []).map(function (component) { return (__assign({}, component, { selected: workspace.selectionRefs.find(function (ref) { return ref[1] === component.tagName; }) })); });
    return React.createElement(Base, { components: components, dispatch: dispatch, onAddComponentClick: onAddComponentClick });
}; });
var ComponentsPaneCell = components_pane_pc_1.hydrateTdComponentsPaneCell(enhanceComponentsPaneCell, {});
exports.ComponentsPane = components_pane_pc_1.hydrateTdComponentsPane(enhanceComponentsPane, {
    TdPane: pane_1.Pane,
    TdComponentsPaneCell: ComponentsPaneCell
});
//# sourceMappingURL=components-pane.js.map