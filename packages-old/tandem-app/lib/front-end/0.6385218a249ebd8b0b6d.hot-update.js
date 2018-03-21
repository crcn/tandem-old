webpackHotUpdate(0,{

/***/ "./src/front-end/actions/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESIZER_MOVED = "RESIZER_MOVED";
exports.LOADED_SAVED_STATE = "LOADED_SAVED_STATE";
exports.TRIED_LOADING_APP_STATE = "TRIED_LOADING_APP_STATE";
exports.RESIZER_STOPPED_MOVING = "RESIZER_STOPPED_MOVING";
exports.RESIZER_MOUSE_DOWN = "RESIZER_MOUSE_DOWN";
exports.WINDOW_PANE_ROW_CLICKED = "WINDOW_PANE_ROW_CLICKED";
exports.PROMPTED_NEW_WINDOW_URL = "PROMPTED_NEW_WINDOW_URL";
exports.KEYBOARD_SHORTCUT_ADDED = "KEYBOARD_SHORTCUT_ADDED";
exports.DELETE_SHORCUT_PRESSED = "DELETE_SHORCUT_PRESSED";
exports.FULL_SCREEN_SHORTCUT_PRESSED = "FULL_SCREEN_SHORTCUT_PRESSED";
exports.EMPTY_WINDOWS_URL_ADDED = "EMPTY_WINDOWS_URL_ADDED";
exports.ZOOM_IN_SHORTCUT_PRESSED = "ZOOM_IN_SHORTCUT_PRESSED";
exports.ZOOM_OUT_SHORTCUT_PRESSED = "ZOOM_OUT_SHORTCUT_PRESSED";
exports.OPEN_NEW_WINDOW_SHORTCUT_PRESSED = "OPEN_NEW_WINDOW_SHORTCUT_PRESSED";
exports.WINDOW_SELECTION_SHIFTED = "WINDOW_SELECTION_SHIFTED";
exports.CLONE_WINDOW_SHORTCUT_PRESSED = "CLONE_WINDOW_SHORTCUT_PRESSED";
exports.ESCAPE_SHORTCUT_PRESSED = "ESCAPE_SHORTCUT_PRESSED";
exports.NEXT_WINDOW_SHORTCUT_PRESSED = "NEXT_WINDOW_SHORTCUT_PRESSED";
exports.PREV_WINDOW_SHORTCUT_PRESSED = "PREV_WINDOW_SHORTCUT_PRESSED";
exports.TOGGLE_TOOLS_SHORTCUT_PRESSED = "TOGGLE_TOOLS_SHORTCUT_PRESSED";
exports.FULL_SCREEN_TARGET_DELETED = "FULL_SCREEN_TARGET_DELETED";
exports.TOGGLE_TEXT_EDITOR_PRESSED = "TOGGLE_TEXT_EDITOR_PRESSED";
exports.TOGGLE_LEFT_GUTTER_PRESSED = "TOGGLE_LEFT_GUTTER_PRESSED";
exports.TOGGLE_RIGHT_GUTTER_PRESSED = "TOGGLE_RIGHT_GUTTER_PRESSED";
exports.RESIZER_PATH_MOUSE_MOVED = "RESIZER_PATH_MOUSE_MOVED";
exports.RESIZER_PATH_MOUSE_STOPPED_MOVING = "RESIZER_PATH_MOUSE_STOPPED_MOVING";
exports.TEXT_EDITOR_CHANGED = "TEXT_EDITOR_CHANGED";
exports.CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED = "CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED";
exports.CANVAS_MOTION_RESTED = "CANVAS_MOTION_RESTED";
exports.TREE_NODE_LABEL_CLICKED = "TREE_NODE_LABE_CLICKED";
exports.FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED = "FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED";
exports.FILE_CONTENT_CHANGED = "FILE_CONTENT_CHANGED";
exports.OPEN_EXTERNAL_WINDOWS_REQUESTED = "OPEN_EXTERNAL_WINDOWS_REQUESTED";
exports.FILE_REMOVED = "FILE_REMOVED";
exports.COMPONENT_SCREENSHOT_SAVED = "COMPONENT_SCREENSHOT_SAVED";
exports.COMPONENTS_PANE_ADD_COMPONENT_CLICKED = "COMPONENTS_PANE_ADD_COMPONENT_CLICKED";
exports.COMPONENTS_PANE_COMPONENT_CLICKED = "COMPONENTS_PANE_COMPONENT_CLICKED";
exports.BREADCRUMB_ITEM_CLICKED = "BREADCRUMB_ITEM_CLICKED";
exports.BREADCRUMB_ITEM_MOUSE_ENTER = "BREADCRUMB_ITEM_MOUSE_ENTER";
exports.BREADCRUMB_ITEM_MOUSE_LEAVE = "BREADCRUMB_ITEM_MOUSE_LEAVE";
exports.FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED = "FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED";
exports.STAGE_MOUSE_MOVED = "STAGE_MOUSE_MOVED";
exports.STAGE_MOUSE_CLICKED = "STAGE_MOUSE_CLICKED";
exports.VISUAL_EDITOR_WHEEL = "VISUAL_EDITOR_WHEEL";
exports.STAGE_TOOL_WINDOW_TITLE_CLICKED = "STAGE_TOOL_WINDOW_TITLE_CLICKED";
exports.DOWN_KEY_DOWN = "DOWN_KEY_DOWN";
exports.DOWN_KEY_UP = "DOWN_KEY_UP";
exports.UP_KEY_DOWN = "UP_KEY_DOWN";
exports.UP_KEY_UP = "UP_KEY_UP";
exports.LEFT_KEY_DOWN = "LEFT_KEY_DOWN";
exports.LEFT_KEY_UP = "LEFT_KEY_UP";
exports.RIGHT_KEY_DOWN = "RIGHT_KEY_DOWN";
exports.RIGHT_KEY_UP = "RIGHT_KEY_UP";
exports.STAGE_TOOL_WINDOW_BACKGROUND_CLICKED = "STAGE_TOOL_WINDOW_BACKGROUND_CLICKED";
exports.DISPLAY_SOURCE_CODE_REQUESTED = "DISPLAY_SOURCE_CODE_REQUESTED";
exports.STAGE_TOOL_OVERLAY_MOUSE_LEAVE = "STAGE_TOOL_OVERLAY_MOUSE_LEAVE";
exports.STAGE_TOOL_OVERLAY_MOUSE_PAN_START = "STAGE_TOOL_OVERLAY_MOUSE_PAN_START";
exports.STAGE_TOOL_OVERLAY_MOUSE_PANNING = "STAGE_TOOL_OVERLAY_MOUSE_PANNING";
exports.STAGE_TOOL_OVERLAY_MOUSE_PAN_END = "STAGE_TOOL_OVERLAY_MOUSE_PAN_END";
exports.STAGE_TOOL_WINDOW_KEY_DOWN = "STAGE_TOOL_WINDOW_KEY_DOWN";
exports.OPEN_EXTERNAL_WINDOW_BUTTON_CLICKED = "OPEN_EXTERNAL_WINDOW_BUTTON_CLICKED";
exports.WORKSPACE_DELETION_SELECTED = "WORKSPACE_DELETION_SELECTED";
exports.STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED = "STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED";
exports.SELECTOR_DOUBLE_CLICKED = "SELECTOR_DOUBLE_CLICKED";
exports.STAGE_TOOL_EDIT_TEXT_CHANGED = "STAGE_TOOL_EDIT_TEXT_CHANGED";
exports.STAGE_TOOL_EDIT_TEXT_KEY_DOWN = "STAGE_TOOL_EDIT_TEXT_KEY_DOWN";
exports.STAGE_TOOL_EDIT_TEXT_BLUR = "STAGE_TOOL_EDIT_TEXT_BLUR";
exports.STAGE_MOUNTED = "STAGE_MOUNTED";
exports.CSS_DECLARATION_NAME_CHANGED = "CSS_DECLARATION_NAME_CHANGED";
exports.CSS_DECLARATION_VALUE_CHANGED = "CSS_DECLARATION_VALUE_CHANGED";
exports.WINDOW_FOCUSED = "WINDOW_FOCUSED";
exports.CSS_DECLARATION_CREATED = "CSS_DECLARATION_CREATED";
exports.CSS_DECLARATION_TITLE_MOUSE_ENTER = "CSS_DECLARATION_TITLE_MOUSE_ENTER";
exports.SOURCE_CLICKED = "SOURCE_CLICKED";
exports.CSS_DECLARATION_TITLE_MOUSE_LEAVE = "CSS_DECLARATION_TITLE_MOUSE_LEAVE";
exports.TOGGLE_TARGET_CSS_TARGET_SELECTOR_CLICKED = "TOGGLE_TARGET_CSS_TARGET_SELECTOR_CLICKED";
exports.API_COMPONENTS_LOADED = "API_COMPONENTS_LOADED";
exports.DND_STARTED = "DND_STARTED";
exports.DND_ENDED = "DND_ENDED";
exports.DND_HANDLED = "DND_HANDLED";
/**
 * Factories
 */
exports.canvasElementsComputedPropsChanged = function (syntheticWindowId, allComputedBounds, allComputedStyles) { return ({
    syntheticWindowId: syntheticWindowId,
    type: exports.CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED,
    allComputedBounds: allComputedBounds,
    allComputedStyles: allComputedStyles
}); };
exports.componentsPaneAddComponentClicked = function () { return ({
    type: exports.COMPONENTS_PANE_ADD_COMPONENT_CLICKED
}); };
exports.componentsPaneComponentClicked = function (componentId, sourceEvent) { return ({
    type: exports.COMPONENTS_PANE_COMPONENT_CLICKED,
    sourceEvent: sourceEvent,
    componentId: componentId
}); };
exports.canvasMotionRested = function () { return ({
    type: exports.CANVAS_MOTION_RESTED
}); };
exports.treeNodeLabelClicked = function (node) { return ({ type: exports.TREE_NODE_LABEL_CLICKED, node: node }); };
exports.stageToolWindowTitleClicked = function (windowId, sourceEvent) { return ({ type: exports.STAGE_TOOL_WINDOW_TITLE_CLICKED, windowId: windowId, sourceEvent: sourceEvent }); };
exports.stageToolWindowKeyDown = function (windowId, sourceEvent) { return ({ type: exports.STAGE_TOOL_WINDOW_KEY_DOWN, windowId: windowId, sourceEvent: sourceEvent }); };
exports.openExternalWindowButtonClicked = function (windowId, sourceEvent) { return ({ type: exports.OPEN_EXTERNAL_WINDOW_BUTTON_CLICKED, windowId: windowId, sourceEvent: sourceEvent }); };
exports.stageToolWindowBackgroundClicked = function (sourceEvent) { return ({ type: exports.STAGE_TOOL_WINDOW_BACKGROUND_CLICKED, sourceEvent: sourceEvent }); };
// TODO - possible include CSS url, or windowId
exports.toggleCSSTargetSelectorClicked = function (itemId, windowId) { return ({
    type: exports.TOGGLE_TARGET_CSS_TARGET_SELECTOR_CLICKED,
    windowId: windowId,
    itemId: itemId,
}); };
exports.resizerMoved = function (workspaceId, point) { return ({
    workspaceId: workspaceId,
    point: point,
    type: exports.RESIZER_MOVED,
}); };
exports.dndStarted = function (ref, sourceEvent) { return ({
    type: exports.DND_STARTED,
    sourceEvent: sourceEvent,
    ref: ref
}); };
exports.dndEnded = function (ref, sourceEvent) { return ({
    type: exports.DND_ENDED,
    sourceEvent: sourceEvent,
    ref: ref
}); };
exports.dndHandled = function () { return ({
    type: exports.DND_HANDLED
}); };
exports.cssDeclarationNameChanged = function (name, value, declarationId, windowId) { return ({
    declarationId: declarationId,
    windowId: windowId,
    name: name,
    value: value,
    type: exports.CSS_DECLARATION_NAME_CHANGED
}); };
exports.cssDeclarationValueChanged = function (name, value, declarationId, windowId) { return ({
    declarationId: declarationId,
    windowId: windowId,
    name: name,
    value: value,
    type: exports.CSS_DECLARATION_VALUE_CHANGED
}); };
exports.cssDeclarationCreated = function (name, value, declarationId, windowId) { return ({
    windowId: windowId,
    name: name,
    value: value,
    declarationId: declarationId,
    type: exports.CSS_DECLARATION_CREATED
}); };
exports.cssDeclarationTitleMouseEnter = function (ruleId, windowId) { return ({
    windowId: windowId,
    ruleId: ruleId,
    type: exports.CSS_DECLARATION_TITLE_MOUSE_ENTER
}); };
exports.sourceClicked = function (itemId, windowId) { return ({
    windowId: windowId,
    itemId: itemId,
    type: exports.SOURCE_CLICKED
}); };
exports.cssDeclarationTitleMouseLeave = function (ruleId, windowId) { return ({
    windowId: windowId,
    ruleId: ruleId,
    type: exports.CSS_DECLARATION_TITLE_MOUSE_LEAVE
}); };
exports.resizerStoppedMoving = function (workspaceId, point) { return ({
    workspaceId: workspaceId,
    point: point,
    type: exports.RESIZER_STOPPED_MOVING,
}); };
exports.breadcrumbItemClicked = function (nodeId, windowId) { return ({
    nodeId: nodeId,
    windowId: windowId,
    type: exports.BREADCRUMB_ITEM_CLICKED
}); };
exports.breadcrumbItemMouseEnter = function (nodeId, windowId) { return ({
    nodeId: nodeId,
    windowId: windowId,
    type: exports.BREADCRUMB_ITEM_MOUSE_ENTER
}); };
exports.breadcrumbItemMouseLeave = function (nodeId, windowId) { return ({
    nodeId: nodeId,
    windowId: windowId,
    type: exports.BREADCRUMB_ITEM_MOUSE_LEAVE
}); };
exports.windowSelectionShifted = function (windowId) { return ({
    windowId: windowId,
    type: exports.WINDOW_SELECTION_SHIFTED,
}); };
exports.resizerMouseDown = function (workspaceId, sourceEvent) { return ({
    workspaceId: workspaceId,
    sourceEvent: sourceEvent,
    type: exports.RESIZER_MOUSE_DOWN,
}); };
exports.stageToolOverlayMouseLeave = function (sourceEvent) { return ({
    type: exports.STAGE_TOOL_OVERLAY_MOUSE_LEAVE,
    sourceEvent: sourceEvent
}); };
exports.stageToolOverlayMousePanStart = function (windowId) { return ({
    windowId: windowId,
    type: exports.STAGE_TOOL_OVERLAY_MOUSE_PAN_START,
}); };
exports.windowFocused = function (windowId) { return ({
    type: exports.WINDOW_FOCUSED,
    windowId: windowId
}); };
exports.stageToolOverlayMousePanning = function (windowId, center, deltaY, velocityY) { return ({
    windowId: windowId,
    center: center,
    deltaY: deltaY,
    velocityY: velocityY,
    type: exports.STAGE_TOOL_OVERLAY_MOUSE_PANNING,
}); };
exports.stageToolOverlayMousePanEnd = function (windowId) { return ({
    windowId: windowId,
    type: exports.STAGE_TOOL_OVERLAY_MOUSE_PAN_END,
}); };
exports.fullScreenTargetDeleted = function () { return ({
    type: exports.FULL_SCREEN_TARGET_DELETED
}); };
exports.loadedSavedState = function (state) { return ({
    type: exports.LOADED_SAVED_STATE,
    state: state
}); };
exports.triedLoadedSavedState = function () { return ({
    type: exports.TRIED_LOADING_APP_STATE,
}); };
exports.stageToolOverlayMouseDoubleClicked = function (windowId, sourceEvent) { return ({
    windowId: windowId,
    type: exports.STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED,
    sourceEvent: sourceEvent
}); };
exports.selectorDoubleClicked = function (item, sourceEvent) { return ({
    item: item,
    type: exports.SELECTOR_DOUBLE_CLICKED,
    sourceEvent: sourceEvent
}); };
exports.resizerPathMoved = function (workspaceId, anchor, originalBounds, newBounds, sourceEvent) { return ({
    type: exports.RESIZER_PATH_MOUSE_MOVED,
    workspaceId: workspaceId,
    anchor: anchor,
    originalBounds: originalBounds,
    newBounds: newBounds,
    sourceEvent: sourceEvent,
}); };
exports.resizerPathStoppedMoving = function (workspaceId, sourceEvent) { return ({
    type: exports.RESIZER_PATH_MOUSE_STOPPED_MOVING,
    workspaceId: workspaceId,
    sourceEvent: __assign({}, sourceEvent)
}); };
exports.windowPaneRowClicked = function (windowId, sourceEvent) { return ({
    windowId: windowId,
    sourceEvent: sourceEvent,
    type: exports.WINDOW_PANE_ROW_CLICKED
}); };
exports.workspaceSelectionDeleted = function (workspaceId) { return ({
    workspaceId: workspaceId,
    type: exports.WORKSPACE_DELETION_SELECTED
}); };
exports.promptedNewWindowUrl = function (workspaceId, location) { return ({
    location: location,
    workspaceId: workspaceId,
    type: exports.PROMPTED_NEW_WINDOW_URL
}); };
exports.stageToolEditTextChanged = function (nodeId, sourceEvent) { return ({
    type: exports.STAGE_TOOL_EDIT_TEXT_CHANGED,
    nodeId: nodeId,
    sourceEvent: sourceEvent
}); };
exports.stageToolEditTextKeyDown = function (nodeId, sourceEvent) { return ({
    type: exports.STAGE_TOOL_EDIT_TEXT_KEY_DOWN,
    nodeId: nodeId,
    sourceEvent: sourceEvent
}); };
exports.stageToolEditTextBlur = function (nodeId, sourceEvent) { return ({
    nodeId: nodeId,
    type: exports.STAGE_TOOL_EDIT_TEXT_BLUR,
    sourceEvent: sourceEvent
}); };
exports.deleteShortcutPressed = function () { return ({
    type: exports.DELETE_SHORCUT_PRESSED,
}); };
exports.fullScreenShortcutPressed = function () { return ({
    type: exports.FULL_SCREEN_SHORTCUT_PRESSED,
}); };
exports.emptyWindowsUrlAdded = function (url) { return ({
    type: exports.EMPTY_WINDOWS_URL_ADDED,
    url: url,
}); };
exports.zoomInShortcutPressed = function () { return ({
    type: exports.ZOOM_IN_SHORTCUT_PRESSED,
}); };
exports.zoomOutShortcutPressed = function () { return ({
    type: exports.ZOOM_OUT_SHORTCUT_PRESSED,
}); };
exports.openNewWindowShortcutPressed = function () { return ({
    type: exports.OPEN_NEW_WINDOW_SHORTCUT_PRESSED,
}); };
exports.cloneWindowShortcutPressed = function () { return ({
    type: exports.CLONE_WINDOW_SHORTCUT_PRESSED,
}); };
exports.escapeShortcutPressed = function () { return ({
    type: exports.ESCAPE_SHORTCUT_PRESSED,
}); };
exports.nextWindowShortcutPressed = function () { return ({
    type: exports.NEXT_WINDOW_SHORTCUT_PRESSED,
}); };
exports.prevWindowShortcutPressed = function () { return ({
    type: exports.PREV_WINDOW_SHORTCUT_PRESSED,
}); };
exports.toggleToolsShortcutPressed = function () { return ({
    type: exports.TOGGLE_TOOLS_SHORTCUT_PRESSED,
}); };
exports.toggleTextEditorPressed = function () { return ({
    type: exports.TOGGLE_TEXT_EDITOR_PRESSED,
}); };
exports.toggleLeftGutterPressed = function () { return ({
    type: exports.TOGGLE_LEFT_GUTTER_PRESSED,
}); };
exports.toggleRightGutterPressed = function () { return ({
    type: exports.TOGGLE_RIGHT_GUTTER_PRESSED,
}); };
exports.stageWheel = function (workspaceId, canvasWidth, canvasHeight, _a) {
    var metaKey = _a.metaKey, ctrlKey = _a.ctrlKey, deltaX = _a.deltaX, deltaY = _a.deltaY, clientX = _a.clientX, clientY = _a.clientY;
    return ({
        workspaceId: workspaceId,
        metaKey: metaKey,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        ctrlKey: ctrlKey,
        deltaX: deltaX,
        deltaY: deltaY,
        type: exports.VISUAL_EDITOR_WHEEL,
    });
};
exports.stageContainerMounted = function (element) { return ({
    element: element,
    type: exports.STAGE_MOUNTED,
}); };
exports.stageMouseMoved = function (sourceEvent) { return ({
    sourceEvent: sourceEvent,
    type: exports.STAGE_MOUSE_MOVED,
}); };
exports.stageMouseClicked = function (sourceEvent) { return ({
    sourceEvent: sourceEvent,
    type: exports.STAGE_MOUSE_CLICKED,
}); };
exports.apiComponentsLoaded = function (components) { return ({
    type: exports.API_COMPONENTS_LOADED,
    components: components
}); };


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/actions/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/actions/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/components-pane.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/react.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var components_pane_pc_1 = __webpack_require__("./src/front-end/components/components-pane.pc");
var pane_1 = __webpack_require__("./src/front-end/components/pane.tsx");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var ICON_SIZE = 110;
var enhanceComponentsPaneCell = recompose_1.compose(recompose_1.pure, state_1.withDragSource({
    getData: function (_a) {
        var tagName = _a.tagName;
        return [state_1.AVAILABLE_COMPONENT, tagName];
    }
}), recompose_1.withHandlers({
    onClick: function (_a) {
        var dispatch = _a.dispatch, tagName = _a.tagName;
        return function () {
            dispatch(actions_1.componentsPaneComponentClicked(tagName));
        };
    }
}), function (Base) { return function (_a) {
    var label = _a.label, selected = _a.selected, screenshot = _a.screenshot, connectDragSource = _a.connectDragSource, onClick = _a.onClick, dispatch = _a.dispatch;
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


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/components-pane.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/components-pane.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/windows-pane.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/react.js");
var windows_pane_pc_1 = __webpack_require__("./src/front-end/components/windows-pane.pc");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var WindowsPaneRow = windows_pane_pc_1.hydrateTdWindowsPaneRow(recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onClick: function (_a) {
        var onClick = _a.onClick, $id = _a.$id;
        return function (event) {
            onClick(event, $id);
        };
    }
})), {});
exports.WindowsPane = windows_pane_pc_1.hydrateTdWindowsPane(recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onWindowClicked: function (_a) {
        var dispatch = _a.dispatch;
        return function (event, windowId) {
            dispatch(actions_1.windowPaneRowClicked(windowId, event));
        };
    }
}), function (Base) { return function (_a) {
    var workspace = _a.workspace, windows = _a.windows, onWindowClicked = _a.onWindowClicked;
    var windowProps = windows.map(function (window) { return (__assign({}, window, { selected: workspace.selectionRefs.find(function (_a) {
            var $type = _a[0], $id = _a[1];
            return $id === window.$id;
        }) })); });
    return React.createElement(Base, { windows: windowProps, onWindowClicked: onWindowClicked });
}; }), {
    TdListItem: null,
    TdWindowsPaneRow: WindowsPaneRow,
    TdList: null,
    TdPane: null
});


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/windows-pane.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/windows-pane.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./src/front-end/application.tsx"));
__export(__webpack_require__("./src/front-end/state/index.ts"));
__export(__webpack_require__("./src/front-end/reducers/index.ts"));
__export(__webpack_require__("./src/front-end/actions/index.ts"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/reducers/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var constants_1 = __webpack_require__("./src/front-end/constants/index.ts");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var aerial_browser_sandbox_1 = __webpack_require__("../aerial-browser-sandbox/index.js");
exports.applicationReducer = function (state, event) {
    if (state === void 0) { state = state_1.createApplicationState(); }
    switch (event.type) {
        case actions_1.LOADED_SAVED_STATE: {
            var newState = event.state;
            state = lodash_1.merge({}, state, JSON.parse(JSON.stringify(newState)));
            return state;
        }
        case actions_1.TREE_NODE_LABEL_CLICKED: {
            var node = event.node;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                selectedFileId: node.$id
            });
        }
        case actions_1.TOGGLE_TARGET_CSS_TARGET_SELECTOR_CLICKED: {
            var _a = event, itemId = _a.itemId, windowId = _a.windowId;
            var window_1 = aerial_browser_sandbox_1.getSyntheticWindow(state, windowId);
            var item = aerial_browser_sandbox_1.getSyntheticWindowChild(window_1, itemId);
            var workspace = state_1.getSyntheticWindowWorkspace(state, window_1.$id);
            state = state_1.toggleWorkspaceTargetCSSSelector(state, workspace.$id, item.source.uri, item.selectorText);
            return state;
        }
    }
    // state = canvasReducer(state, event);
    // state = syntheticBrowserReducer(state, event);
    state = aerial_browser_sandbox_1.syntheticBrowserReducer(state, event);
    state = stageReducer(state, event);
    state = windowPaneReducer(state, event);
    state = componentsPaneReducer(state, event);
    state = shortcutReducer(state, event);
    state = apiReducer(state, event);
    state = dndReducer(state, event);
    // state = externalReducer(state, event);
    return state;
};
var PANE_SENSITIVITY = process.platform === "win32" ? 0.1 : 1;
var ZOOM_SENSITIVITY = process.platform === "win32" ? 2500 : 250;
var MIN_ZOOM = 0.02;
var MAX_ZOOM = 6400 / 100;
var INITIAL_ZOOM_PADDING = 50;
var apiReducer = function (state, event) {
    switch (event.type) {
        case actions_1.API_COMPONENTS_LOADED: {
            var components = event.components;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                availableComponents: constants_1.NATIVE_COMPONENTS.concat(components)
            });
        }
    }
    return state;
};
var componentsPaneReducer = function (state, event) {
    switch (event.type) {
        case actions_1.COMPONENTS_PANE_COMPONENT_CLICKED: {
            var componentId = event.componentId;
            return state_1.setWorkspaceSelection(state, state.selectedWorkspaceId, aerial_common2_1.getStructReference({ $id: componentId, $type: state_1.AVAILABLE_COMPONENT }));
        }
    }
    return state;
};
var shortcutReducer = function (state, event) {
    switch (event.type) {
        case actions_1.TOGGLE_LEFT_GUTTER_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.updateWorkspaceStage(state, workspace.$id, {
                showLeftGutter: !workspace.stage.showLeftGutter
            });
        }
        case actions_1.ESCAPE_SHORTCUT_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.updateWorkspace(state, workspace.$id, {
                selectionRefs: []
            });
        }
        case actions_1.ZOOM_IN_SHORTCUT_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            if (workspace.stage.fullScreen)
                return state;
            return setStageZoom(state, workspace.$id, normalizeZoom(workspace.stage.translate.zoom) * 2);
        }
        case actions_1.ZOOM_OUT_SHORTCUT_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            if (workspace.stage.fullScreen)
                return state;
            return setStageZoom(state, workspace.$id, normalizeZoom(workspace.stage.translate.zoom) / 2);
        }
        case actions_1.PREV_WINDOW_SHORTCUT_PRESSED: {
            return state;
        }
        case actions_1.FULL_SCREEN_TARGET_DELETED: {
            return unfullscreen(state);
        }
        case actions_1.FULL_SCREEN_SHORTCUT_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            var selection = workspace.selectionRefs[0];
            var windowId = selection ? selection[0] === aerial_browser_sandbox_1.SYNTHETIC_WINDOW ? selection[1] : aerial_browser_sandbox_1.getSyntheticNodeWindow(state, selection[1]) && aerial_browser_sandbox_1.getSyntheticNodeWindow(state, selection[1]).$id : null;
            if (windowId && !workspace.stage.fullScreen) {
                var window_2 = aerial_browser_sandbox_1.getSyntheticWindow(state, windowId);
                state = state_1.updateWorkspaceStage(state, workspace.$id, {
                    smooth: true,
                    fullScreen: {
                        windowId: windowId,
                        originalTranslate: workspace.stage.translate,
                        originalWindowBounds: window_2.bounds
                    },
                    translate: {
                        zoom: 1,
                        left: -window_2.bounds.left,
                        top: -window_2.bounds.top
                    }
                });
                return state;
            }
            else if (workspace.stage.fullScreen) {
                return unfullscreen(state);
            }
            else {
                return state;
            }
        }
        case actions_1.CANVAS_MOTION_RESTED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.updateWorkspaceStage(state, workspace.$id, {
                smooth: false
            });
        }
        case actions_1.TOGGLE_TEXT_EDITOR_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.updateWorkspaceStage(state, workspace.$id, {
                showTextEditor: !workspace.stage.showTextEditor
            });
        }
        case actions_1.TOGGLE_RIGHT_GUTTER_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.updateWorkspaceStage(state, workspace.$id, {
                showRightGutter: !workspace.stage.showRightGutter
            });
        }
    }
    return state;
};
var dndReducer = function (state, event) {
    switch (event.type) {
        case actions_1.DND_STARTED: {
            var ref = event.ref;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                draggingRefs: [ref]
            });
        }
        case actions_1.DND_HANDLED: {
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                draggingRefs: []
            });
        }
    }
    return state;
};
var stageReducer = function (state, event) {
    switch (event.type) {
        case actions_1.VISUAL_EDITOR_WHEEL: {
            var _a = event, workspaceId = _a.workspaceId, metaKey = _a.metaKey, ctrlKey = _a.ctrlKey, deltaX = _a.deltaX, deltaY = _a.deltaY, canvasHeight = _a.canvasHeight, canvasWidth = _a.canvasWidth;
            var workspace = state_1.getWorkspaceById(state, workspaceId);
            if (workspace.stage.fullScreen) {
                return state;
            }
            var translate = state_1.getStageTranslate(workspace.stage);
            if (metaKey || ctrlKey) {
                translate = aerial_common2_1.centerTransformZoom(translate, aerial_common2_1.boundsFromRect({
                    width: canvasWidth,
                    height: canvasHeight
                }), lodash_1.clamp(translate.zoom + translate.zoom * deltaY / ZOOM_SENSITIVITY, MIN_ZOOM, MAX_ZOOM), workspace.stage.mousePosition);
            }
            else {
                translate = __assign({}, translate, { left: translate.left - deltaX, top: translate.top - deltaY });
            }
            return state_1.updateWorkspaceStage(state, workspace.$id, { smooth: false, translate: translate });
        }
        case actions_1.TOGGLE_TOOLS_SHORTCUT_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.updateWorkspaceStage(state, workspace.$id, {
                showTools: workspace.stage.showTools == null ? false : !workspace.stage.showTools
            });
        }
        case actions_1.STAGE_TOOL_EDIT_TEXT_KEY_DOWN: {
            var _b = event, sourceEvent = _b.sourceEvent, nodeId = _b.nodeId;
            if (sourceEvent.key === "Escape") {
                var workspace = state_1.getSyntheticNodeWorkspace(state, nodeId);
                state = state_1.setWorkspaceSelection(state, workspace.$id, aerial_common2_1.getStructReference(aerial_browser_sandbox_1.getSyntheticNodeById(state, nodeId)));
                state = state_1.updateWorkspaceStage(state, workspace.$id, {
                    secondarySelection: false
                });
            }
            return state;
        }
        case actions_1.RESIZER_PATH_MOUSE_MOVED:
        case actions_1.RESIZER_MOVED: {
            var workspace = state_1.getSelectedWorkspace(state);
            state = state_1.updateWorkspaceStage(state, workspace.$id, {
                movingOrResizing: true
            });
            return state;
        }
        case actions_1.RESIZER_PATH_MOUSE_STOPPED_MOVING:
        case actions_1.RESIZER_STOPPED_MOVING: {
            var workspace = state_1.getSelectedWorkspace(state);
            state = state_1.updateWorkspaceStage(state, workspace.$id, {
                movingOrResizing: false
            });
            return state;
        }
        case actions_1.WINDOW_FOCUSED: {
            var windowId = event.windowId;
            var window_3 = aerial_browser_sandbox_1.getSyntheticWindow(state, windowId);
            return selectAndCenterSyntheticWindow(state, window_3);
        }
        case aerial_browser_sandbox_1.SYNTHETIC_WINDOW_PROXY_OPENED: {
            var _c = event, instance = _c.instance, isNew = _c.isNew;
            // if a window instance exists in the store, then it's already visible on stage -- could
            // have been loaded from a saved state.
            if (!isNew) {
                return state;
            }
            return selectAndCenterSyntheticWindow(state, instance.struct);
        }
        case actions_1.STAGE_TOOL_OVERLAY_MOUSE_LEAVE: {
            var sourceEvent = event.sourceEvent;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                hoveringRefs: []
            });
        }
        case actions_1.CSS_DECLARATION_TITLE_MOUSE_ENTER: {
            var _d = event, windowId = _d.windowId, ruleId = _d.ruleId;
            var window_4 = aerial_browser_sandbox_1.getSyntheticWindow(state, windowId);
            var selectorText = aerial_browser_sandbox_1.getSyntheticWindowChild(window_4, ruleId).selectorText;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                hoveringRefs: aerial_browser_sandbox_1.getMatchingElements(window_4, selectorText).map(function (element) { return [
                    element.$type,
                    element.$id
                ]; })
            });
        }
        case actions_1.CSS_DECLARATION_TITLE_MOUSE_LEAVE: {
            var _e = event, windowId = _e.windowId, ruleId = _e.ruleId;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                hoveringRefs: []
            });
        }
        case actions_1.BREADCRUMB_ITEM_CLICKED: {
            var _f = event, windowId = _f.windowId, nodeId = _f.nodeId;
            var window_5 = aerial_browser_sandbox_1.getSyntheticWindow(state, windowId);
            var browser = state_1.getSyntheticWindowBrowser(state, window_5.$id);
            var node = aerial_browser_sandbox_1.getSyntheticNodeById(browser, nodeId);
            var workspace = state_1.getSyntheticWindowWorkspace(state, window_5.$id);
            return state_1.setWorkspaceSelection(state, workspace.$id, [node.$type, node.$id]);
        }
        case actions_1.BREADCRUMB_ITEM_MOUSE_ENTER: {
            var _g = event, windowId = _g.windowId, nodeId = _g.nodeId;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                hoveringRefs: [[aerial_browser_sandbox_1.SYNTHETIC_ELEMENT, nodeId]]
            });
        }
        case actions_1.BREADCRUMB_ITEM_MOUSE_LEAVE: {
            var _h = event, windowId = _h.windowId, nodeId = _h.nodeId;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                hoveringRefs: []
            });
        }
        case actions_1.EMPTY_WINDOWS_URL_ADDED: {
            var workspaceId = state.selectedWorkspaceId;
            return centerStage(state, workspaceId, {
                left: 0,
                top: 0,
                right: aerial_browser_sandbox_1.DEFAULT_WINDOW_WIDTH,
                bottom: aerial_browser_sandbox_1.DEFAULT_WINDOW_HEIGHT
            }, false, true);
        }
        case actions_1.STAGE_MOUNTED:
            {
                var element = event.element;
                var _j = element.getBoundingClientRect() || {}, _k = _j.width, width = _k === void 0 ? 400 : _k, _l = _j.height, height = _l === void 0 ? 300 : _l;
                var workspaceId = state.selectedWorkspaceId;
                var workspace = state_1.getSelectedWorkspace(state);
                state = state_1.updateWorkspaceStage(state, workspaceId, { container: element });
                // do not center if in full screen mode
                if (workspace.stage.fullScreen) {
                    return state;
                }
                return centerSelectedWorkspace(state);
            }
            ;
        case actions_1.STAGE_TOOL_OVERLAY_MOUSE_PAN_START: {
            var windowId = event.windowId;
            var workspace = state_1.getSyntheticWindowWorkspace(state, windowId);
            return state_1.updateWorkspaceStage(state, workspace.$id, { panning: true });
        }
        case actions_1.STAGE_TOOL_OVERLAY_MOUSE_PAN_END: {
            var windowId = event.windowId;
            var workspace = state_1.getSyntheticWindowWorkspace(state, windowId);
            return state_1.updateWorkspaceStage(state, workspace.$id, { panning: false });
        }
        case actions_1.STAGE_MOUSE_MOVED:
            {
                var _m = event.sourceEvent, pageX = _m.pageX, pageY = _m.pageY;
                state = state_1.updateWorkspaceStage(state, state.selectedWorkspaceId, {
                    mousePosition: {
                        left: pageX,
                        top: pageY
                    }
                });
                var workspace = state_1.getSelectedWorkspace(state);
                // TODO - in the future, we'll probably want to be able to highlight hovered nodes as the user is moving an element around to indicate where
                // they can drop the element. 
                var targetRef = workspace.stage.movingOrResizing ? null : state_1.getStageToolMouseNodeTargetReference(state, event);
                state = state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                    hoveringRefs: targetRef ? [targetRef] : []
                });
                return state;
            }
            ;
        case actions_1.STAGE_MOUSE_CLICKED: {
            var sourceEvent = event.sourceEvent;
            if (/textarea|input/i.test(sourceEvent.target.nodeName)) {
                return state;
            }
            // alt key opens up a new link
            var altKey = sourceEvent.altKey;
            var workspace = state_1.getSelectedWorkspace(state);
            state = updateWorkspaceStageSmoothing(state, workspace);
            // do not allow selection while window is panning (scrolling)
            if (workspace.stage.panning || workspace.stage.movingOrResizing)
                return state;
            var targetRef = state_1.getStageToolMouseNodeTargetReference(state, event);
            if (!targetRef) {
                return state;
            }
            if (!altKey) {
                state = handleWindowSelectionFromAction(state, targetRef, event);
                state = state_1.updateWorkspaceStage(state, workspace.$id, {
                    secondarySelection: false
                });
                return state;
            }
            return state;
        }
        case actions_1.STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED: {
            var _o = event, sourceEvent = _o.sourceEvent, windowId = _o.windowId;
            var workspace = state_1.getSyntheticWindowWorkspace(state, windowId);
            var targetRef = state_1.getStageToolMouseNodeTargetReference(state, event);
            if (!targetRef)
                return state;
            state = state_1.updateWorkspaceStage(state, workspace.$id, {
                secondarySelection: true
            });
            state = state_1.setWorkspaceSelection(state, workspace.$id, targetRef);
            return state;
        }
        case actions_1.WINDOW_SELECTION_SHIFTED: {
            var windowId = event.windowId;
            return selectAndCenterSyntheticWindow(state, aerial_browser_sandbox_1.getSyntheticWindow(state, windowId));
        }
        case actions_1.SELECTOR_DOUBLE_CLICKED: {
            var _p = event, sourceEvent = _p.sourceEvent, item = _p.item;
            var workspace = state_1.getSyntheticNodeWorkspace(state, item.$id);
            state = state_1.updateWorkspaceStage(state, workspace.$id, {
                secondarySelection: true
            });
            state = state_1.setWorkspaceSelection(state, workspace.$id, aerial_common2_1.getStructReference(item));
            return state;
        }
        case actions_1.WORKSPACE_DELETION_SELECTED: {
            var workspaceId = event.workspaceId;
            state = state_1.clearWorkspaceSelection(state, workspaceId);
            return state;
        }
        case actions_1.STAGE_TOOL_WINDOW_TITLE_CLICKED: {
            state = updateWorkspaceStageSmoothing(state);
            return handleWindowSelectionFromAction(state, aerial_common2_1.getStructReference(aerial_browser_sandbox_1.getSyntheticWindow(state, event.windowId)), event);
        }
        case actions_1.STAGE_TOOL_WINDOW_BACKGROUND_CLICKED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.clearWorkspaceSelection(state, workspace.$id);
        }
    }
    return state;
};
// const externalReducer = (state: ApplicationState, event: BaseEvent) => {
//   switch(event.type) {
//     case OPEN_EXTERNAL_WINDOWS_REQUESTED: {
//       console.log("REQ");
//       const { uris }: OpenExternalWindowsRequested = event;
//       const workspace = getWorkspaceById(state, state.selectedWorkspaceId);
//       const browser = getSyntheticBrowser(state, workspace.browserId);
//       const selection = [];
//       for (const uri of uris) {
//         let window = browser.windows.find(window => {
//           return window.location === uri;
//         });
//         if (!window) {
//           window = createSyntheticWindow({
//             location: uri,
//             bounds: { left: 0, top: 0, right: 100, bottom: 100 }
//           });
//           state = addSyntheticWindow(state, browser.$id, window);
//         }
//         selection.push(window);
//       }
//       console.log(selection);
//       return state;
//     }
//   }
//   return state;
// };
var unfullscreen = function (state, workspaceId) {
    if (workspaceId === void 0) { workspaceId = state.selectedWorkspaceId; }
    var workspace = state_1.getWorkspaceById(state, workspaceId);
    var originalWindowBounds = workspace.stage.fullScreen.originalWindowBounds;
    state = state_1.updateWorkspaceStage(state, workspace.$id, {
        smooth: true,
        fullScreen: undefined
    });
    state = state_1.updateWorkspaceStage(state, workspace.$id, {
        translate: workspace.stage.fullScreen.originalTranslate,
        smooth: true
    });
    return state;
};
var selectAndCenterSyntheticWindow = function (state, window) {
    var workspace = state_1.getSelectedWorkspace(state);
    if (!workspace.stage.container)
        return state;
    var _a = workspace.stage.container.getBoundingClientRect(), width = _a.width, height = _a.height;
    state = centerStage(state, state.selectedWorkspaceId, window.bounds, true, workspace.stage.fullScreen ? workspace.stage.fullScreen.originalTranslate.zoom : true);
    // update translate
    workspace = state_1.getSelectedWorkspace(state);
    if (workspace.stage.fullScreen) {
        state = state_1.updateWorkspaceStage(state, workspace.$id, {
            smooth: true,
            fullScreen: {
                windowId: window.$id,
                originalTranslate: workspace.stage.translate,
                originalWindowBounds: window.bounds
            },
            translate: {
                zoom: 1,
                left: -window.bounds.left,
                top: -window.bounds.top
            }
        });
    }
    state = state_1.setWorkspaceSelection(state, workspace.$id, aerial_common2_1.getStructReference(window));
    return state;
};
var centerSelectedWorkspace = function (state, smooth) {
    if (smooth === void 0) { smooth = false; }
    var workspace = state_1.getWorkspaceById(state, state.selectedWorkspaceId);
    var innerBounds = state_1.getSyntheticBrowserBounds(aerial_browser_sandbox_1.getSyntheticBrowser(state, workspace.browserId));
    // no windows loaded
    if (innerBounds.left + innerBounds.right + innerBounds.top + innerBounds.bottom === 0) {
        console.warn("Stage mounted before windows have been loaded");
        return state;
    }
    return centerStage(state, workspace.$id, innerBounds, smooth, true);
};
var centerStage = function (state, workspaceId, innerBounds, smooth, zoomOrZoomToFit) {
    var workspace = state_1.getWorkspaceById(state, workspaceId);
    var _a = workspace.stage, container = _a.container, translate = _a.translate;
    if (!container)
        return state;
    var _b = container.getBoundingClientRect(), width = _b.width, height = _b.height;
    var innerSize = aerial_common2_1.getBoundsSize(innerBounds);
    var centered = {
        left: -innerBounds.left + width / 2 - (innerSize.width) / 2,
        top: -innerBounds.top + height / 2 - (innerSize.height) / 2,
    };
    var scale = typeof zoomOrZoomToFit === "boolean" ? Math.min((width - INITIAL_ZOOM_PADDING) / innerSize.width, (height - INITIAL_ZOOM_PADDING) / innerSize.height) : typeof zoomOrZoomToFit === "number" ? zoomOrZoomToFit : translate.zoom;
    return state_1.updateWorkspaceStage(state, workspaceId, {
        smooth: smooth,
        translate: aerial_common2_1.centerTransformZoom(__assign({}, centered, { zoom: 1 }), { left: 0, top: 0, right: width, bottom: height }, scale)
    });
};
var handleWindowSelectionFromAction = function (state, ref, event) {
    var sourceEvent = event.sourceEvent;
    var workspace = state_1.getSelectedWorkspace(state);
    // TODO - may want to allow multi selection once it's confirmed to work on
    // all scenarios.
    // meta key + no items selected should display source of 
    // if (sourceEvent.metaKey && workspace.selectionRefs.length) {
    //   return toggleWorkspaceSelection(state, workspace.$id, ref);
    // } else if(!sourceEvent.metaKey) {
    //   return setWorkspaceSelection(state, workspace.$id, ref);
    // }
    return state_1.setWorkspaceSelection(state, workspace.$id, ref);
};
var normalizeZoom = function (zoom) {
    return (zoom < 1 ? 1 / Math.round(1 / zoom) : Math.round(zoom));
};
var windowPaneReducer = function (state, event) {
    switch (event.type) {
        case actions_1.WINDOW_PANE_ROW_CLICKED: {
            var windowId = event.windowId;
            var window_6 = aerial_browser_sandbox_1.getSyntheticWindow(state, windowId);
            return selectAndCenterSyntheticWindow(state, window_6);
        }
    }
    return state;
};
var updateWorkspaceStageSmoothing = function (state, workspace) {
    if (!workspace)
        workspace = state_1.getSelectedWorkspace(state);
    if (!workspace.stage.fullScreen && workspace.stage.smooth) {
        return state_1.updateWorkspaceStage(state, workspace.$id, {
            smooth: false
        });
    }
    return state;
};
var setStageZoom = function (state, workspaceId, zoom, smooth) {
    if (smooth === void 0) { smooth = true; }
    var workspace = state_1.getWorkspaceById(state, workspaceId);
    return state_1.updateWorkspaceStage(state, workspace.$id, {
        smooth: smooth,
        translate: aerial_common2_1.centerTransformZoom(workspace.stage.translate, workspace.stage.container.getBoundingClientRect(), lodash_1.clamp(zoom, MIN_ZOOM, MAX_ZOOM), workspace.stage.mousePosition)
    });
};


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/reducers/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/reducers/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/sagas/api.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var io = __webpack_require__("./node_modules/socket.io-client/lib/index.js");
var redux_saga_1 = __webpack_require__("./node_modules/redux-saga/es/index.js");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var PERSIST_DELAY_TIMEOUT = 1000;
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var effects_1 = __webpack_require__("./node_modules/redux-saga/es/effects.js");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var SAVE_KEY = "app-state";
function apiSaga() {
    var apiHost;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                apiHost = (_a.sent()).apiHost;
                return [4 /*yield*/, effects_1.fork(getComponents)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(syncWorkspaceState)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(aerial_common2_1.createSocketIOSaga(io(apiHost)))];
            case 4:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handlePingPong)];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.apiSaga = apiSaga;
function getComponents() {
    var apiHost, response, json;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 6];
                return [4 /*yield*/, effects_1.select()];
            case 1:
                apiHost = (_a.sent()).apiHost;
                return [4 /*yield*/, effects_1.call(fetch, apiHost + "/components")];
            case 2:
                response = _a.sent();
                return [4 /*yield*/, effects_1.call(response.json.bind(response))];
            case 3:
                json = _a.sent();
                return [4 /*yield*/, effects_1.put(actions_1.apiComponentsLoaded(json))];
            case 4:
                _a.sent();
                // just refresh whenever a file has changed
                return [4 /*yield*/, effects_1.take([actions_1.FILE_CONTENT_CHANGED, actions_1.FILE_REMOVED, actions_1.COMPONENT_SCREENSHOT_SAVED])];
            case 5:
                // just refresh whenever a file has changed
                _a.sent();
                return [3 /*break*/, 0];
            case 6: return [2 /*return*/];
        }
    });
}
function syncWorkspaceState() {
    var state, apiHost, pojoState, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(function () {
                    var prevState, state_2, pojoState, apiHost_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, effects_1.take(actions_1.TRIED_LOADING_APP_STATE)];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2:
                                if (false) return [3 /*break*/, 7];
                                return [4 /*yield*/, effects_1.take()];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, effects_1.call(redux_saga_1.delay, PERSIST_DELAY_TIMEOUT)];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, effects_1.select()];
                            case 5:
                                state_2 = _a.sent();
                                if (prevState === state_2) {
                                    return [3 /*break*/, 2];
                                }
                                prevState = state_2;
                                pojoState = state_1.serializeApplicationState(state_2);
                                apiHost_1 = state_2.apiHost;
                                return [4 /*yield*/, effects_1.call(fetch, apiHost_1 + "/storage/" + state_2.storageNamespace + SAVE_KEY, {
                                        method: "POST",
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(pojoState)
                                    })];
                            case 6:
                                _a.sent();
                                return [3 /*break*/, 2];
                            case 7: return [2 /*return*/];
                        }
                    });
                })];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 3:
                apiHost = (_a.sent()).apiHost;
                _a.label = 4;
            case 4:
                _a.trys.push([4, 8, , 9]);
                return [4 /*yield*/, effects_1.call(function () {
                        return __awaiter(this, void 0, void 0, function () {
                            var response;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fetch(apiHost + "/storage/" + state.storageNamespace + SAVE_KEY)];
                                    case 1:
                                        response = _a.sent();
                                        return [4 /*yield*/, response.json()];
                                    case 2: return [2 /*return*/, _a.sent()];
                                }
                            });
                        });
                    })];
            case 5:
                pojoState = _a.sent();
                if (!pojoState) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.put(actions_1.loadedSavedState(pojoState))];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                e_1 = _a.sent();
                console.warn(e_1);
                return [3 /*break*/, 9];
            case 9: return [4 /*yield*/, effects_1.put(actions_1.triedLoadedSavedState())];
            case 10:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handlePingPong() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take("$$TANDEM_FE_PING")];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.put({ type: "$$TANDEM_FE_PONG", $public: true })];
            case 2:
                _a.sent();
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/api.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/api.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/sagas/synthetic-browser.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var redux_saga_1 = __webpack_require__("./node_modules/redux-saga/es/index.js");
var mesh_1 = __webpack_require__("./node_modules/mesh/index.js");
var utils_1 = __webpack_require__("./src/front-end/utils/index.ts");
var effects_1 = __webpack_require__("./node_modules/redux-saga/es/effects.js");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var source_mutation_1 = __webpack_require__("../source-mutation/index.js");
var aerial_browser_sandbox_1 = __webpack_require__("../aerial-browser-sandbox/index.js");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
function frontEndSyntheticBrowserSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(handleTextEditBlur)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleWindowMousePanned)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleFullScreenWindow)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleScrollInFullScreenMode)];
            case 4:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleTextEditorEscaped)];
            case 5:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleEmptyWindowsUrlAdded)];
            case 6:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleLoadedSavedState)];
            case 7:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleCSSDeclarationChanges)];
            case 8:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleWatchWindowResource)];
            case 9:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleFileChanged)];
            case 10:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleOpenExternalWindowsRequested)];
            case 11:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.frontEndSyntheticBrowserSaga = frontEndSyntheticBrowserSaga;
function handleEmptyWindowsUrlAdded() {
    var url, state;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(actions_1.EMPTY_WINDOWS_URL_ADDED)];
            case 1:
                url = (_a.sent()).url;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.openSyntheticWindowRequest({ location: url }, state_1.getSelectedWorkspace(state).browserId))];
            case 3:
                _a.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function handleWatchWindowResource() {
    var watchingUris, _loop_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                watchingUris = [];
                _loop_1 = function () {
                    var action, state, allUris, updates;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, effects_1.take([
                                    aerial_browser_sandbox_1.SYNTHETIC_WINDOW_CHANGED,
                                    aerial_browser_sandbox_1.SYNTHETIC_WINDOW_LOADED,
                                    aerial_browser_sandbox_1.SYNTHETIC_WINDOW_CLOSED,
                                    aerial_common2_1.REMOVED
                                ])];
                            case 1:
                                action = _a.sent();
                                return [4 /*yield*/, effects_1.select()];
                            case 2:
                                state = _a.sent();
                                allUris = lodash_1.uniq(state.browserStore.records.reduce(function (a, b) {
                                    return a.concat(b.windows.reduce(function (a2, b2) {
                                        return a2.concat(b2.externalResourceUris);
                                    }, []));
                                }, []));
                                updates = source_mutation_1.diffArray(allUris, watchingUris, function (a, b) { return a === b ? 0 : -1; }).mutations.filter(function (mutation) { return mutation.type === source_mutation_1.ARRAY_UPDATE; });
                                // no changes, so just continue
                                if (updates.length === allUris.length) {
                                    return [2 /*return*/, "continue"];
                                }
                                return [4 /*yield*/, effects_1.spawn(function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, effects_1.call(utils_1.apiWatchUris, watchingUris = allUris, state)];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    })];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _a.label = 1;
            case 1:
                if (false) return [3 /*break*/, 3];
                return [5 /*yield**/, _loop_1()];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
function handleTextEditorEscaped() {
    var _a, sourceEvent, nodeId;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(actions_1.STAGE_TOOL_EDIT_TEXT_KEY_DOWN)];
            case 1:
                _a = (_b.sent()), sourceEvent = _a.sourceEvent, nodeId = _a.nodeId;
                if (sourceEvent.key !== "Escape") {
                    return [3 /*break*/, 0];
                }
                return [4 /*yield*/, effects_1.call(applyTextEditChanges, sourceEvent, nodeId)];
            case 2:
                _b.sent();
                // blur does _not_ get fired on escape.
                return [4 /*yield*/, effects_1.call(nodeValueStoppedEditing, nodeId)];
            case 3:
                // blur does _not_ get fired on escape.
                _b.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function applyTextEditChanges(sourceEvent, nodeId) {
    var state, window, text, workspace;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                window = aerial_browser_sandbox_1.getSyntheticNodeWindow(state, nodeId);
                text = String(sourceEvent.target.textContent || "").trim();
                workspace = state_1.getSyntheticNodeWorkspace(state, nodeId);
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.syntheticNodeTextContentChanged(window.$id, nodeId, text))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleTextEditBlur() {
    var _a, sourceEvent, nodeId;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(actions_1.STAGE_TOOL_EDIT_TEXT_BLUR)];
            case 1:
                _a = (_b.sent()), sourceEvent = _a.sourceEvent, nodeId = _a.nodeId;
                return [4 /*yield*/, effects_1.call(applyTextEditChanges, sourceEvent, nodeId)];
            case 2:
                _b.sent();
                return [4 /*yield*/, effects_1.call(nodeValueStoppedEditing, nodeId)];
            case 3:
                _b.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function nodeValueStoppedEditing(nodeId) {
    var state, window;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                window = aerial_browser_sandbox_1.getSyntheticNodeWindow(state, nodeId);
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.syntheticNodeValueStoppedEditing(window.$id, nodeId))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
var MOMENTUM_THRESHOLD = 100;
var DEFAULT_MOMENTUM_DAMP = 0.1;
var MOMENTUM_DELAY = 50;
var VELOCITY_MULTIPLIER = 10;
function handleScrollInFullScreenMode() {
    var _a, deltaX, deltaY, state, workspace, window_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(actions_1.VISUAL_EDITOR_WHEEL)];
            case 1:
                _a = (_b.sent()), deltaX = _a.deltaX, deltaY = _a.deltaY;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = (_b.sent());
                workspace = state_1.getSelectedWorkspace(state);
                if (!workspace.stage.fullScreen) {
                    return [3 /*break*/, 0];
                }
                window_1 = state_1.getSyntheticWindow(state, workspace.stage.fullScreen.windowId);
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.syntheticWindowScroll(window_1.$id, aerial_common2_1.shiftPoint(window_1.scrollPosition || { left: 0, top: 0 }, {
                        left: 0,
                        top: deltaY
                    })))];
            case 3:
                _b.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function handleFileChanged() {
    var _loop_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _loop_2 = function () {
                    var _a, filePath, publicPath, state, workspace, windows, _i, windows_1, window_2, shouldReload;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, effects_1.take([actions_1.FILE_CONTENT_CHANGED, actions_1.FILE_REMOVED])];
                            case 1:
                                _a = _b.sent(), filePath = _a.filePath, publicPath = _a.publicPath;
                                return [4 /*yield*/, effects_1.select()];
                            case 2:
                                state = _b.sent();
                                workspace = state_1.getSelectedWorkspace(state);
                                windows = state_1.getSyntheticBrowser(state, workspace.browserId).windows;
                                for (_i = 0, windows_1 = windows; _i < windows_1.length; _i++) {
                                    window_2 = windows_1[_i];
                                    shouldReload = window_2.externalResourceUris.find(function (uri) { return ((publicPath && uri.indexOf(publicPath) !== -1) || uri.indexOf(filePath) !== -1); });
                                    if (shouldReload) {
                                        window_2.instance.location.reload();
                                    }
                                }
                                return [2 /*return*/];
                        }
                    });
                };
                _a.label = 1;
            case 1:
                if (false) return [3 /*break*/, 3];
                return [5 /*yield**/, _loop_2()];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
function handleOpenExternalWindowsRequested() {
    var uris, state, workspace, browser, openedNewWindow, lastExistingWindow, _loop_3, _i, uris_1, uri;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 9];
                return [4 /*yield*/, effects_1.take(actions_1.OPEN_EXTERNAL_WINDOWS_REQUESTED)];
            case 1:
                uris = (_a.sent()).uris;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                workspace = state_1.getSelectedWorkspace(state);
                browser = state_1.getSyntheticBrowser(state, workspace.browserId);
                openedNewWindow = false;
                lastExistingWindow = void 0;
                _loop_3 = function (uri) {
                    var existingWindow;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                existingWindow = browser.windows.find(function (window) { return window.location === uri; });
                                if (existingWindow) {
                                    lastExistingWindow = existingWindow;
                                    return [2 /*return*/, "continue"];
                                }
                                openedNewWindow = true;
                                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.openSyntheticWindowRequest({
                                        location: uri
                                    }, browser.$id))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, uris_1 = uris;
                _a.label = 3;
            case 3:
                if (!(_i < uris_1.length)) return [3 /*break*/, 6];
                uri = uris_1[_i];
                return [5 /*yield**/, _loop_3(uri)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                if (!(!openedNewWindow && lastExistingWindow)) return [3 /*break*/, 8];
                return [4 /*yield*/, effects_1.put(actions_1.windowFocused(lastExistingWindow.$id))];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8: return [3 /*break*/, 0];
            case 9: return [2 /*return*/];
        }
    });
}
function handleLoadedSavedState() {
    var state, workspace, browser, _i, _a, window_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(actions_1.LOADED_SAVED_STATE)];
            case 1:
                _b.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                workspace = state_1.getSelectedWorkspace(state);
                browser = state_1.getSyntheticBrowser(state, workspace.browserId);
                _i = 0, _a = browser.windows;
                _b.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                window_3 = _a[_i];
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.openSyntheticWindowRequest(window_3, browser.$id))];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 0];
            case 7: return [2 /*return*/];
        }
    });
}
function persistDeclarationChange(declaration, name, value) {
    var owner, element, mutation, mutation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                owner = declaration.$owner;
                if (!(owner.nodeType === aerial_browser_sandbox_1.SEnvNodeTypes.ELEMENT)) return [3 /*break*/, 2];
                element = owner;
                mutation = aerial_browser_sandbox_1.createSetElementAttributeMutation(element, "style", element.getAttribute("style"));
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.deferApplyFileMutationsRequest(mutation))];
            case 1:
                _a.sent();
                return [3 /*break*/, 4];
            case 2:
                mutation = aerial_browser_sandbox_1.cssStyleDeclarationSetProperty(declaration, name, value);
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.deferApplyFileMutationsRequest(mutation))];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}
// TODO - move this to synthetic browser
function handleCSSDeclarationChanges() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(function handleNameChanges() {
                    var _a, value, windowId, declarationId, state, window_4;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (false) return [3 /*break*/, 3];
                                return [4 /*yield*/, effects_1.take(actions_1.CSS_DECLARATION_NAME_CHANGED)];
                            case 1:
                                _a = _b.sent(), value = _a.value, windowId = _a.windowId, declarationId = _a.declarationId;
                                return [4 /*yield*/, effects_1.select()];
                            case 2:
                                state = _b.sent();
                                window_4 = state_1.getSyntheticWindow(state, windowId);
                                return [3 /*break*/, 0];
                            case 3: return [2 /*return*/];
                        }
                    });
                })];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function handleValueChanges() {
                        var _a, name_1, value, windowId, declarationId, state, window_5, declaration;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 4];
                                    return [4 /*yield*/, effects_1.take(actions_1.CSS_DECLARATION_VALUE_CHANGED)];
                                case 1:
                                    _a = _b.sent(), name_1 = _a.name, value = _a.value, windowId = _a.windowId, declarationId = _a.declarationId;
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    state = _b.sent();
                                    window_5 = state_1.getSyntheticWindow(state, windowId);
                                    declaration = aerial_browser_sandbox_1.getSyntheticWindowChild(window_5, declarationId).instance;
                                    declaration;
                                    // null or ""
                                    if (!value) {
                                        declaration.removeProperty(name_1);
                                    }
                                    else {
                                        declaration.setProperty(name_1, value);
                                    }
                                    return [4 /*yield*/, effects_1.call(persistDeclarationChange, declaration, name_1, value)];
                                case 3:
                                    _b.sent();
                                    return [3 /*break*/, 0];
                                case 4: return [2 /*return*/];
                            }
                        });
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function handleNewDeclaration() {
                        var _a, name_2, value, windowId, declarationId, state, window_6, declaration;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 4];
                                    return [4 /*yield*/, effects_1.take(actions_1.CSS_DECLARATION_CREATED)];
                                case 1:
                                    _a = _b.sent(), name_2 = _a.name, value = _a.value, windowId = _a.windowId, declarationId = _a.declarationId;
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    state = _b.sent();
                                    window_6 = state_1.getSyntheticWindow(state, windowId);
                                    declaration = aerial_browser_sandbox_1.getSyntheticWindowChild(window_6, declarationId).instance;
                                    declaration.setProperty(name_2, value);
                                    return [4 /*yield*/, effects_1.call(persistDeclarationChange, declaration, name_2, value)];
                                case 3:
                                    _b.sent();
                                    return [3 /*break*/, 0];
                                case 4: return [2 /*return*/];
                            }
                        });
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
// fugly quick momentum scrolling implementation
function handleWindowMousePanned() {
    function scrollDelta(windowId, deltaY) {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.syntheticWindowScroll(windowId, aerial_common2_1.shiftPoint(panStartScrollPosition, {
                        left: 0,
                        top: -deltaY
                    })))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }
    var deltaTop, deltaLeft, currentWindowId, panStartScrollPosition, lastPaneEvent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                deltaTop = 0;
                deltaLeft = 0;
                return [4 /*yield*/, effects_1.fork(function () {
                        var windowId, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 3];
                                    return [4 /*yield*/, effects_1.take(actions_1.STAGE_TOOL_OVERLAY_MOUSE_PAN_START)];
                                case 1:
                                    windowId = (_b.sent()).windowId;
                                    _a = state_1.getSyntheticWindow;
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    panStartScrollPosition = _a.apply(void 0, [_b.sent(), windowId]).scrollPosition || { left: 0, top: 0 };
                                    return [3 /*break*/, 0];
                                case 3: return [2 /*return*/];
                            }
                        });
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function () {
                        var event_1, windowId, deltaY, center, newVelocityY, zoom, _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 4];
                                    return [4 /*yield*/, effects_1.take(actions_1.STAGE_TOOL_OVERLAY_MOUSE_PANNING)];
                                case 1:
                                    event_1 = lastPaneEvent = (_c.sent());
                                    windowId = event_1.windowId, deltaY = event_1.deltaY, center = event_1.center, newVelocityY = event_1.velocityY;
                                    _a = state_1.getStageTranslate;
                                    _b = state_1.getSelectedWorkspace;
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    zoom = _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).stage]).zoom;
                                    return [4 /*yield*/, scrollDelta(windowId, deltaY / zoom)];
                                case 3:
                                    _c.sent();
                                    return [3 /*break*/, 0];
                                case 4: return [2 /*return*/];
                            }
                        });
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function () {
                        var _loop_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _loop_4 = function () {
                                        var windowId, deltaY, velocityY, zoom, _a, _b;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0: return [4 /*yield*/, effects_1.take(actions_1.STAGE_TOOL_OVERLAY_MOUSE_PAN_END)];
                                                case 1:
                                                    _c.sent();
                                                    windowId = lastPaneEvent.windowId, deltaY = lastPaneEvent.deltaY, velocityY = lastPaneEvent.velocityY;
                                                    _a = state_1.getStageTranslate;
                                                    _b = state_1.getSelectedWorkspace;
                                                    return [4 /*yield*/, effects_1.select()];
                                                case 2:
                                                    zoom = _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).stage]).zoom;
                                                    return [4 /*yield*/, spring(deltaY, velocityY * VELOCITY_MULTIPLIER, function (deltaY) {
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0: return [4 /*yield*/, scrollDelta(windowId, deltaY / zoom)];
                                                                    case 1:
                                                                        _a.sent();
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        })];
                                                case 3:
                                                    _c.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _a.label = 1;
                                case 1:
                                    if (false) return [3 /*break*/, 3];
                                    return [5 /*yield**/, _loop_4()];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 1];
                                case 3: return [2 /*return*/];
                            }
                        });
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
var WINDOW_SYNC_MS = 1000 / 30;
function handleFullScreenWindow() {
    var currentFullScreenWindowId, previousWindowBounds, waitForFullScreenMode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                waitForFullScreenMode = mesh_1.createDeferredPromise();
                return [4 /*yield*/, effects_1.fork(function () {
                        var state, workspace, windowId, window_7;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 5];
                                    // TODO - possibly change to WINDOW_SCOPE_CHANGED
                                    return [4 /*yield*/, effects_1.take([actions_1.FULL_SCREEN_SHORTCUT_PRESSED, aerial_browser_sandbox_1.SYNTHETIC_WINDOW_PROXY_OPENED, actions_1.WINDOW_SELECTION_SHIFTED, actions_1.FULL_SCREEN_TARGET_DELETED])];
                                case 1:
                                    // TODO - possibly change to WINDOW_SCOPE_CHANGED
                                    _a.sent();
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    state = _a.sent();
                                    workspace = state_1.getSelectedWorkspace(state);
                                    windowId = workspace.stage.fullScreen && workspace.stage.fullScreen.windowId;
                                    if (!currentFullScreenWindowId) return [3 /*break*/, 4];
                                    return [4 /*yield*/, effects_1.put(aerial_common2_1.resized(currentFullScreenWindowId, aerial_browser_sandbox_1.SYNTHETIC_WINDOW, previousWindowBounds))];
                                case 3:
                                    _a.sent();
                                    previousWindowBounds = undefined;
                                    currentFullScreenWindowId = undefined;
                                    // TODO - revert window size
                                    waitForFullScreenMode = mesh_1.createDeferredPromise();
                                    _a.label = 4;
                                case 4:
                                    if (windowId) {
                                        window_7 = state_1.getSyntheticWindow(state, windowId);
                                        previousWindowBounds = workspace.stage.fullScreen.originalWindowBounds;
                                        waitForFullScreenMode.resolve(true);
                                    }
                                    currentFullScreenWindowId = windowId;
                                    return [3 /*break*/, 0];
                                case 5: return [2 /*return*/];
                            }
                        });
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function syncFullScreenWindowSize() {
                        var state, workspace, container, rect, window_8;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 5];
                                    return [4 /*yield*/, effects_1.call(function () { return waitForFullScreenMode.promise; })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    state = _a.sent();
                                    workspace = state_1.getSelectedWorkspace(state);
                                    container = workspace.stage.container;
                                    rect = container.getBoundingClientRect();
                                    window_8 = state_1.getSyntheticWindow(state, currentFullScreenWindowId);
                                    return [4 /*yield*/, effects_1.put(aerial_common2_1.resized(currentFullScreenWindowId, aerial_browser_sandbox_1.SYNTHETIC_WINDOW, {
                                            left: window_8.bounds.left,
                                            top: window_8.bounds.top,
                                            right: window_8.bounds.left + rect.width,
                                            bottom: window_8.bounds.top + rect.height,
                                        }))];
                                case 3:
                                    _a.sent();
                                    return [4 /*yield*/, effects_1.call(function () { return new Promise(function (resolve) { return setTimeout(resolve, WINDOW_SYNC_MS); }); })];
                                case 4:
                                    _a.sent();
                                    return [3 /*break*/, 0];
                                case 5: return [2 /*return*/];
                            }
                        });
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function spring(start, velocityY, iterate, damp, complete) {
    if (damp === void 0) { damp = DEFAULT_MOMENTUM_DAMP; }
    if (complete === void 0) { complete = function () { }; }
    function tick() {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i += damp;
                    currentValue += velocityY / (i / 1);
                    if (i >= 1) {
                        return [2 /*return*/, complete()];
                    }
                    return [4 /*yield*/, iterate(currentValue)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, effects_1.call(redux_saga_1.delay, MOMENTUM_DELAY)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, tick()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }
    var i, v, currentValue;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                v = velocityY;
                currentValue = start;
                return [4 /*yield*/, tick()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/synthetic-browser.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/synthetic-browser.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/sagas/workspace.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var effects_1 = __webpack_require__("./node_modules/redux-saga/es/effects.js");
var utils_1 = __webpack_require__("./src/front-end/utils/index.ts");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var WINDOW_PADDING = 10;
var aerial_browser_sandbox_1 = __webpack_require__("../aerial-browser-sandbox/index.js");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
// import { deleteShortcutPressed, , apiComponentsLoaded } from "front-end";
function mainWorkspaceSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(openDefaultWindow)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleAltClickElement)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleMetaClickElement)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleMetaClickComponentCell)];
            case 4:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleDeleteKeyPressed)];
            case 5:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleNextWindowPressed)];
            case 6:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handlePrevWindowPressed)];
            case 7:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSelectionMoved)];
            case 8:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSelectionStoppedMoving)];
            case 9:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSelectionKeyDown)];
            case 10:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSelectionKeyUp)];
            case 11:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSelectionResized)];
            case 12:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleNewLocationPrompt)];
            case 13:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleOpenNewWindowShortcut)];
            case 14:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleCloneSelectedWindowShortcut)];
            case 15:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSourceClicked)];
            case 16:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleOpenExternalWindowButtonClicked)];
            case 17:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleDNDEnded)];
            case 18:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleComponentsPaneEvents)];
            case 19:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.mainWorkspaceSaga = mainWorkspaceSaga;
function openDefaultWindow() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, aerial_common2_1.watch(function (state) { return state.selectedWorkspaceId; }, function (selectedWorkspaceId, state) {
                    var workspace;
                    return __generator(this, function (_a) {
                        if (!selectedWorkspaceId)
                            return [2 /*return*/, true];
                        workspace = state_1.getSelectedWorkspace(state);
                        // yield put(openSyntheticWindowRequest(`http://localhost:8083/`, workspace.browserId));
                        // yield put(openSyntheticWindowRequest("http://browsertap.com/", workspace.browserId));
                        // yield put(openSyntheticWindowRequest("https://wordpress.com/", workspace.browserId));
                        // yield put(openSyntheticWindowRequest("http://localhost:8080/index.html", workspace.browserId));
                        return [2 /*return*/, true];
                    });
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleOpenExternalWindowButtonClicked() {
    var windowId, syntheticWindow, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take(actions_1.OPEN_EXTERNAL_WINDOW_BUTTON_CLICKED)];
            case 1:
                windowId = (_b.sent()).windowId;
                _a = aerial_browser_sandbox_1.getSyntheticWindow;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                syntheticWindow = _a.apply(void 0, [_b.sent(), windowId]);
                window.open(syntheticWindow.location, "_blank");
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}
function handleAltClickElement() {
    var event_1, state, targetRef, workspace, node, element, href, window_1, browserBounds, workspace_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 5];
                return [4 /*yield*/, effects_1.take(function (action) { return action.type === actions_1.STAGE_MOUSE_CLICKED && action.sourceEvent.altKey; })];
            case 1:
                event_1 = _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                targetRef = state_1.getStageToolMouseNodeTargetReference(state, event_1);
                workspace = state_1.getSelectedWorkspace(state);
                if (!targetRef)
                    return [3 /*break*/, 0];
                node = aerial_browser_sandbox_1.getSyntheticNodeById(state, targetRef[1]);
                if (!(node.nodeType === aerial_browser_sandbox_1.SEnvNodeTypes.ELEMENT)) return [3 /*break*/, 4];
                element = node;
                if (!(element.nodeName === "A")) return [3 /*break*/, 4];
                href = element.attributes.find(function (a) { return a.name === "href"; });
                if (!href) return [3 /*break*/, 4];
                window_1 = aerial_browser_sandbox_1.getSyntheticNodeWindow(state, node.$id);
                browserBounds = aerial_browser_sandbox_1.getSyntheticBrowserBounds(aerial_browser_sandbox_1.getSyntheticWindowBrowser(state, window_1.$id));
                workspace_1 = state_1.getSyntheticWindowWorkspace(state, window_1.$id);
                return [4 /*yield*/, openNewWindow(state, href.value, window_1, workspace_1)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [3 /*break*/, 0];
            case 5: return [2 /*return*/];
        }
    });
}
function handleMetaClickElement() {
    var event_2, state, targetRef, workspace, node;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 6];
                return [4 /*yield*/, effects_1.take(function (action) { return action.type === actions_1.STAGE_MOUSE_CLICKED && action.sourceEvent.metaKey; })];
            case 1:
                event_2 = _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                targetRef = state_1.getStageToolMouseNodeTargetReference(state, event_2);
                workspace = state_1.getSelectedWorkspace(state);
                // not items should be selected for meta clicks
                // if (workspace.selectionRefs.length) {
                //   continue;
                // }
                if (!targetRef)
                    return [3 /*break*/, 0];
                node = aerial_browser_sandbox_1.getSyntheticNodeById(state, targetRef[1]);
                if (!(node.source && node.source.uri)) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.call(utils_1.apiOpenSourceFile, node.source, state)];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                if (!node.source) {
                    console.warn("source URI does not exist on selected node.");
                }
                _a.label = 5;
            case 5: return [3 /*break*/, 0];
            case 6: return [2 /*return*/];
        }
    });
}
function handleMetaClickComponentCell() {
    var componentId, state, workspace, component;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(function (action) { return action.type === actions_1.COMPONENTS_PANE_COMPONENT_CLICKED; })];
            case 1:
                componentId = (_a.sent()).componentId;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                workspace = state_1.getSelectedWorkspace(state);
                component = state_1.getAvailableComponent(componentId, workspace);
                return [4 /*yield*/, effects_1.call(utils_1.apiOpenSourceFile, __assign({ uri: component.filePath }, component.location), state)];
            case 3:
                _a.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function openNewWindow(state, href, origin, workspace) {
    var uri, windowBounds, browserBounds;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                uri = aerial_browser_sandbox_1.getUri(href, origin.location);
                windowBounds = workspace.stage.fullScreen ? workspace.stage.fullScreen.originalWindowBounds : origin.bounds;
                browserBounds = aerial_browser_sandbox_1.getSyntheticBrowserBounds(aerial_browser_sandbox_1.getSyntheticWindowBrowser(state, origin.$id));
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.openSyntheticWindowRequest({ location: uri, bounds: {
                            left: Math.max(browserBounds.right, windowBounds.right) + WINDOW_PADDING,
                            top: 0,
                            right: undefined,
                            bottom: undefined
                        } }, workspace.browserId))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleDeleteKeyPressed() {
    var action, state, sourceEvent, workspace, _i, _a, _b, type, id;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (false) return [3 /*break*/, 9];
                return [4 /*yield*/, effects_1.take(actions_1.DELETE_SHORCUT_PRESSED)];
            case 1:
                action = (_c.sent());
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _c.sent();
                sourceEvent = event.sourceEvent;
                workspace = state_1.getSelectedWorkspace(state);
                _i = 0, _a = workspace.selectionRefs;
                _c.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                _b = _a[_i], type = _b[0], id = _b[1];
                return [4 /*yield*/, effects_1.put(aerial_common2_1.removed(id, type))];
            case 4:
                _c.sent();
                if (!(workspace.stage.fullScreen && workspace.stage.fullScreen.windowId === id)) return [3 /*break*/, 6];
                return [4 /*yield*/, effects_1.put(actions_1.fullScreenTargetDeleted())];
            case 5:
                _c.sent();
                _c.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 3];
            case 7: return [4 /*yield*/, effects_1.put(actions_1.workspaceSelectionDeleted(workspace.$id))];
            case 8:
                _c.sent();
                return [3 /*break*/, 0];
            case 9: return [2 /*return*/];
        }
    });
}
function handleSelectionMoved() {
    var _a, point, workspaceId, newPoint, state, workspace, translate, selectionBounds, _i, _b, item, itemBounds;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (false) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(actions_1.RESIZER_MOVED)];
            case 1:
                _a = (_c.sent()), point = _a.point, workspaceId = _a.workspaceId, newPoint = _a.point;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = (_c.sent());
                workspace = state_1.getWorkspaceById(state, workspaceId);
                translate = state_1.getStageTranslate(workspace.stage);
                selectionBounds = state_1.getWorkspaceSelectionBounds(state, workspace);
                _i = 0, _b = state_1.getBoundedWorkspaceSelection(state, workspace);
                _c.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                item = _b[_i];
                itemBounds = state_1.getSyntheticBrowserItemBounds(state, item);
                // skip moving window if in full screen mode
                if (workspace.stage.fullScreen && workspace.stage.fullScreen.windowId === item.$id) {
                    return [3 /*break*/, 5];
                }
                return [4 /*yield*/, effects_1.put(aerial_common2_1.moved(item.$id, item.$type, aerial_common2_1.scaleInnerBounds(itemBounds, selectionBounds, aerial_common2_1.moveBounds(selectionBounds, newPoint)), workspace.targetCSSSelectors))];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 0];
            case 7: return [2 /*return*/];
        }
    });
}
function handleDNDEnded() {
    var event_3, state, workspace, dropRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 8];
                return [4 /*yield*/, effects_1.take(actions_1.DND_ENDED)];
            case 1:
                event_3 = _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                workspace = state_1.getSelectedWorkspace(state);
                dropRef = state_1.getStageToolMouseNodeTargetReference(state, event_3);
                if (!dropRef) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.call(handleDroppedOnElement, dropRef, event_3)];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, effects_1.call(handleDroppedOnEmptySpace, event_3)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [4 /*yield*/, effects_1.put(actions_1.dndHandled())];
            case 7:
                _a.sent();
                return [3 /*break*/, 0];
            case 8: return [2 /*return*/];
        }
    });
}
function handleDroppedOnElement(ref, event) {
    return __generator(this, function (_a) {
        console.log(ref, event);
        return [2 /*return*/];
    });
}
function handleDroppedOnEmptySpace(event) {
    var _a, pageX, pageY, state, uri, workspace, mousePosition;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = event.sourceEvent, pageX = _a.pageX, pageY = _a.pageY;
                return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _b.sent();
                uri = utils_1.apiGetComponentPreviewURI(event.ref[1], state);
                workspace = state_1.getSelectedWorkspace(state);
                mousePosition = state_1.getScaledMouseStagePosition(state, event);
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.openSyntheticWindowRequest({ location: uri, bounds: __assign({}, mousePosition, { right: undefined, bottom: undefined }) }, workspace.browserId))];
            case 2:
                _b.sent();
                return [2 /*return*/];
        }
    });
}
function handleSelectionResized() {
    var _a, workspaceId, anchor, originalBounds, newBounds, sourceEvent, state, workspace, currentBounds, keepAspectRatio, keepCenter, _i, _b, item, innerBounds, scaledBounds;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (false) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(actions_1.RESIZER_PATH_MOUSE_MOVED)];
            case 1:
                _a = (_c.sent()), workspaceId = _a.workspaceId, anchor = _a.anchor, originalBounds = _a.originalBounds, newBounds = _a.newBounds, sourceEvent = _a.sourceEvent;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _c.sent();
                workspace = state_1.getWorkspaceById(state, workspaceId);
                currentBounds = state_1.getWorkspaceSelectionBounds(state, workspace);
                keepAspectRatio = sourceEvent.shiftKey;
                keepCenter = sourceEvent.altKey;
                if (keepCenter) {
                    // newBounds = keepBoundsCenter(newBounds, bounds, anchor);
                }
                if (keepAspectRatio) {
                    newBounds = aerial_common2_1.keepBoundsAspectRatio(newBounds, originalBounds, anchor, keepCenter ? { left: 0.5, top: 0.5 } : anchor);
                }
                _i = 0, _b = state_1.getBoundedWorkspaceSelection(state, workspace);
                _c.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                item = _b[_i];
                innerBounds = state_1.getSyntheticBrowserItemBounds(state, item);
                scaledBounds = aerial_common2_1.scaleInnerBounds(currentBounds, currentBounds, newBounds);
                return [4 /*yield*/, effects_1.put(aerial_common2_1.resized(item.$id, item.$type, aerial_common2_1.scaleInnerBounds(innerBounds, currentBounds, newBounds), workspace.targetCSSSelectors))];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 0];
            case 7: return [2 /*return*/];
        }
    });
}
function handleOpenNewWindowShortcut() {
    var uri, state, workspace;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(actions_1.OPEN_NEW_WINDOW_SHORTCUT_PRESSED)];
            case 1:
                _a.sent();
                uri = prompt("URL");
                if (!uri)
                    return [3 /*break*/, 0];
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                workspace = state_1.getSelectedWorkspace(state);
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.openSyntheticWindowRequest({ location: uri }, workspace.browserId))];
            case 3:
                _a.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function handleCloneSelectedWindowShortcut() {
    var state, workspace, itemRef, window_2, originalWindowBounds, clonedWindow;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 5];
                return [4 /*yield*/, effects_1.take(actions_1.CLONE_WINDOW_SHORTCUT_PRESSED)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                workspace = state_1.getSelectedWorkspace(state);
                itemRef = workspace.selectionRefs[0];
                if (!itemRef)
                    return [3 /*break*/, 0];
                window_2 = itemRef[0] === aerial_browser_sandbox_1.SYNTHETIC_WINDOW ? aerial_browser_sandbox_1.getSyntheticWindow(state, itemRef[1]) : aerial_browser_sandbox_1.getSyntheticNodeWindow(state, itemRef[1]);
                originalWindowBounds = workspace.stage.fullScreen ? workspace.stage.fullScreen.originalWindowBounds : window_2.bounds;
                return [4 /*yield*/, aerial_common2_1.request(aerial_browser_sandbox_1.openSyntheticWindowRequest({ location: window_2.location, bounds: aerial_common2_1.moveBounds(originalWindowBounds, {
                            left: originalWindowBounds.left,
                            top: originalWindowBounds.bottom + WINDOW_PADDING
                        }) }, aerial_browser_sandbox_1.getSyntheticWindowBrowser(state, window_2.$id).$id))];
            case 3: return [4 /*yield*/, _a.sent()];
            case 4:
                clonedWindow = _a.sent();
                return [3 /*break*/, 0];
            case 5: return [2 /*return*/];
        }
    });
}
function handleNewLocationPrompt() {
    var _a, workspaceId, location_1, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(actions_1.PROMPTED_NEW_WINDOW_URL)];
            case 1:
                _a = (_f.sent()), workspaceId = _a.workspaceId, location_1 = _a.location;
                _b = effects_1.put;
                _c = aerial_browser_sandbox_1.openSyntheticWindowRequest;
                _d = [{ location: location_1 }];
                _e = state_1.getWorkspaceById;
                return [4 /*yield*/, effects_1.select()];
            case 2: return [4 /*yield*/, _b.apply(void 0, [_c.apply(void 0, _d.concat([_e.apply(void 0, [_f.sent(), workspaceId]).browserId]))])];
            case 3:
                _f.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function handleSelectionKeyDown() {
    var type, state, workspace, workspaceId, bounds, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 12];
                return [4 /*yield*/, effects_1.take([actions_1.LEFT_KEY_DOWN, actions_1.RIGHT_KEY_DOWN, actions_1.UP_KEY_DOWN, actions_1.DOWN_KEY_DOWN])];
            case 1:
                type = (_b.sent()).type;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                workspace = state_1.getSelectedWorkspace(state);
                if (workspace.selectionRefs.length === 0)
                    return [3 /*break*/, 0];
                workspaceId = workspace.$id;
                bounds = state_1.getWorkspaceSelectionBounds(state, workspace);
                _a = type;
                switch (_a) {
                    case actions_1.DOWN_KEY_DOWN: return [3 /*break*/, 3];
                    case actions_1.UP_KEY_DOWN: return [3 /*break*/, 5];
                    case actions_1.LEFT_KEY_DOWN: return [3 /*break*/, 7];
                    case actions_1.RIGHT_KEY_DOWN: return [3 /*break*/, 9];
                }
                return [3 /*break*/, 11];
            case 3: return [4 /*yield*/, effects_1.put(actions_1.resizerMoved(workspaceId, { left: bounds.left, top: bounds.top + 1 }))];
            case 4:
                _b.sent();
                return [3 /*break*/, 11];
            case 5: return [4 /*yield*/, effects_1.put(actions_1.resizerMoved(workspaceId, { left: bounds.left, top: bounds.top - 1 }))];
            case 6:
                _b.sent();
                return [3 /*break*/, 11];
            case 7: return [4 /*yield*/, effects_1.put(actions_1.resizerMoved(workspaceId, { left: bounds.left - 1, top: bounds.top }))];
            case 8:
                _b.sent();
                return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, effects_1.put(actions_1.resizerMoved(workspaceId, { left: bounds.left + 1, top: bounds.top }))];
            case 10:
                _b.sent();
                return [3 /*break*/, 11];
            case 11: return [3 /*break*/, 0];
            case 12: return [2 /*return*/];
        }
    });
}
function handleSelectionKeyUp() {
    var state, workspace;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take([actions_1.LEFT_KEY_UP, actions_1.RIGHT_KEY_UP, actions_1.UP_KEY_UP, actions_1.DOWN_KEY_UP])];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                workspace = state_1.getSelectedWorkspace(state);
                return [4 /*yield*/, effects_1.put(actions_1.resizerStoppedMoving(workspace.$id, null))];
            case 3:
                _a.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
        }
    });
}
function handleSourceClicked() {
    var _a, itemId, windowId, state, item;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 5];
                return [4 /*yield*/, effects_1.take(actions_1.SOURCE_CLICKED)];
            case 1:
                _a = (_b.sent()), itemId = _a.itemId, windowId = _a.windowId;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                item = aerial_browser_sandbox_1.getSyntheticNodeById(state, itemId);
                if (!(item.source && item.source.uri)) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.call(utils_1.apiOpenSourceFile, item.source, state)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4: return [3 /*break*/, 0];
            case 5: return [2 /*return*/];
        }
    });
}
function handleSelectionStoppedMoving() {
    var _a, point, workspaceId, state, workspace, _i, _b, item, bounds;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (false) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(actions_1.RESIZER_STOPPED_MOVING)];
            case 1:
                _a = (_c.sent()), point = _a.point, workspaceId = _a.workspaceId;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = (_c.sent());
                workspace = state_1.getWorkspaceById(state, workspaceId);
                _i = 0, _b = state_1.getBoundedWorkspaceSelection(state, workspace);
                _c.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                item = _b[_i];
                // skip moving window if in full screen mode
                if (workspace.stage.fullScreen && workspace.stage.fullScreen.windowId === item.$id) {
                    return [3 /*break*/, 5];
                }
                bounds = state_1.getSyntheticBrowserItemBounds(state, item);
                return [4 /*yield*/, effects_1.put(aerial_common2_1.stoppedMoving(item.$id, item.$type, workspace.targetCSSSelectors))];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 0];
            case 7: return [2 /*return*/];
        }
    });
}
function handleNextWindowPressed() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take(actions_1.NEXT_WINDOW_SHORTCUT_PRESSED)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.call(shiftSelectedWindow, 1)];
            case 2:
                _a.sent();
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}
function handlePrevWindowPressed() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take(actions_1.PREV_WINDOW_SHORTCUT_PRESSED)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.call(shiftSelectedWindow, -1)];
            case 2:
                _a.sent();
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}
function shiftSelectedWindow(indexDelta) {
    var state, window, browser, index, change, newIndex;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                window = state_1.getWorkspaceLastSelectionOwnerWindow(state, state.selectedWorkspaceId) || state_1.getWorkspaceWindow(state, state.selectedWorkspaceId);
                if (!window) {
                    return [2 /*return*/];
                }
                browser = aerial_browser_sandbox_1.getSyntheticWindowBrowser(state, window.$id);
                index = browser.windows.indexOf(window);
                change = index + indexDelta;
                newIndex = change < 0 ? browser.windows.length - 1 : change >= browser.windows.length ? 0 : change;
                return [4 /*yield*/, effects_1.put(actions_1.windowSelectionShifted(browser.windows[newIndex].$id))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleComponentsPaneEvents() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(handleComponentsPaneAddClicked)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.spawn(handleDeleteComponentsPane)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleComponentsPaneAddClicked() {
    var name_1, state, workspace, componentId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 5];
                return [4 /*yield*/, effects_1.take(actions_1.COMPONENTS_PANE_ADD_COMPONENT_CLICKED)];
            case 1:
                _a.sent();
                name_1 = prompt("Unique component name");
                if (!name_1) {
                    return [3 /*break*/, 0];
                }
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                workspace = state_1.getWorkspaceById(state, state.selectedWorkspaceId);
                return [4 /*yield*/, effects_1.call(utils_1.apiCreateComponent, name_1, state)];
            case 3:
                componentId = (_a.sent()).componentId;
                return [4 /*yield*/, effects_1.put(aerial_browser_sandbox_1.openSyntheticWindowRequest({ location: utils_1.apiGetComponentPreviewURI(componentId, state) }, workspace.browserId))];
            case 4:
                _a.sent();
                return [3 /*break*/, 0];
            case 5: return [2 /*return*/];
        }
    });
}
function handleDeleteComponentsPane() {
    var state, workspace, componentRefs, _i, componentRefs_1, _a, type, componentId, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(actions_1.DELETE_SHORCUT_PRESSED)];
            case 1:
                _b.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                workspace = state_1.getWorkspaceById(state, state.selectedWorkspaceId);
                componentRefs = workspace.selectionRefs.filter(function (ref) { return ref[0] === state_1.AVAILABLE_COMPONENT; });
                if (!(componentRefs.length && confirm("Are you sure you want to delete these components?"))) return [3 /*break*/, 6];
                _i = 0, componentRefs_1 = componentRefs;
                _b.label = 3;
            case 3:
                if (!(_i < componentRefs_1.length)) return [3 /*break*/, 6];
                _a = componentRefs_1[_i], type = _a[0], componentId = _a[1];
                return [4 /*yield*/, effects_1.call(utils_1.apiDeleteComponent, componentId, state)];
            case 4:
                result = _b.sent();
                if (result.message) {
                    alert(result.message);
                }
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 0];
            case 7: return [2 /*return*/];
        }
    });
}


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/workspace.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/workspace.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/state/dnd.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/react.js");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
exports.withDragSource = function (handler) { return function (BaseComponent) {
    var DraggableComponentClass = /** @class */ (function (_super) {
        __extends(DraggableComponentClass, _super);
        function DraggableComponentClass() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DraggableComponentClass.prototype.render = function () {
            var _this = this;
            return React.createElement(BaseComponent, __assign({ connectDragSource: function (element) {
                    return React.cloneElement(element, {
                        draggable: true,
                        onDragStart: function (event) { return _this.props.dispatch(actions_1.dndStarted(handler.getData(_this.props), event)); },
                        onDragEnd: function (event) { return _this.props.dispatch(actions_1.dndEnded(handler.getData(_this.props), event)); },
                    });
                } }, this.props));
        };
        return DraggableComponentClass;
    }(React.Component));
    return DraggableComponentClass;
}; };


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/state/dnd.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/state/dnd.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/state/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var shortcuts_1 = __webpack_require__("./src/front-end/state/shortcuts.ts");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var aerial_browser_sandbox_1 = __webpack_require__("../aerial-browser-sandbox/index.js");
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
/**
 * Types
 */
exports.WORKSPACE = "WORKSPACE";
exports.APPLICATION_STATE = "APPLICATION_STATE";
exports.LIBRARY_COMPONENT = "LIBRARY_COMPONENT";
/**
 * Utilities
 */
exports.getSyntheticWindowWorkspace = function (root, windowId) { return exports.getSyntheticBrowserWorkspace(root, aerial_browser_sandbox_1.getSyntheticWindowBrowser(root, windowId).$id); };
exports.showWorkspaceTextEditor = function (root, workspaceId) {
    var workspace = exports.getWorkspaceById(root, workspaceId);
    return exports.updateWorkspaceStage(root, workspaceId, {
        showTextEditor: true
    });
};
exports.updateWorkspaceStage = function (root, workspaceId, stageProperties) {
    var workspace = exports.getWorkspaceById(root, workspaceId);
    return exports.updateWorkspace(root, workspaceId, {
        stage: __assign({}, workspace.stage, stageProperties)
    });
};
exports.updateWorkspaceTextEditor = function (root, workspaceId, textEditorProperties) {
    var workspace = exports.getWorkspaceById(root, workspaceId);
    return exports.updateWorkspace(root, workspaceId, {
        textEditor: __assign({}, workspace.textEditor, textEditorProperties)
    });
};
exports.getSyntheticBrowserWorkspace = aerial_common2_1.weakMemo(function (root, browserId) {
    return root.workspaces.find(function (workspace) { return workspace.browserId === browserId; });
});
exports.addWorkspaceSelection = function (root, workspaceId) {
    var selection = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        selection[_i - 2] = arguments[_i];
    }
    var workspace = exports.getWorkspaceById(root, workspaceId);
    return exports.setWorkspaceSelection.apply(void 0, [root, workspaceId].concat(workspace.selectionRefs, selection));
};
exports.removeWorkspaceSelection = function (root, workspaceId) {
    var selection = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        selection[_i - 2] = arguments[_i];
    }
    var workspace = exports.getWorkspaceById(root, workspaceId);
    return exports.setWorkspaceSelection.apply(void 0, [root, workspaceId].concat(workspace.selectionRefs.filter(function (type, id) { return !selection.find(function (type2, id2) { return id === id2; }); })));
};
/**
 * Utility to ensure that workspace selection items are within the same window object. This prevents users from selecting
 * the _same_ element across different window objects.
 */
var deselectOutOfScopeWorkpaceSelection = function (root, workspaceId, ref) {
    if (ref && ref[0] === aerial_browser_sandbox_1.SYNTHETIC_WINDOW) {
        return root;
    }
    var window = aerial_browser_sandbox_1.getSyntheticNodeWindow(root, ref[1]);
    var workspace = exports.getWorkspaceById(root, workspaceId);
    var updatedSelection = [];
    for (var _i = 0, _a = workspace.selectionRefs; _i < _a.length; _i++) {
        var selection = _a[_i];
        if (aerial_browser_sandbox_1.syntheticWindowContainsNode(window, selection[1])) {
            updatedSelection.push(selection);
        }
    }
    return exports.setWorkspaceSelection.apply(void 0, [root, workspaceId].concat(updatedSelection));
};
/**
 * Prevents nodes that have a parent/child relationship from being selected.
 */
var deselectRelatedWorkspaceSelection = function (root, workspaceId, ref) {
    if (ref && ref[0] === aerial_browser_sandbox_1.SYNTHETIC_WINDOW) {
        return root;
    }
    var workspace = exports.getWorkspaceById(root, workspaceId);
    var window = aerial_browser_sandbox_1.getSyntheticNodeWindow(root, ref[1]);
    var updatedSelection = [];
    for (var _i = 0, _a = workspace.selectionRefs; _i < _a.length; _i++) {
        var selection = _a[_i];
        if (!aerial_browser_sandbox_1.syntheticNodeIsRelative(window, ref[1], selection[1])) {
            updatedSelection.push(selection);
        }
    }
    return exports.setWorkspaceSelection.apply(void 0, [root, workspaceId].concat(updatedSelection));
};
// deselect unrelated refs, ensures that selection is not a child of existing one. etc.
var cleanupWorkspaceSelection = function (state, workspaceId) {
    var workspace = exports.getWorkspaceById(state, workspaceId);
    if (workspace.selectionRefs.length > 0) {
        // use _last_ selected element since it's likely the one that was just clicked. Don't want to prevent the 
        // user from doing so
        state = deselectOutOfScopeWorkpaceSelection(state, workspaceId, workspace.selectionRefs[workspace.selectionRefs.length - 1]);
        state = deselectRelatedWorkspaceSelection(state, workspaceId, workspace.selectionRefs[workspace.selectionRefs.length - 1]);
    }
    return state;
};
exports.toggleWorkspaceSelection = function (root, workspaceId) {
    var selection = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        selection[_i - 2] = arguments[_i];
    }
    var workspace = exports.getWorkspaceById(root, workspaceId);
    var newSelection = [];
    var oldSelectionIds = workspace.selectionRefs.map(function (_a) {
        var type = _a[0], id = _a[1];
        return id;
    });
    var toggleSelectionIds = selection.map(function (_a) {
        var type = _a[0], id = _a[1];
        return id;
    });
    for (var _a = 0, _b = workspace.selectionRefs; _a < _b.length; _a++) {
        var ref = _b[_a];
        if (toggleSelectionIds.indexOf(ref[1]) === -1) {
            newSelection.push(ref);
        }
    }
    for (var _c = 0, selection_1 = selection; _c < selection_1.length; _c++) {
        var ref = selection_1[_c];
        if (oldSelectionIds.indexOf(ref[1]) === -1) {
            newSelection.push(ref);
        }
    }
    return cleanupWorkspaceSelection(exports.setWorkspaceSelection.apply(void 0, [root, workspaceId].concat(newSelection)), workspaceId);
};
exports.clearWorkspaceSelection = function (root, workspaceId) {
    return exports.updateWorkspaceStage(exports.updateWorkspace(root, workspaceId, {
        selectionRefs: [],
        hoveringRefs: []
    }), workspaceId, {
        secondarySelection: false
    });
};
exports.setWorkspaceSelection = function (root, workspaceId) {
    var selectionIds = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        selectionIds[_i - 2] = arguments[_i];
    }
    return exports.updateWorkspace(root, workspaceId, {
        selectionRefs: lodash_1.uniq(selectionIds.slice())
    });
};
exports.updateWorkspace = function (root, workspaceId, newProperties) {
    var workspace = exports.getWorkspaceById(root, workspaceId);
    return __assign({}, root, { workspaces: aerial_common2_1.arrayReplaceIndex(root.workspaces, root.workspaces.indexOf(workspace), __assign({}, workspace, newProperties)) });
};
exports.createTargetSelector = function (uri, value) { return ({
    uri: uri,
    value: value
}); };
exports.toggleWorkspaceTargetCSSSelector = function (root, workspaceId, uri, selectorText) {
    var workspace = exports.getWorkspaceById(root, workspaceId);
    var cssSelectors = (workspace.targetCSSSelectors || []);
    var index = cssSelectors.findIndex(function (targetSelector) {
        return targetSelector.uri === uri && targetSelector.value == selectorText;
    });
    return exports.updateWorkspace(root, workspaceId, {
        targetCSSSelectors: index === -1 ? cssSelectors.concat([exports.createTargetSelector(uri, selectorText)]) : aerial_common2_1.arraySplice(cssSelectors, index, 1)
    });
};
exports.addWorkspace = function (root, workspace) {
    return __assign({}, root, { workspaces: root.workspaces.concat([workspace]) });
};
exports.filterMatchingTargetSelectors = aerial_common2_1.weakMemo(function (targetCSSSelectors, element, window) { return filterApplicableTargetSelectors(targetCSSSelectors, window).filter(function (rule) { return aerial_browser_sandbox_1.elementMatches(rule.value, element, window); }); });
var filterApplicableTargetSelectors = aerial_common2_1.weakMemo(function (selectors, window) {
    var map = {};
    for (var _i = 0, selectors_1 = selectors; _i < selectors_1.length; _i++) {
        var selector = selectors_1[_i];
        map[selector.uri + selector.value] = selector;
    }
    var rules = [];
    var children = aerial_browser_sandbox_1.getSyntheticWindowChildStructs(window);
    for (var $id in children) {
        var child = children[$id];
        if (child.$type === aerial_browser_sandbox_1.SYNTHETIC_CSS_STYLE_RULE && child.source && map[child.source.uri + child.selectorText]) {
            rules.push(map[child.source.uri + child.selectorText]);
        }
    }
    return lodash_1.uniq(rules);
});
var getSelectorAffectedWindows = aerial_common2_1.weakMemo(function (targetCSSSelectors, browser) {
    var affectedWindows = [];
    for (var _i = 0, _a = browser.windows; _i < _a.length; _i++) {
        var window_1 = _a[_i];
        if (filterApplicableTargetSelectors(targetCSSSelectors, window_1).length) {
            affectedWindows.push(window_1);
        }
    }
    return affectedWindows;
});
exports.getObjectsWithSameSource = aerial_common2_1.weakMemo(function (itemId, browser, limitToElementWindow) {
    var target = aerial_browser_sandbox_1.getSyntheticNodeById(browser, itemId);
    var objects = {};
    var objectsWithSameSource = [];
    var windows = limitToElementWindow ? [aerial_browser_sandbox_1.getSyntheticNodeWindow(browser, itemId)] : browser.windows;
    for (var _i = 0, windows_1 = windows; _i < windows_1.length; _i++) {
        var window_2 = windows_1[_i];
        var windowsObjects = aerial_browser_sandbox_1.getSyntheticWindowChildStructs(window_2);
        for (var $id in windowsObjects) {
            var child = windowsObjects[$id];
            if (child.source && target.source && aerial_common2_1.expressionLocationEquals(child.source, target.source)) {
                objectsWithSameSource.push(child);
            }
        }
    }
    return objectsWithSameSource;
});
exports.getSelectorAffectedElements = aerial_common2_1.weakMemo(function (elementId, targetCSSSelectors, browser, limitToElementWindow) {
    var affectedElements = [];
    if (!targetCSSSelectors.length) {
        affectedElements.push.apply(affectedElements, exports.getObjectsWithSameSource(elementId, browser, limitToElementWindow));
    }
    else {
        var affectedWindows = targetCSSSelectors.length ? getSelectorAffectedWindows(targetCSSSelectors, browser) : browser.windows;
        if (limitToElementWindow) {
            affectedWindows = [aerial_browser_sandbox_1.getSyntheticNodeWindow(browser, elementId)];
        }
        for (var _i = 0, affectedWindows_1 = affectedWindows; _i < affectedWindows_1.length; _i++) {
            var window_3 = affectedWindows_1[_i];
            for (var _a = 0, targetCSSSelectors_1 = targetCSSSelectors; _a < targetCSSSelectors_1.length; _a++) {
                var selectorText = targetCSSSelectors_1[_a].value;
                affectedElements.push.apply(affectedElements, aerial_browser_sandbox_1.getMatchingElements(window_3, selectorText));
            }
        }
    }
    return lodash_1.uniq(affectedElements);
});
exports.getFrontEndItemByReference = function (root, ref) {
    return aerial_browser_sandbox_1.getSyntheticBrowserStoreItemByReference(root, ref);
};
exports.getSyntheticNodeWorkspace = aerial_common2_1.weakMemo(function (root, nodeId) {
    return exports.getSyntheticWindowWorkspace(root, aerial_browser_sandbox_1.getSyntheticNodeWindow(root, nodeId).$id);
});
exports.getBoundedWorkspaceSelection = aerial_common2_1.weakMemo(function (state, workspace) { return workspace.selectionRefs.map(function (ref) { return exports.getFrontEndItemByReference(state, ref); }).filter(function (item) { return aerial_browser_sandbox_1.getSyntheticBrowserItemBounds(state, item); }); });
exports.getWorkspaceSelectionBounds = aerial_common2_1.weakMemo(function (state, workspace) { return aerial_common2_1.mergeBounds.apply(void 0, exports.getBoundedWorkspaceSelection(state, workspace).map(function (boxed) { return aerial_browser_sandbox_1.getSyntheticBrowserItemBounds(state, boxed); })); });
exports.getStageZoom = function (stage) { return exports.getStageTranslate(stage).zoom; };
exports.getStageTranslate = function (stage) { return stage.translate; };
exports.getWorkspaceById = function (state, id) { return state.workspaces.find(function (workspace) { return workspace.$id === id; }); };
exports.getSelectedWorkspace = function (state) { return state.selectedWorkspaceId && exports.getWorkspaceById(state, state.selectedWorkspaceId); };
exports.getAvailableComponent = function (componentId, workspace) { return workspace.availableComponents.find(function (component) { return component.$id === componentId; }); };
exports.getWorkspaceLastSelectionOwnerWindow = function (state, workspaceId) {
    if (workspaceId === void 0) { workspaceId = state.selectedWorkspaceId; }
    var workspace = exports.getWorkspaceById(state, workspaceId);
    if (workspace.selectionRefs.length === 0) {
        return null;
    }
    var lastSelectionRef = workspace.selectionRefs[workspace.selectionRefs.length - 1];
    return exports.getWorkspaceLastSelectionOwnerWindow2(workspace, aerial_browser_sandbox_1.getSyntheticBrowser(state, workspace.browserId));
};
exports.getWorkspaceLastSelectionOwnerWindow2 = function (workspace, browser) {
    if (workspace.selectionRefs.length === 0) {
        return null;
    }
    var lastSelectionRef = workspace.selectionRefs[workspace.selectionRefs.length - 1];
    return lastSelectionRef[0] === aerial_browser_sandbox_1.SYNTHETIC_WINDOW ? aerial_browser_sandbox_1.getSyntheticWindow(browser, lastSelectionRef[1]) : aerial_browser_sandbox_1.getSyntheticNodeWindow(browser, lastSelectionRef[1]);
};
exports.getWorkspaceWindow = function (state, workspaceId, index) {
    if (workspaceId === void 0) { workspaceId = state.selectedWorkspaceId; }
    var browser = aerial_browser_sandbox_1.getSyntheticBrowser(state, exports.getWorkspaceById(state, workspaceId).browserId);
    return browser.windows[index == null ? browser.windows.length - 1 : 0];
};
/**
 * Factories
 */
exports.createWorkspace = aerial_common2_1.createStructFactory(exports.WORKSPACE, {
    // null to denote style attribute
    targetCSSSelectors: [],
    stage: {
        panning: false,
        secondarySelection: false,
        translate: { left: 0, top: 0, zoom: 1 },
        showTextEditor: false,
        showLeftGutter: true,
        showRightGutter: true,
    },
    textEditor: {},
    selectionRefs: [],
    hoveringRefs: [],
    draggingRefs: [],
    library: [],
    availableComponents: []
});
exports.createApplicationState = aerial_common2_1.createStructFactory(exports.APPLICATION_STATE, {
    workspaces: [],
    shortcuts: [
        shortcuts_1.createKeyboardShortcut("backspace", actions_1.deleteShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("meta+b", actions_1.toggleLeftGutterPressed()),
        shortcuts_1.createKeyboardShortcut("ctrl+b", actions_1.toggleLeftGutterPressed()),
        shortcuts_1.createKeyboardShortcut("meta+/", actions_1.toggleRightGutterPressed()),
        shortcuts_1.createKeyboardShortcut("ctrl+/", actions_1.toggleRightGutterPressed()),
        shortcuts_1.createKeyboardShortcut("meta+e", actions_1.toggleTextEditorPressed()),
        shortcuts_1.createKeyboardShortcut("meta+f", actions_1.fullScreenShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("ctrl+f", actions_1.fullScreenShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("meta+=", actions_1.zoomInShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("meta+-", actions_1.zoomOutShortcutPressed()),
        // ignore for now since project is scoped to Paperclip only. Windows
        // should be added in via the components pane.
        // createKeyboardShortcut("meta+t", openNewWindowShortcutPressed()),
        // createKeyboardShortcut("ctrl+t", openNewWindowShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("meta+enter", actions_1.cloneWindowShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("escape", actions_1.escapeShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("ctrl+shift+]", actions_1.nextWindowShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("ctrl+shift+[", actions_1.prevWindowShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("ctrl+meta+t", actions_1.toggleToolsShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("up", { type: actions_1.UP_KEY_DOWN }, { keyup: false }),
        shortcuts_1.createKeyboardShortcut("up", { type: actions_1.UP_KEY_UP }, { keyup: true }),
        shortcuts_1.createKeyboardShortcut("down", { type: actions_1.DOWN_KEY_DOWN }, { keyup: false }),
        shortcuts_1.createKeyboardShortcut("down", { type: actions_1.DOWN_KEY_UP }, { keyup: true }),
        shortcuts_1.createKeyboardShortcut("left", { type: actions_1.LEFT_KEY_DOWN }, { keyup: false }),
        shortcuts_1.createKeyboardShortcut("left", { type: actions_1.LEFT_KEY_UP }, { keyup: true }),
        shortcuts_1.createKeyboardShortcut("right", { type: actions_1.RIGHT_KEY_DOWN }, { keyup: false }),
        shortcuts_1.createKeyboardShortcut("right", { type: actions_1.RIGHT_KEY_UP }, { keyup: true }),
    ],
    browserStore: aerial_browser_sandbox_1.createSyntheticBrowserStore()
});
exports.selectWorkspace = function (state, selectedWorkspaceId) { return (__assign({}, state, { selectedWorkspaceId: selectedWorkspaceId })); };
exports.getScaledMouseStagePosition = function (state, event) {
    var _a = event.sourceEvent, pageX = _a.pageX, pageY = _a.pageY, nativeEvent = _a.nativeEvent;
    var workspace = exports.getSelectedWorkspace(state);
    var stage = workspace.stage;
    var translate = exports.getStageTranslate(stage);
    var scaledPageX = ((pageX - translate.left) / translate.zoom);
    var scaledPageY = ((pageY - translate.top) / translate.zoom);
    return { left: scaledPageX, top: scaledPageY };
};
exports.getStageToolMouseNodeTargetReference = function (state, event) {
    var workspace = exports.getSelectedWorkspace(state);
    var stage = workspace.stage;
    var translate = exports.getStageTranslate(stage);
    var _a = exports.getScaledMouseStagePosition(state, event), scaledPageX = _a.left, scaledPageY = _a.top;
    var browser = aerial_browser_sandbox_1.getSyntheticBrowser(state, workspace.browserId);
    var window = stage.fullScreen ? aerial_browser_sandbox_1.getSyntheticWindow(state, stage.fullScreen.windowId) : browser.windows.find(function (window) { return (aerial_common2_1.pointIntersectsBounds({ left: scaledPageX, top: scaledPageY }, window.bounds)); });
    if (!window)
        return null;
    var mouseX = scaledPageX - window.bounds.left;
    var mouseY = scaledPageY - window.bounds.top;
    var allComputedBounds = window.allComputedBounds;
    var intersectingBounds = [];
    var intersectingBoundsMap = new Map();
    for (var $id in allComputedBounds) {
        var bounds = allComputedBounds[$id];
        if (aerial_common2_1.pointIntersectsBounds({ left: mouseX, top: mouseY }, bounds)) {
            intersectingBounds.push(bounds);
            intersectingBoundsMap.set(bounds, $id);
        }
    }
    if (!intersectingBounds.length)
        return null;
    var smallestBounds = aerial_common2_1.getSmallestBounds.apply(void 0, intersectingBounds);
    return [aerial_browser_sandbox_1.SYNTHETIC_ELEMENT, intersectingBoundsMap.get(smallestBounds)];
};
exports.serializeApplicationState = function (_a) {
    var workspaces = _a.workspaces, selectedWorkspaceId = _a.selectedWorkspaceId, browserStore = _a.browserStore;
    return ({
        workspaces: workspaces.map(exports.serializeWorkspace),
        selectedWorkspaceId: selectedWorkspaceId,
        browserStore: aerial_common2_1.serialize(browserStore)
    });
};
exports.serializeWorkspace = function (workspace) { return ({
    $id: workspace.$id,
    $type: workspace.$type,
    targetCSSSelectors: workspace.targetCSSSelectors,
    selectionRefs: [],
    browserId: workspace.browserId,
    stage: serializeStage(workspace.stage),
    textEditor: workspace.textEditor,
    library: [],
    availableComponents: []
}); };
var serializeStage = function (_a) {
    var showTextEditor = _a.showTextEditor, showRightGutter = _a.showRightGutter, showLeftGutter = _a.showLeftGutter, showTools = _a.showTools, translate = _a.translate, fullScreen = _a.fullScreen;
    return ({
        panning: false,
        translate: translate,
        fullScreen: fullScreen,
        showTextEditor: showTextEditor,
        showRightGutter: showRightGutter,
        showLeftGutter: showLeftGutter,
        showTools: true
    });
};
__export(__webpack_require__("./src/front-end/state/shortcuts.ts"));
__export(__webpack_require__("../aerial-browser-sandbox/src/state/index.ts"));
__export(__webpack_require__("./src/front-end/state/api.ts"));
__export(__webpack_require__("./src/front-end/state/dnd.ts"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/state/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/state/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ })

})