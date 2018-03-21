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
exports.ARTBOARD_PANE_ROW_CLICKED = "ARTBOARD_PANE_ROW_CLICKED";
exports.PROMPTED_NEW_WINDOW_URL = "PROMPTED_NEW_WINDOW_URL";
exports.KEYBOARD_SHORTCUT_ADDED = "KEYBOARD_SHORTCUT_ADDED";
exports.DELETE_SHORCUT_PRESSED = "DELETE_SHORCUT_PRESSED";
exports.FULL_SCREEN_SHORTCUT_PRESSED = "FULL_SCREEN_SHORTCUT_PRESSED";
exports.WINDOW_RESIZED = "WINDOW_RESIZED";
exports.EMPTY_WINDOWS_URL_ADDED = "EMPTY_WINDOWS_URL_ADDED";
exports.ZOOM_IN_SHORTCUT_PRESSED = "ZOOM_IN_SHORTCUT_PRESSED";
exports.ZOOM_OUT_SHORTCUT_PRESSED = "ZOOM_OUT_SHORTCUT_PRESSED";
exports.OPEN_NEW_WINDOW_SHORTCUT_PRESSED = "OPEN_NEW_WINDOW_SHORTCUT_PRESSED";
exports.ARTBOARD_SELECTION_SHIFTED = "ARTBOARD_SELECTION_SHIFTED";
exports.CLONE_WINDOW_SHORTCUT_PRESSED = "CLONE_WINDOW_SHORTCUT_PRESSED";
exports.ESCAPE_SHORTCUT_PRESSED = "ESCAPE_SHORTCUT_PRESSED";
exports.NEXT_ARTBOARD_SHORTCUT_PRESSED = "NEXT_ARTBOARD_SHORTCUT_PRESSED";
exports.PREV_ARTBOARD_SHORTCUT_PRESSED = "PREV_ARTBOARD_SHORTCUT_PRESSED";
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
exports.OPEN_ARTBOARDS_REQUESTED = "OPEN_ARTBOARDS_REQUESTED";
exports.FILE_REMOVED = "FILE_REMOVED";
exports.COMPONENT_SCREENSHOT_SAVED = "COMPONENT_SCREENSHOT_SAVED";
exports.COMPONENTS_PANE_ADD_COMPONENT_CLICKED = "COMPONENTS_PANE_ADD_COMPONENT_CLICKED";
exports.COMPONENTS_PANE_COMPONENT_CLICKED = "COMPONENTS_PANE_COMPONENT_CLICKED";
exports.ARTBOARD_MOUNTED = "ARTBOARD_MOUNTED";
exports.ARTBOARD_DOM_INFO_COMPUTED = "ARTBOARD_DOM_INFO_COMPUTED";
exports.BREADCRUMB_ITEM_CLICKED = "BREADCRUMB_ITEM_CLICKED";
exports.BREADCRUMB_ITEM_MOUSE_ENTER = "BREADCRUMB_ITEM_MOUSE_ENTER";
exports.BREADCRUMB_ITEM_MOUSE_LEAVE = "BREADCRUMB_ITEM_MOUSE_LEAVE";
exports.FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED = "FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED";
exports.STAGE_MOUSE_MOVED = "STAGE_MOUSE_MOVED";
exports.STAGE_MOUSE_CLICKED = "STAGE_MOUSE_CLICKED";
exports.VISUAL_EDITOR_WHEEL = "VISUAL_EDITOR_WHEEL";
exports.STAGE_TOOL_ARTBOARD_TITLE_CLICKED = "STAGE_TOOL_ARTBOARD_TITLE_CLICKED";
exports.ARTBOARD_LOADED = "ARTBOARD_LOADED";
exports.ARTBOARD_DIFFED = "ARTBOARD_DIFFED";
exports.ARTBOARD_SCROLL = "ARTBOARD_SCROLL";
exports.ARTBOARD_RENDERED = "ARTBOARD_RENDERED";
exports.ARTBOARD_CREATED = "ARTBOARD_CREATED";
exports.DOWN_KEY_DOWN = "DOWN_KEY_DOWN";
exports.DOWN_KEY_UP = "DOWN_KEY_UP";
exports.UP_KEY_DOWN = "UP_KEY_DOWN";
exports.UP_KEY_UP = "UP_KEY_UP";
exports.LEFT_KEY_DOWN = "LEFT_KEY_DOWN";
exports.STAGE_RESIZED = "STAGE_RESIZED";
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
exports.ARTBOARD_FOCUSED = "ARTBOARD_FOCUSED";
exports.CSS_DECLARATION_CREATED = "CSS_DECLARATION_CREATED";
exports.CSS_DECLARATION_TITLE_MOUSE_ENTER = "CSS_DECLARATION_TITLE_MOUSE_ENTER";
exports.SOURCE_CLICKED = "SOURCE_CLICKED";
exports.CSS_DECLARATION_TITLE_MOUSE_LEAVE = "CSS_DECLARATION_TITLE_MOUSE_LEAVE";
exports.TOGGLE_TARGET_CSS_TARGET_SELECTOR_CLICKED = "TOGGLE_TARGET_CSS_TARGET_SELECTOR_CLICKED";
exports.API_COMPONENTS_LOADED = "API_COMPONENTS_LOADED";
exports.DND_STARTED = "DND_STARTED";
exports.DND_ENDED = "DND_ENDED";
exports.DND_HANDLED = "DND_HANDLED";
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
exports.stageToolArtboardTitleClicked = function (artboardId, sourceEvent) { return ({ type: exports.STAGE_TOOL_ARTBOARD_TITLE_CLICKED, artboardId: artboardId, sourceEvent: sourceEvent }); };
exports.stageToolWindowKeyDown = function (artboardId, sourceEvent) { return ({ type: exports.STAGE_TOOL_WINDOW_KEY_DOWN, artboardId: artboardId, sourceEvent: sourceEvent }); };
exports.openExternalWindowButtonClicked = function (artboardId, sourceEvent) { return ({ type: exports.OPEN_EXTERNAL_WINDOW_BUTTON_CLICKED, artboardId: artboardId, sourceEvent: sourceEvent }); };
exports.stageToolWindowBackgroundClicked = function (sourceEvent) { return ({ type: exports.STAGE_TOOL_WINDOW_BACKGROUND_CLICKED, sourceEvent: sourceEvent }); };
// TODO - possible include CSS url, or artboardId
exports.toggleCSSTargetSelectorClicked = function (itemId, artboardId) { return ({
    type: exports.TOGGLE_TARGET_CSS_TARGET_SELECTOR_CLICKED,
    artboardId: artboardId,
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
exports.artboardMounted = function (artboardId) { return ({
    type: exports.ARTBOARD_MOUNTED,
    artboardId: artboardId
}); };
exports.artboardDOMComputedInfo = function (artboardId, computedInfo) { return ({
    artboardId: artboardId,
    computedInfo: computedInfo,
    type: exports.ARTBOARD_DOM_INFO_COMPUTED,
}); };
exports.cssDeclarationNameChanged = function (name, value, declarationId, artboardId) { return ({
    declarationId: declarationId,
    artboardId: artboardId,
    name: name,
    value: value,
    type: exports.CSS_DECLARATION_NAME_CHANGED
}); };
exports.cssDeclarationValueChanged = function (name, value, declarationId, artboardId) { return ({
    declarationId: declarationId,
    artboardId: artboardId,
    name: name,
    value: value,
    type: exports.CSS_DECLARATION_VALUE_CHANGED
}); };
exports.cssDeclarationCreated = function (name, value, declarationId, artboardId) { return ({
    artboardId: artboardId,
    name: name,
    value: value,
    declarationId: declarationId,
    type: exports.CSS_DECLARATION_CREATED
}); };
exports.artboardLoaded = function (artboardId, dependencyUris, document, mount) { return ({
    type: exports.ARTBOARD_LOADED,
    artboardId: artboardId,
    document: document,
    dependencyUris: dependencyUris,
    mount: mount
}); };
exports.artboardDiffed = function (artboardId, diffs) { return ({
    type: exports.ARTBOARD_DIFFED,
    artboardId: artboardId,
    diffs: diffs
}); };
exports.windowResized = function (width, height) { return ({
    type: exports.WINDOW_RESIZED,
    width: width,
    height: height
}); };
exports.stageResized = function (width, height) { return ({
    type: exports.STAGE_RESIZED,
    width: width,
    height: height
}); };
exports.artboardRendered = function (artboardId, nativeNodeMap) { return ({
    type: exports.ARTBOARD_RENDERED,
    artboardId: artboardId,
    nativeNodeMap: nativeNodeMap
}); };
exports.artboardCreated = function (artboard) { return ({
    type: exports.ARTBOARD_CREATED,
    artboard: artboard,
}); };
exports.cssDeclarationTitleMouseEnter = function (ruleId, artboardId) { return ({
    artboardId: artboardId,
    ruleId: ruleId,
    type: exports.CSS_DECLARATION_TITLE_MOUSE_ENTER
}); };
exports.sourceClicked = function (itemId, artboardId) { return ({
    artboardId: artboardId,
    itemId: itemId,
    type: exports.SOURCE_CLICKED
}); };
exports.cssDeclarationTitleMouseLeave = function (ruleId, artboardId) { return ({
    artboardId: artboardId,
    ruleId: ruleId,
    type: exports.CSS_DECLARATION_TITLE_MOUSE_LEAVE
}); };
exports.resizerStoppedMoving = function (workspaceId, point) { return ({
    workspaceId: workspaceId,
    point: point,
    type: exports.RESIZER_STOPPED_MOVING,
}); };
exports.breadcrumbItemClicked = function (nodeId, artboardId) { return ({
    nodeId: nodeId,
    artboardId: artboardId,
    type: exports.BREADCRUMB_ITEM_CLICKED
}); };
exports.breadcrumbItemMouseEnter = function (nodeId, artboardId) { return ({
    nodeId: nodeId,
    artboardId: artboardId,
    type: exports.BREADCRUMB_ITEM_MOUSE_ENTER
}); };
exports.breadcrumbItemMouseLeave = function (nodeId, artboardId) { return ({
    nodeId: nodeId,
    artboardId: artboardId,
    type: exports.BREADCRUMB_ITEM_MOUSE_LEAVE
}); };
exports.artboardSelectionShifted = function (artboardId) { return ({
    artboardId: artboardId,
    type: exports.ARTBOARD_SELECTION_SHIFTED,
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
exports.stageToolOverlayMousePanStart = function (artboardId) { return ({
    artboardId: artboardId,
    type: exports.STAGE_TOOL_OVERLAY_MOUSE_PAN_START,
}); };
exports.artboardFocused = function (artboardId) { return ({
    type: exports.ARTBOARD_FOCUSED,
    artboardId: artboardId
}); };
exports.stageToolOverlayMousePanning = function (artboardId, center, deltaY, velocityY) { return ({
    artboardId: artboardId,
    center: center,
    deltaY: deltaY,
    velocityY: velocityY,
    type: exports.STAGE_TOOL_OVERLAY_MOUSE_PANNING,
}); };
exports.stageToolOverlayMousePanEnd = function (artboardId) { return ({
    artboardId: artboardId,
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
exports.stageToolOverlayMouseDoubleClicked = function (artboardId, sourceEvent) { return ({
    artboardId: artboardId,
    type: exports.STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED,
    sourceEvent: sourceEvent
}); };
exports.artboardScroll = function (artboardId, scrollPosition) { return ({
    scrollPosition: scrollPosition,
    artboardId: artboardId,
    type: exports.ARTBOARD_SCROLL
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
exports.artboardPaneRowClicked = function (artboardId, sourceEvent) { return ({
    artboardId: artboardId,
    sourceEvent: sourceEvent,
    type: exports.ARTBOARD_PANE_ROW_CLICKED
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
exports.nextArtboardShortcutPressed = function () { return ({
    type: exports.NEXT_ARTBOARD_SHORTCUT_PRESSED,
}); };
exports.prevArtboardShortcutPressed = function () { return ({
    type: exports.PREV_ARTBOARD_SHORTCUT_PRESSED,
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

/***/ "./src/front-end/components/artboards-pane.tsx":
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
var artboards_pane_pc_1 = __webpack_require__("./src/front-end/components/artboards-pane.pc");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var ArtboardsPaneRow = artboards_pane_pc_1.hydrateTdArtboardsPaneRow(recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onClick: function (_a) {
        var onClick = _a.onClick, $id = _a.$id;
        return function (event) {
            onClick(event, $id);
        };
    }
})), {});
exports.ArtboardsPane = artboards_pane_pc_1.hydrateTdArtboardsPane(recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onArtboardClicked: function (_a) {
        var dispatch = _a.dispatch;
        return function (event, windowId) {
            dispatch(actions_1.artboardPaneRowClicked(windowId, event));
        };
    }
}), function (Base) { return function (_a) {
    var workspace = _a.workspace, artboards = _a.artboards, onArtboardClicked = _a.onArtboardClicked;
    var artboardProps = artboards.map(function (artboard) { return (__assign({}, artboard, { selected: workspace.selectionRefs.find(function (_a) {
            var $type = _a[0], $id = _a[1];
            return $id === artboard.$id;
        }) })); });
    return React.createElement(Base, { artboards: artboardProps, onArtboardClicked: onArtboardClicked });
}; }), {
    TdListItem: null,
    TdArtboardsPaneRow: ArtboardsPaneRow,
    TdList: null,
    TdPane: null
});


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/artboards-pane.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/artboards-pane.tsx"); } } })();
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


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/components-pane.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/components-pane.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/breadcrumbs/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/workspace/breadcrumbs/index.scss");
var React = __webpack_require__("./node_modules/react/react.js");
var cx = __webpack_require__("./node_modules/classnames/index.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var getBreadcrumbNodes = aerial_common2_1.weakMemo(function (workspace, browser) {
    if (workspace.selectionRefs.length === 0) {
        return [];
    }
    var _a = workspace.selectionRefs[workspace.selectionRefs.length - 1], type = _a[0], $id = _a[1];
    if (type !== state_1.SYNTHETIC_ELEMENT) {
        return [];
    }
    var node = state_1.getSyntheticNodeById(browser, $id);
    // not ready yet
    if (!node) {
        return [];
    }
    var ancestors = state_1.getSyntheticNodeAncestors(node, state_1.getSyntheticNodeWindow(browser, node.$id)).filter(function (node) { return node.$type === state_1.SYNTHETIC_ELEMENT; }).reverse();
    return ancestors.concat([node]);
});
var BreadcrumbBase = function (_a) {
    var element = _a.element, onClick = _a.onClick, selected = _a.selected, onMouseEnter = _a.onMouseEnter, onMouseLeave = _a.onMouseLeave;
    return React.createElement("div", { className: cx("breadcrumb fill-text", { selected: selected }), onClick: onClick, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave },
        state_1.getSyntheticElementLabel(element),
        selected ? null : React.createElement("span", { className: "arrow" },
            React.createElement("i", { className: "ion-ios-arrow-right" })));
};
var enhanceBreadcrumb = recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onClick: function (_a) {
        var dispatch = _a.dispatch, element = _a.element, windowId = _a.windowId;
        return function () {
            dispatch(actions_1.breadcrumbItemClicked(element.$id, windowId));
        };
    },
    onMouseEnter: function (_a) {
        var dispatch = _a.dispatch, element = _a.element, windowId = _a.windowId;
        return function () {
            dispatch(actions_1.breadcrumbItemMouseEnter(element.$id, windowId));
        };
    },
    onMouseLeave: function (_a) {
        var dispatch = _a.dispatch, element = _a.element, windowId = _a.windowId;
        return function () {
            dispatch(actions_1.breadcrumbItemMouseEnter(element.$id, windowId));
        };
    }
}));
var Breadcrumb = enhanceBreadcrumb(BreadcrumbBase);
var BreadcrumbsBase = function (_a) {
    var workspace = _a.workspace, browser = _a.browser, dispatch = _a.dispatch;
    var breadcrumbNodes = getBreadcrumbNodes(workspace, browser);
    return React.createElement("div", { className: "m-html-breadcrumbs" }, breadcrumbNodes.map(function (node, i) {
        return React.createElement(Breadcrumb, { key: node.$id, dispatch: dispatch, element: node, windowId: state_1.getSyntheticNodeWindow(browser, node.$id).$id, selected: i === breadcrumbNodes.length - 1 });
    }));
};
var Breadcrumbs = BreadcrumbsBase;
exports.Breadcrumbs = Breadcrumbs;


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/breadcrumbs/index.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/breadcrumbs/index.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/project-gutter/windows/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/workspace/project-gutter/windows/index.scss");
var React = __webpack_require__("./node_modules/react/react.js");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var index_1 = __webpack_require__("./src/front-end/components/pane/index.tsx");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var WindowRow = function (_a) {
    var window = _a.window, dispatch = _a.dispatch;
    return React.createElement("div", { className: "m-windows-pane-window-row" }, window.document && window.document.title || window.location);
};
var WindowsPaneControlsBase = function (_a) {
    var workspace = _a.workspace, dispatch = _a.dispatch, onAddWindow = _a.onAddWindow;
    return React.createElement("span", null,
        React.createElement("i", { className: "icon ion-plus", onClick: onAddWindow }));
};
var enhanceControls = recompose_1.compose(recompose_1.withHandlers({
    onAddWindow: function (_a) {
        var workspace = _a.workspace, dispatch = _a.dispatch;
        return function (event) {
            var location = prompt("Type in a URL");
            if (!location)
                return;
            dispatch(actions_1.promptedNewWindowUrl(workspace.$id, location));
        };
    }
}));
var WindowsPaneControls = enhanceControls(WindowsPaneControlsBase);
exports.WindowsPaneBase = function (_a) {
    var workspace = _a.workspace, browser = _a.browser, dispatch = _a.dispatch;
    return React.createElement(index_1.Pane, { title: "Windows", className: "m-windows-pane", controls: React.createElement(WindowsPaneControls, { workspace: workspace, dispatch: dispatch }) }, browser.windows.map(function (window) { return React.createElement(WindowRow, { key: window.$id, window: window, dispatch: dispatch }); }));
};
exports.WindowsPane = recompose_1.compose(recompose_1.pure)(exports.WindowsPaneBase);
exports.Preview = function () { return React.createElement(exports.WindowsPane, { workspace: state_1.createWorkspace({}), browser: state_1.createSyntheticBrowser({
        windows: [
            state_1.createSyntheticWindow({
                document: state_1.createSyntheticDocument({
                    title: "Window 1"
                })
            }),
            state_1.createSyntheticWindow({
                document: state_1.createSyntheticDocument({
                    title: "Window 2"
                })
            })
        ]
    }), dispatch: function () { } }); };


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/project-gutter/windows/index.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/project-gutter/windows/index.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/stage/artboard.tsx":
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
__webpack_require__("./src/front-end/components/main/workspace/stage/artboard.scss");
var VOID_ELEMENTS = __webpack_require__("./node_modules/void-elements/index.js");
var React = __webpack_require__("./node_modules/react/react.js");
var react_motion_1 = __webpack_require__("./node_modules/react-motion/lib/react-motion.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var stiffSpring = function (amount) { return react_motion_1.spring(amount, { stiffness: 330, damping: 30 }); };
var ArtboardMountBase = function (_a) {
    var setContainer = _a.setContainer;
    return React.createElement("div", { ref: setContainer });
};
var enhanceArtboardMount = recompose_1.compose(recompose_1.pure, recompose_1.withState("container", "setContainer", null), recompose_1.lifecycle({
    shouldComponentUpdate: function (props) {
        return this.props.mount !== props.mount || this.props.container !== props.container;
    },
    componentDidUpdate: function () {
        var _a = this.props, dispatch = _a.dispatch, container = _a.container, mount = _a.mount, artboardId = _a.artboardId;
        if (container && mount) {
            if (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            container.appendChild(mount);
            dispatch(actions_1.artboardMounted(artboardId));
            // TODO - dispatch mounted here
        }
    }
}));
var ArtboardMount = enhanceArtboardMount(ArtboardMountBase);
var ArtboardBase = function (_a) {
    var artboard = _a.artboard, fullScreenArtboardId = _a.fullScreenArtboardId, dispatch = _a.dispatch, smooth = _a.smooth;
    var bounds = artboard.bounds, document = artboard.document;
    var style = {
        left: bounds.left,
        top: bounds.top,
        width: bounds.right - bounds.left,
        height: bounds.bottom - bounds.top,
    };
    var defaultStyle = {
        // default to white since window background colors
        // are white too (CC)
        background: "white",
        display: fullScreenArtboardId && artboard.$id !== fullScreenArtboardId ? "none" : undefined
    };
    var smoothStyle = smooth ? {
        left: stiffSpring(style.left),
        top: stiffSpring(style.top),
        width: stiffSpring(style.width),
        height: stiffSpring(style.height)
    } : style;
    return React.createElement(react_motion_1.Motion, { defaultStyle: style, style: smoothStyle, onRest: function () { return dispatch(actions_1.canvasMotionRested()); } }, function (style) {
        return React.createElement("div", { className: "preview-artboard-component", style: __assign({}, style, defaultStyle) },
            React.createElement(ArtboardMount, { artboardId: artboard.$id, mount: artboard.mount, dispatch: dispatch }));
    });
};
exports.Artboard = recompose_1.pure(ArtboardBase);
exports.Preview = function () { return React.createElement("div", null, "PREVIEW!"); };


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/artboard.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/artboard.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/stage/empty-artboards.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/workspace/stage/empty-artboards.scss");
var React = __webpack_require__("./node_modules/react/react.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var EmptyArtboardsBase = function () {
    return React.createElement("div", { className: "m-empty-artboards" }, "Drag and drop a component here.");
};
var enhanceEmptyArboards = recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({}));
exports.EmptyArtboards = enhanceEmptyArboards(EmptyArtboardsBase);


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/empty-artboards.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/empty-artboards.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/stage/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
// https://github.com/tandemcode/tandem/blob/master/src/%40tandem/editor/browser/components/pages/workspace/mid/center/canvas/index.tsx#L270
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/workspace/stage/index.scss");
var React = __webpack_require__("./node_modules/react/react.js");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var cx = __webpack_require__("./node_modules/classnames/index.js");
var tools_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/tools/index.tsx");
var artboards_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/artboards.tsx");
var isolated_1 = __webpack_require__("./src/front-end/components/isolated/index.tsx");
var empty_artboards_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/empty-artboards.tsx");
var react_motion_1 = __webpack_require__("./node_modules/react-motion/lib/react-motion.js");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
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
__export(__webpack_require__("./src/front-end/components/main/workspace/stage/tools/index.tsx"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/index.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/index.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/stage/tools/artboards.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/workspace/stage/tools/artboards.scss");
var React = __webpack_require__("./node_modules/react/react.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
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
            artboard.document && artboard.componentId,
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


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/tools/artboards.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/tools/artboards.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/stage/tools/overlay.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate, process) {
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/workspace/stage/tools/overlay.scss");
var cx = __webpack_require__("./node_modules/classnames/index.js");
var React = __webpack_require__("./node_modules/react/react.js");
var Hammer = __webpack_require__("./node_modules/react-hammerjs/src/Hammer.js");
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var slim_dom_1 = __webpack_require__("../slim-dom/index.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var NodeOverlayBase = function (_a) {
    var artboardId = _a.artboardId, zoom = _a.zoom, bounds = _a.bounds, node = _a.node, dispatch = _a.dispatch, hovering = _a.hovering;
    if (!bounds) {
        return null;
    }
    var borderWidth = 2 / zoom;
    var style = {
        left: bounds.left,
        top: bounds.top,
        width: bounds.right - bounds.left,
        height: bounds.bottom - bounds.top,
        boxShadow: "inset 0 0 0 " + borderWidth + "px #00B5FF"
    };
    return React.createElement("div", { className: cx("visual-tools-node-overlay", { hovering: hovering }), style: style });
};
var NodeOverlay = recompose_1.pure(NodeOverlayBase);
var ArtboardOverlayToolsBase = function (_a) {
    var dispatch = _a.dispatch, artboard = _a.artboard, hoveringNodes = _a.hoveringNodes, zoom = _a.zoom, onPanStart = _a.onPanStart, onPan = _a.onPan, onPanEnd = _a.onPanEnd;
    if (!artboard.computedDOMInfo) {
        return null;
    }
    var style = {
        position: "absolute",
        left: artboard.bounds.left,
        top: artboard.bounds.top,
        width: artboard.bounds.right - artboard.bounds.left,
        height: artboard.bounds.bottom - artboard.bounds.top
    };
    return React.createElement("div", { style: style },
        React.createElement(Hammer, { onPanStart: onPanStart, onPan: onPan, onPanEnd: onPanEnd, direction: "DIRECTION_ALL" },
            React.createElement("div", { style: { width: "100%", height: "100%", position: "absolute" }, onDoubleClick: aerial_common2_1.wrapEventToDispatch(dispatch, actions_1.stageToolOverlayMouseDoubleClicked.bind(_this, artboard.$id)) }, hoveringNodes.map(function (node) { return React.createElement(NodeOverlay, { artboardId: artboard.$id, zoom: zoom, key: node.id, node: node, bounds: artboard.computedDOMInfo[node.id] && artboard.computedDOMInfo[node.id].bounds, dispatch: dispatch, hovering: true }); }))));
};
var enhanceArtboardOverlayTools = recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onPanStart: function (_a) {
        var dispatch = _a.dispatch, artboard = _a.artboard;
        return function (event) {
            dispatch(actions_1.stageToolOverlayMousePanStart(artboard.$id));
        };
    },
    onPan: function (_a) {
        var dispatch = _a.dispatch, artboard = _a.artboard;
        return function (event) {
            dispatch(actions_1.stageToolOverlayMousePanning(artboard.$id, { left: event.center.x, top: event.center.y }, event.deltaY, event.velocityY));
        };
    },
    onPanEnd: function (_a) {
        var dispatch = _a.dispatch, artboard = _a.artboard;
        return function (event) {
            event.preventDefault();
            setImmediate(function () {
                dispatch(actions_1.stageToolOverlayMousePanEnd(artboard.$id));
            });
        };
    }
}));
var ArtboardOverlayTools = enhanceArtboardOverlayTools(ArtboardOverlayToolsBase);
var getNodes = aerial_common2_1.weakMemo(function (refs, allNodes) {
    return refs.map(function (_a) {
        var type = _a[0], id = _a[1];
        return allNodes[id];
    }).filter(function (flattenedObject) { return !!flattenedObject; }).map(function (object) { return object.value; });
});
var getHoveringSyntheticNodes = aerial_common2_1.weakMemo(function (workspace, artboard) {
    var allNodes = artboard.document && slim_dom_1.flattenObjects(artboard.document) || {};
    return lodash_1.difference(getNodes(workspace.hoveringRefs, allNodes), getNodes(workspace.selectionRefs, allNodes));
});
exports.NodeOverlaysToolBase = function (_a) {
    var workspace = _a.workspace, dispatch = _a.dispatch, zoom = _a.zoom;
    return React.createElement("div", { className: "visual-tools-layer-component" }, workspace.artboards.map(function (artboard) {
        return React.createElement(ArtboardOverlayTools, { key: artboard.$id, hoveringNodes: getHoveringSyntheticNodes(workspace, artboard), artboard: artboard, dispatch: dispatch, zoom: zoom });
    }));
};
exports.NodeOverlaysTool = recompose_1.pure(exports.NodeOverlaysToolBase);


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/tools/overlay.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/tools/overlay.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/timers-browserify/main.js").setImmediate, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/stage/tools/selection/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/workspace/stage/tools/selection/index.scss");
var React = __webpack_require__("./node_modules/react/react.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var resizer_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/tools/selection/resizer.tsx");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var SelectionBounds = function (_a) {
    var workspace = _a.workspace, zoom = _a.zoom;
    var selection = state_1.getBoundedWorkspaceSelection(workspace);
    var entireBounds = aerial_common2_1.mergeBounds.apply(void 0, selection.map(function (value) { return state_1.getWorkspaceItemBounds(value, workspace); }));
    var style = {};
    var borderWidth = 1 / zoom;
    var boundsStyle = {
        position: "absolute",
        top: entireBounds.top,
        left: entireBounds.left,
        width: entireBounds.right - entireBounds.left,
        height: entireBounds.bottom - entireBounds.top,
        boxShadow: "inset 0 0 0 " + borderWidth + "px #00B5FF"
    };
    return React.createElement("div", { style: boundsStyle });
};
exports.SelectionStageToolBase = function (_a) {
    var workspace = _a.workspace, dispatch = _a.dispatch, onDoubleClick = _a.onDoubleClick, zoom = _a.zoom;
    var selection = state_1.getBoundedWorkspaceSelection(workspace);
    if (!selection.length || workspace.stage.secondarySelection)
        return null;
    return React.createElement("div", { className: "m-stage-selection-tool", tabIndex: -1, onDoubleClick: onDoubleClick },
        React.createElement(SelectionBounds, { workspace: workspace, zoom: zoom }),
        React.createElement(resizer_1.Resizer, { workspace: workspace, dispatch: dispatch, zoom: zoom }));
};
var enhanceSelectionStageTool = recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onDoubleClick: function (_a) {
        var dispatch = _a.dispatch, workspace = _a.workspace;
        return function (event) {
            var selection = state_1.getBoundedWorkspaceSelection(workspace);
            if (selection.length === 1) {
                dispatch(actions_1.selectorDoubleClicked(selection[0], event));
            }
        };
    }
}));
exports.SelectionStageTool = enhanceSelectionStageTool(exports.SelectionStageToolBase);
__export(__webpack_require__("./src/front-end/components/main/workspace/stage/tools/selection/resizer.tsx"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/tools/selection/index.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/tools/selection/index.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/stage/tools/selection/path.tsx":
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
__webpack_require__("./src/front-end/components/main/workspace/stage/tools/selection/path.scss");
var React = __webpack_require__("./node_modules/react/react.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
exports.PathBase = function (_a) {
    var bounds = _a.bounds, points = _a.points, zoom = _a.zoom, pointRadius = _a.pointRadius, strokeWidth = _a.strokeWidth, _b = _a.showPoints, showPoints = _b === void 0 ? true : _b, onPointClick = _a.onPointClick;
    var d = "";
    // calculate the size of the bounds
    points.forEach(function (point, i) {
        d += (i === 0 ? "M" : "L") + point.left + " " + point.top;
    });
    d += "Z";
    var width = bounds.right - bounds.left;
    var height = bounds.bottom - bounds.top;
    var cr = pointRadius;
    var crz = cr / zoom;
    var cw = cr * 2;
    var cwz = cw / zoom;
    var w = Math.ceil(width + Math.max(cw, cwz));
    var h = Math.ceil(height + Math.max(cw, cwz));
    var p = 100;
    return React.createElement("svg", { width: w, height: h, viewBox: [0, 0, w, h].join(" "), className: "resizer-path" },
        React.createElement("path", { d: d, strokeWidth: strokeWidth, stroke: "transparent", fill: "transparent" }),
        showPoints !== false ? points.map(function (path, key) {
            return React.createElement("rect", { onMouseDown: function (event) { return onPointClick(path, event); }, className: "point-circle-" + (path.top * 100) + "-" + path.left * 100, strokeWidth: 0, stroke: "black", fill: "transparent", width: cwz, height: cwz, x: Math.ceil(path.left * width), y: Math.ceil(path.top * height), rx: 0, ry: 0, key: key });
        }) : void 0);
};
var enhancePath = recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onPointClick: function (_a) {
        var bounds = _a.bounds, dispatch = _a.dispatch, zoom = _a.zoom, workspace = _a.workspace;
        return function (point, event) {
            event.stopPropagation();
            var sourceEvent = __assign({}, event);
            aerial_common2_1.startDOMDrag(event, (function () { }), function (event2, info) {
                var delta = {
                    left: info.delta.x / zoom,
                    top: info.delta.y / zoom
                };
                dispatch(actions_1.resizerPathMoved(workspace.$id, point, bounds, {
                    left: point.left === 0 ? bounds.left + delta.left : bounds.left,
                    top: point.top === 0 ? bounds.top + delta.top : bounds.top,
                    right: point.left === 1 ? bounds.right + delta.left : bounds.right,
                    bottom: point.top === 1 ? bounds.bottom + delta.top : bounds.bottom,
                }, event2));
            }, function (event) {
                dispatch(actions_1.resizerPathStoppedMoving(workspace.$id, event));
            });
        };
    }
}));
exports.Path = enhancePath(exports.PathBase);


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/tools/selection/path.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/tools/selection/path.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/main/workspace/stage/tools/selection/resizer.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/main/workspace/stage/tools/selection/resizer.scss");
var React = __webpack_require__("./node_modules/react/react.js");
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var path_1 = __webpack_require__("./src/front-end/components/main/workspace/stage/tools/selection/path.tsx");
var POINT_STROKE_WIDTH = 1;
var POINT_RADIUS = 4;
exports.ResizerBase = function (_a) {
    var workspace = _a.workspace, dispatch = _a.dispatch, onMouseDown = _a.onMouseDown, zoom = _a.zoom;
    var bounds = state_1.getWorkspaceSelectionBounds(workspace);
    // offset stroke
    var resizerStyle = {
        position: "absolute",
        left: bounds.left,
        top: bounds.top,
        width: bounds.right - bounds.left,
        height: bounds.bottom - bounds.top,
        transform: "translate(-" + POINT_RADIUS / zoom + "px, -" + POINT_RADIUS / zoom + "px)",
        transformOrigin: "top left"
    };
    var points = [
        { left: 0, top: 0 },
        { left: .5, top: 0 },
        { left: 1, top: 0 },
        { left: 1, top: .5 },
        { left: 1, top: 1 },
        { left: .5, top: 1 },
        { left: 0, top: 1 },
        { left: 0, top: 0.5 },
    ];
    return React.createElement("div", { className: "m-resizer-component", tabIndex: -1 },
        React.createElement("div", { className: "m-resizer-component--selection", style: resizerStyle, onMouseDown: onMouseDown },
            React.createElement(path_1.Path, { zoom: zoom, points: points, workspace: workspace, bounds: bounds, strokeWidth: POINT_STROKE_WIDTH, dispatch: dispatch, pointRadius: POINT_RADIUS })));
};
var enhanceResizer = recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onMouseDown: function (_a) {
        var dispatch = _a.dispatch, workspace = _a.workspace;
        return function (event) {
            var translate = state_1.getStageTranslate(workspace.stage);
            var bounds = state_1.getWorkspaceSelectionBounds(workspace);
            var translateLeft = translate.left;
            var translateTop = translate.top;
            var onStartDrag = function (event) {
                dispatch(actions_1.resizerMouseDown(workspace.$id, event));
            };
            var onDrag = function (event2, _a) {
                var delta = _a.delta;
                dispatch(actions_1.resizerMoved(workspace.$id, {
                    left: bounds.left + delta.x / translate.zoom,
                    top: bounds.top + delta.y / translate.zoom,
                }));
            };
            // debounce stopped moving so that it beats the stage click event
            // which checks for moving or resizing state.
            var onStopDrag = lodash_1.debounce(function () {
                dispatch(actions_1.resizerStoppedMoving(workspace.$id, null));
            }, 0);
            aerial_common2_1.startDOMDrag(event, onStartDrag, onDrag, onStopDrag);
        };
    }
}));
exports.Resizer = enhanceResizer(exports.ResizerBase);
__export(__webpack_require__("./src/front-end/components/main/workspace/stage/tools/selection/path.tsx"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/tools/selection/resizer.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/main/workspace/stage/tools/selection/resizer.tsx"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/components/tree/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./src/front-end/components/tree/index.scss");
var React = __webpack_require__("./node_modules/react/react.js");
var recompose_1 = __webpack_require__("./node_modules/recompose/es/Recompose.js");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var TreeNodeBase = function (_a) {
    var rootNode = _a.rootNode, node = _a.node, getLabel = _a.getLabel, collapsed = _a.collapsed, collapsible = _a.collapsible, onLabelClick = _a.onLabelClick, dispatch = _a.dispatch;
    var isCollapsible = collapsible(node);
    return React.createElement("div", { className: "tree-node" },
        React.createElement("div", { className: "tree-node-label", onClick: onLabelClick, style: {
                cursor: "pointer",
                paddingLeft: (aerial_common2_1.getTreeNodeDepth(node, rootNode) - 1) * 2
            } }, getLabel(node)),
        React.createElement("div", { className: "tree-node-children" }, collapsed ? null : node.childNodes.map(function (child, i) { return React.createElement(TreeNode, { key: i, rootNode: rootNode, node: child, getLabel: getLabel, collapsible: collapsible, dispatch: dispatch }); })));
};
var TreeNode = recompose_1.compose(recompose_1.pure, recompose_1.withState("collapsed", "setCollapsed", function () { return false; }), recompose_1.withHandlers({
    onLabelClick: function (_a) {
        var dispatch = _a.dispatch, node = _a.node, collapsed = _a.collapsed, collapsible = _a.collapsible, setCollapsed = _a.setCollapsed;
        return function () {
            if (collapsible(node)) {
                setCollapsed(!collapsed);
            }
            if (dispatch) {
                dispatch(actions_1.treeNodeLabelClicked(node));
            }
        };
    }
}))(TreeNodeBase);
exports.TreeBase = function (_a) {
    var rootNode = _a.rootNode, getLabel = _a.getLabel, collapsible = _a.collapsible, dispatch = _a.dispatch;
    return React.createElement("div", { className: "tree-component" }, rootNode.childNodes.map(function (child, i) { return React.createElement(TreeNode, { key: i, rootNode: rootNode, node: child, getLabel: getLabel, collapsible: collapsible, dispatch: dispatch }); }));
};
exports.Tree = recompose_1.compose(recompose_1.pure, recompose_1.defaultProps({
    collapsible: function () { return false; }
}))(exports.TreeBase);


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/tree/index.tsx"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/components/tree/index.tsx"); } } })();
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
            // dispatch(ArtboardPaneRowClicked(windowId, event));
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
var slim_dom_1 = __webpack_require__("../slim-dom/index.js");
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
            break;
        }
        case actions_1.TREE_NODE_LABEL_CLICKED: {
            var node = event.node;
            state = state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                selectedFileId: node.$id
            });
            break;
        }
        case actions_1.TOGGLE_TARGET_CSS_TARGET_SELECTOR_CLICKED: {
            var _a = event, itemId = _a.itemId, artboardId = _a.artboardId;
            var artboard = state_1.getArtboardById(artboardId, state);
            var item = slim_dom_1.getNestedObjectById(itemId, artboard.document);
            var workspace = state_1.getArtboardWorkspace(artboard.$id, state);
            ;
            state = state_1.toggleWorkspaceTargetCSSSelector(state, workspace.$id, item.source.uri, item.selectorText);
            break;
        }
    }
    // state = canvasReducer(state, event);
    // state = syntheticBrowserReducer(state, event);
    state = aerial_browser_sandbox_1.syntheticBrowserReducer(state, event);
    state = artboardReducer(state, event);
    state = stageReducer(state, event);
    state = artboardPaneReducer(state, event);
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
        case actions_1.PREV_ARTBOARD_SHORTCUT_PRESSED: {
            return state;
        }
        case actions_1.FULL_SCREEN_TARGET_DELETED: {
            return unfullscreen(state);
        }
        case actions_1.FULL_SCREEN_SHORTCUT_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            var selection = workspace.selectionRefs[0];
            var artboardId = selection ? selection[0] === state_1.ARTBOARD ? selection[1] : state_1.getNodeArtboard(selection[1], state) && state_1.getNodeArtboard(selection[1], state).$id : null;
            if (artboardId && !workspace.stage.fullScreen) {
                var artboard = state_1.getArtboardById(artboardId, state);
                state = state_1.updateWorkspaceStage(state, workspace.$id, {
                    smooth: true,
                    fullScreen: {
                        artboardId: artboardId,
                        originalTranslate: workspace.stage.translate,
                        originalArtboardBounds: artboard.bounds
                    },
                    translate: {
                        zoom: 1,
                        left: -artboard.bounds.left,
                        top: -artboard.bounds.top
                    }
                });
                var updatedWorkspace = state_1.getSelectedWorkspace(state);
                state = state_1.updateArtboard(state, artboardId, {
                    bounds: {
                        left: artboard.bounds.left,
                        top: artboard.bounds.top,
                        right: artboard.bounds.left + workspace.stage.container.getBoundingClientRect().width,
                        bottom: artboard.bounds.top + workspace.stage.container.getBoundingClientRect().height
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
        case actions_1.RESIZER_MOVED: {
            var _c = event, point = _c.point, workspaceId = _c.workspaceId, newPoint = _c.point;
            var workspace = state_1.getSelectedWorkspace(state);
            state = state_1.updateWorkspaceStage(state, workspace.$id, {
                movingOrResizing: true
            });
            var translate = state_1.getStageTranslate(workspace.stage);
            var selectionBounds = state_1.getWorkspaceSelectionBounds(workspace);
            for (var _i = 0, _d = state_1.getBoundedWorkspaceSelection(workspace); _i < _d.length; _i++) {
                var item = _d[_i];
                var itemBounds = state_1.getWorkspaceItemBounds(item, workspace);
                // skip moving window if in full screen mode
                if (workspace.stage.fullScreen && workspace.stage.fullScreen.artboardId === item.$id) {
                    break;
                }
                var newBounds = aerial_common2_1.scaleInnerBounds(itemBounds, selectionBounds, aerial_common2_1.moveBounds(selectionBounds, newPoint));
                if (item.$type === state_1.ARTBOARD) {
                    state = state_1.updateArtboard(state, item.$id, { bounds: newBounds });
                }
            }
            return state;
        }
        case actions_1.RESIZER_PATH_MOUSE_MOVED: {
            var _e = event, workspaceId = _e.workspaceId, anchor = _e.anchor, originalBounds = _e.originalBounds, newBounds = _e.newBounds, sourceEvent = _e.sourceEvent;
            var workspace = state_1.getSelectedWorkspace(state);
            state = state_1.updateWorkspaceStage(state, workspace.$id, {
                movingOrResizing: true
            });
            // TODO - possibly use BoundsStruct instead of Bounds since there are cases where bounds prop doesn't exist
            var currentBounds = state_1.getWorkspaceSelectionBounds(workspace);
            var keepAspectRatio = sourceEvent.shiftKey;
            var keepCenter = sourceEvent.altKey;
            if (keepCenter) {
                // newBounds = keepBoundsCenter(newBounds, bounds, anchor);
            }
            if (keepAspectRatio) {
                newBounds = aerial_common2_1.keepBoundsAspectRatio(newBounds, originalBounds, anchor, keepCenter ? { left: 0.5, top: 0.5 } : anchor);
            }
            for (var _f = 0, _g = state_1.getBoundedWorkspaceSelection(workspace); _f < _g.length; _f++) {
                var item = _g[_f];
                var innerBounds = state_1.getSyntheticBrowserItemBounds(state, item);
                var scaledBounds = aerial_common2_1.scaleInnerBounds(currentBounds, currentBounds, newBounds);
                if (item.$type === state_1.ARTBOARD) {
                    state = state_1.updateArtboard(state, item.$id, {
                        bounds: aerial_common2_1.scaleInnerBounds(innerBounds, currentBounds, newBounds)
                    });
                }
            }
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
        case actions_1.ARTBOARD_FOCUSED: {
            var artboardId = event.artboardId;
            return selectAndCenterArtboard(state, state_1.getArtboardById(artboardId, state));
        }
        case aerial_browser_sandbox_1.SYNTHETIC_WINDOW_PROXY_OPENED: {
            var _h = event, instance = _h.instance, isNew = _h.isNew;
            // if a window instance exists in the store, then it's already visible on stage -- could
            // have been loaded from a saved state.
            if (!isNew) {
                return state;
            }
            // return selectAndCenterArtboard(state, instance.struct);
            return state;
        }
        case actions_1.STAGE_TOOL_OVERLAY_MOUSE_LEAVE: {
            var sourceEvent = event.sourceEvent;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                hoveringRefs: []
            });
        }
        case actions_1.CSS_DECLARATION_TITLE_MOUSE_ENTER: {
            var _j = event, artboardId = _j.artboardId, ruleId = _j.ruleId;
            var artboard = state_1.getArtboardById(artboardId, state);
            // TODO
            return state;
            // const { selectorText }: SEnvCSSStyleRuleInterface = getNestedObjectById(ruleId, artboard.document);
            // return updateWorkspace(state, state.selectedWorkspaceId, {
            //   hoveringRefs: getMatchingElements(artboard, selectorText).map((element) => [
            //     element.$type,
            //     element.$id
            //   ]) as [[string, string]]
            // });
        }
        case actions_1.CSS_DECLARATION_TITLE_MOUSE_LEAVE: {
            var _k = event, artboardId = _k.artboardId, ruleId = _k.ruleId;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                hoveringRefs: []
            });
        }
        case actions_1.BREADCRUMB_ITEM_CLICKED: {
            var _l = event, artboardId = _l.artboardId, nodeId = _l.nodeId;
            var artboard = state_1.getArtboardById(artboardId, state);
            var node = slim_dom_1.getNestedObjectById(nodeId, artboard.document);
            var workspace = state_1.getArtboardWorkspace(artboard.$id, state);
            return state_1.setWorkspaceSelection(state, workspace.$id, [node.type, node.id]);
        }
        case actions_1.BREADCRUMB_ITEM_MOUSE_ENTER: {
            var _m = event, artboardId = _m.artboardId, nodeId = _m.nodeId;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                hoveringRefs: [[aerial_browser_sandbox_1.SYNTHETIC_ELEMENT, nodeId]]
            });
        }
        case actions_1.BREADCRUMB_ITEM_MOUSE_LEAVE: {
            var _o = event, artboardId = _o.artboardId, nodeId = _o.nodeId;
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
                var _p = element.getBoundingClientRect() || {}, _q = _p.width, width = _q === void 0 ? 400 : _q, _r = _p.height, height = _r === void 0 ? 300 : _r;
                var workspaceId = state.selectedWorkspaceId;
                var workspace = state_1.getSelectedWorkspace(state);
                state = state_1.updateWorkspaceStage(state, workspaceId, { container: element });
                // do not center if in full screen mode
                if (workspace.stage.fullScreen) {
                    return state_1.updateArtboardSize(state, workspace.stage.fullScreen.artboardId, width, height);
                }
                return centerSelectedWorkspace(state);
            }
            ;
        case actions_1.STAGE_TOOL_OVERLAY_MOUSE_PAN_START: {
            var artboardId = event.artboardId;
            var workspace = state_1.getArtboardWorkspace(artboardId, state);
            return state_1.updateWorkspaceStage(state, workspace.$id, { panning: true });
        }
        case actions_1.STAGE_TOOL_OVERLAY_MOUSE_PAN_END: {
            var artboardId = event.artboardId;
            var workspace = state_1.getArtboardWorkspace(artboardId, state);
            return state_1.updateWorkspaceStage(state, workspace.$id, { panning: false });
        }
        case actions_1.STAGE_MOUSE_MOVED:
            {
                var _s = event.sourceEvent, pageX = _s.pageX, pageY = _s.pageY;
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
                state = handleArtboardSelectionFromAction(state, targetRef, event);
                state = state_1.updateWorkspaceStage(state, workspace.$id, {
                    secondarySelection: false
                });
                return state;
            }
            return state;
        }
        case actions_1.STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED: {
            var _t = event, sourceEvent = _t.sourceEvent, artboardId = _t.artboardId;
            var workspace = state_1.getArtboardWorkspace(artboardId, state);
            var targetRef = state_1.getStageToolMouseNodeTargetReference(state, event);
            if (!targetRef)
                return state;
            state = state_1.updateWorkspaceStage(state, workspace.$id, {
                secondarySelection: true
            });
            state = state_1.setWorkspaceSelection(state, workspace.$id, targetRef);
            return state;
        }
        case actions_1.ARTBOARD_SELECTION_SHIFTED: {
            var artboardId = event.artboardId;
            return selectAndCenterArtboard(state, state_1.getArtboardById(artboardId, state));
        }
        case actions_1.SELECTOR_DOUBLE_CLICKED: {
            var _u = event, sourceEvent = _u.sourceEvent, item = _u.item;
            var workspace = state_1.getSyntheticNodeWorkspace(state, item.$id);
            state = state_1.updateWorkspaceStage(state, workspace.$id, {
                secondarySelection: true
            });
            state = state_1.setWorkspaceSelection(state, workspace.$id, aerial_common2_1.getStructReference(item));
            return state;
        }
        case actions_1.ARTBOARD_SCROLL: {
            var _v = event, artboardId = _v.artboardId, scrollPosition = _v.scrollPosition;
            return state_1.updateArtboard(state, artboardId, {
                scrollPosition: scrollPosition
            });
        }
        case actions_1.WORKSPACE_DELETION_SELECTED: {
            var workspaceId = event.workspaceId;
            state = state_1.clearWorkspaceSelection(state, workspaceId);
            return state;
        }
        case actions_1.STAGE_TOOL_ARTBOARD_TITLE_CLICKED: {
            state = updateWorkspaceStageSmoothing(state);
            return handleArtboardSelectionFromAction(state, aerial_common2_1.getStructReference(state_1.getArtboardById(event.artboardId, state)), event);
        }
        case actions_1.STAGE_TOOL_WINDOW_BACKGROUND_CLICKED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.clearWorkspaceSelection(state, workspace.$id);
        }
    }
    return state;
};
var unfullscreen = function (state, workspaceId) {
    if (workspaceId === void 0) { workspaceId = state.selectedWorkspaceId; }
    var workspace = state_1.getWorkspaceById(state, workspaceId);
    var _a = workspace.stage.fullScreen, originalArtboardBounds = _a.originalArtboardBounds, artboardId = _a.artboardId;
    state = state_1.updateWorkspaceStage(state, workspace.$id, {
        smooth: true,
        fullScreen: undefined
    });
    state = state_1.updateWorkspaceStage(state, workspace.$id, {
        translate: workspace.stage.fullScreen.originalTranslate,
        smooth: true
    });
    state = state_1.updateArtboard(state, artboardId, {
        bounds: originalArtboardBounds
    });
    return state;
};
var selectAndCenterArtboard = function (state, artboard) {
    var workspace = state_1.getSelectedWorkspace(state);
    if (!workspace.stage.container)
        return state;
    var _a = workspace.stage.container.getBoundingClientRect(), width = _a.width, height = _a.height;
    state = centerStage(state, state.selectedWorkspaceId, artboard.bounds, true, workspace.stage.fullScreen ? workspace.stage.fullScreen.originalTranslate.zoom : true);
    // update translate
    workspace = state_1.getSelectedWorkspace(state);
    if (workspace.stage.fullScreen) {
        state = state_1.updateWorkspaceStage(state, workspace.$id, {
            smooth: true,
            fullScreen: {
                artboardId: artboard.$id,
                originalTranslate: workspace.stage.translate,
                originalArtboardBounds: artboard.bounds
            },
            translate: {
                zoom: 1,
                left: -artboard.bounds.left,
                top: -artboard.bounds.top
            }
        });
    }
    state = state_1.setWorkspaceSelection(state, workspace.$id, aerial_common2_1.getStructReference(artboard));
    return state;
};
var artboardReducer = function (state, event) {
    switch (event.type) {
        case actions_1.ARTBOARD_LOADED: {
            var _a = event, artboardId = _a.artboardId, dependencyUris = _a.dependencyUris, document_1 = _a.document, mount = _a.mount;
            return state_1.updateArtboard(state, artboardId, {
                dependencyUris: dependencyUris,
                document: document_1,
                originalDocument: document_1,
                mount: mount,
                checksum: slim_dom_1.getDocumentChecksum(document_1)
            });
        }
        case actions_1.ARTBOARD_DIFFED: {
            var _b = event, artboardId = _b.artboardId, diffs = _b.diffs;
            var artboard = state_1.getArtboardById(artboardId, state);
            var document_2 = slim_dom_1.patchNode(artboard.document, diffs);
            return state_1.updateArtboard(state, artboardId, {
                document: document_2,
                checksum: slim_dom_1.getDocumentChecksum(document_2)
            });
        }
        case actions_1.ARTBOARD_RENDERED: {
            var _c = event, artboardId = _c.artboardId, nativeNodeMap = _c.nativeNodeMap;
            return state_1.updateArtboard(state, artboardId, {
                nativeNodeMap: nativeNodeMap
            });
        }
        case actions_1.STAGE_RESIZED: {
            var _d = event, width = _d.width, height = _d.height;
            return resizeFullScreenArtboard(state, width, height);
        }
        case aerial_common2_1.REMOVED: {
            var _e = event, itemId = _e.itemId, itemType = _e.itemType;
            if (itemType === state_1.ARTBOARD) {
                state = state_1.removeArtboard(itemId, state);
            }
            return state;
        }
        case actions_1.ARTBOARD_DOM_INFO_COMPUTED: {
            var _f = event, artboardId = _f.artboardId, computedInfo = _f.computedInfo;
            return state_1.updateArtboard(state, artboardId, {
                computedDOMInfo: computedInfo
            });
        }
        case actions_1.ARTBOARD_CREATED: {
            var artboard = event.artboard;
            if (!artboard.bounds) {
                artboard = state_1.moveArtboardToBestPosition(artboard, state);
            }
            var workspace = state_1.getSelectedWorkspace(state);
            state = state_1.updateWorkspace(state, workspace.$id, {
                artboards: workspace.artboards.concat([artboard])
            });
            state = state_1.setWorkspaceSelection(state, workspace.$id, aerial_common2_1.getStructReference(artboard));
            return state;
        }
    }
    return state;
};
var centerSelectedWorkspace = function (state, smooth) {
    if (smooth === void 0) { smooth = false; }
    var workspace = state_1.getWorkspaceById(state, state.selectedWorkspaceId);
    var innerBounds = state_1.getArtboardBounds(workspace);
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
var handleArtboardSelectionFromAction = function (state, ref, event) {
    var sourceEvent = event.sourceEvent;
    var workspace = state_1.getSelectedWorkspace(state);
    return state_1.setWorkspaceSelection(state, workspace.$id, ref);
};
var resizeFullScreenArtboard = function (state, width, height) {
    var workspace = state_1.getSelectedWorkspace(state);
    if (workspace.stage.fullScreen && workspace.stage.container) {
        // TODO - do not all getBoundingClientRect here. Dimensions need to be 
        return state_1.updateArtboardSize(state, workspace.stage.fullScreen.artboardId, width, height);
    }
    return state;
};
var normalizeZoom = function (zoom) {
    return (zoom < 1 ? 1 / Math.round(1 / zoom) : Math.round(zoom));
};
var artboardPaneReducer = function (state, event) {
    switch (event.type) {
        case actions_1.ARTBOARD_PANE_ROW_CLICKED: {
            var artboardId = event.artboardId;
            return selectAndCenterArtboard(state, state_1.getArtboardById(artboardId, state));
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

/***/ "./src/front-end/sagas/artboard.ts":
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
var slim_dom_1 = __webpack_require__("../slim-dom/index.js");
var effects_1 = __webpack_require__("./node_modules/redux-saga/es/effects.js");
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var redux_saga_1 = __webpack_require__("./node_modules/redux-saga/es/index.js");
var aerial_common2_2 = __webpack_require__("../aerial-common2/index.js");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var utils_1 = __webpack_require__("./src/front-end/utils/index.ts");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var COMPUTE_DOM_INFO_DELAY = 500;
var VELOCITY_MULTIPLIER = 10;
var DEFAULT_MOMENTUM_DAMP = 0.1;
var MOMENTUM_THRESHOLD = 100;
var MOMENTUM_DELAY = 50;
function artboardSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(handleLoadAllArtboards)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleChangedArtboards)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleCreatedArtboard)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleArtboardRendered)];
            case 4:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleMoved)];
            case 5:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleResized)];
            case 6:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleScroll)];
            case 7:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSyncScroll)];
            case 8:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleArtboardSizeChanges)];
            case 9:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleOpenExternalArtboardsRequested)];
            case 10:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.artboardSaga = artboardSaga;
function handleLoadAllArtboards() {
    var state, workspace, _loop_1, _i, _a, artboard;
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
                _loop_1 = function (artboard) {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, effects_1.spawn(function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, effects_1.call(reloadArtboard, artboard.$id)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = workspace.artboards;
                _b.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                artboard = _a[_i];
                return [5 /*yield**/, _loop_1(artboard)];
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
function handleChangedArtboards() {
    var _a, filePath, publicPath, state, workspace, _i, _b, artboard;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (false) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(actions_1.FILE_CONTENT_CHANGED)];
            case 1:
                _a = _c.sent(), filePath = _a.filePath, publicPath = _a.publicPath;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _c.sent();
                workspace = state_1.getSelectedWorkspace(state);
                _i = 0, _b = workspace.artboards;
                _c.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                artboard = _b[_i];
                if (!(artboard.dependencyUris.indexOf(filePath) !== -1)) return [3 /*break*/, 5];
                return [4 /*yield*/, effects_1.call(diffArtboard, artboard.$id)];
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
function handleArtboardRendered() {
    var _loop_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _loop_2 = function () {
                    var artboardId;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, effects_1.take(actions_1.ARTBOARD_RENDERED)];
                            case 1:
                                artboardId = (_a.sent()).artboardId;
                                return [4 /*yield*/, effects_1.fork(function () {
                                        var artboard, _a, _b;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0:
                                                    _a = state_1.getArtboardById;
                                                    _b = [artboardId];
                                                    return [4 /*yield*/, effects_1.select()];
                                                case 1:
                                                    artboard = _a.apply(void 0, _b.concat([_c.sent()]));
                                                    // delay for a bit to ensure that the DOM nodes are painted. This is a dumb quick fix that may be racy sometimes. 
                                                    return [4 /*yield*/, effects_1.call(redux_saga_1.delay, COMPUTE_DOM_INFO_DELAY)];
                                                case 2:
                                                    // delay for a bit to ensure that the DOM nodes are painted. This is a dumb quick fix that may be racy sometimes. 
                                                    _c.sent();
                                                    return [4 /*yield*/, effects_1.call(recomputeArtboardInfo, artboard)];
                                                case 3:
                                                    _c.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    })];
                            case 2:
                                _a.sent();
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
var RESIZE_TIMEOUT = 10;
function handleArtboardSizeChanges() {
    var _loop_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _loop_3 = function () {
                    var artboardId, artboard, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, effects_1.take(actions_1.ARTBOARD_RENDERED)];
                            case 1:
                                artboardId = (_c.sent()).artboardId;
                                _a = state_1.getArtboardById;
                                _b = [artboardId];
                                return [4 /*yield*/, effects_1.select()];
                            case 2:
                                artboard = _a.apply(void 0, _b.concat([_c.sent()]));
                                return [4 /*yield*/, effects_1.fork(function () {
                                        var resizeChan;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    resizeChan = redux_saga_1.eventChannel(function (emit) {
                                                        artboard.mount.contentWindow.addEventListener("resize", lodash_1.debounce(emit, RESIZE_TIMEOUT));
                                                        return function () { };
                                                    });
                                                    _a.label = 1;
                                                case 1:
                                                    if (false) return [3 /*break*/, 4];
                                                    return [4 /*yield*/, effects_1.take(resizeChan)];
                                                case 2:
                                                    _a.sent();
                                                    return [4 /*yield*/, effects_1.call(recomputeArtboardInfo, artboard)];
                                                case 3:
                                                    _a.sent();
                                                    return [3 /*break*/, 1];
                                                case 4: return [2 /*return*/];
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
                return [5 /*yield**/, _loop_3()];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
function recomputeArtboardInfo(artboard) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.put(actions_1.artboardDOMComputedInfo(artboard.$id, slim_dom_1.computedDOMInfo(artboard.nativeNodeMap)))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function reloadArtboard(artboardId) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.spawn(function () {
                    var state, artboard, _a, dependencyUris, compressedNode, doc, mount, renderChan;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, effects_1.select()];
                            case 1:
                                state = _b.sent();
                                artboard = state_1.getArtboardById(artboardId, state);
                                return [4 /*yield*/, effects_1.call(utils_1.getComponentPreview, artboard.componentId, artboard.previewName, state)];
                            case 2:
                                _a = _b.sent(), dependencyUris = _a[0], compressedNode = _a[1];
                                doc = slim_dom_1.uncompressRootNode([dependencyUris, compressedNode]);
                                mount = document.createElement("iframe");
                                mount.setAttribute("style", "border: none; width: 100%; height: 100%");
                                renderChan = redux_saga_1.eventChannel(function (emit) {
                                    mount.addEventListener("load", function () {
                                        emit(slim_dom_1.renderDOM(doc, mount.contentDocument.body));
                                    });
                                    return function () { };
                                });
                                return [4 /*yield*/, effects_1.spawn(function () {
                                        var _a, _b, _c;
                                        return __generator(this, function (_d) {
                                            switch (_d.label) {
                                                case 0:
                                                    _a = effects_1.put;
                                                    _b = actions_1.artboardRendered;
                                                    _c = [artboardId];
                                                    return [4 /*yield*/, effects_1.take(renderChan)];
                                                case 1: return [4 /*yield*/, _a.apply(void 0, [_b.apply(void 0, _c.concat([_d.sent()]))])];
                                                case 2:
                                                    _d.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    })];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, effects_1.put(actions_1.artboardLoaded(artboard.$id, dependencyUris, doc, mount))];
                            case 4:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function diffArtboard(artboardId) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.spawn(function () {
                    var state, artboard, diffs;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, effects_1.select()];
                            case 1:
                                state = _a.sent();
                                artboard = state_1.getArtboardById(artboardId, state);
                                return [4 /*yield*/, effects_1.call(utils_1.getDocumentPreviewDiff, artboard.componentId, artboard.previewName, artboard.checksum, state)];
                            case 2:
                                diffs = _a.sent();
                                // TODO - patch DOM nodes here
                                return [4 /*yield*/, effects_1.put(actions_1.artboardDiffed(artboard.$id, diffs))];
                            case 3:
                                // TODO - patch DOM nodes here
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleCreatedArtboard() {
    var artboard;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take(actions_1.ARTBOARD_CREATED)];
            case 1:
                artboard = (_a.sent()).artboard;
                return [4 /*yield*/, effects_1.call(reloadArtboard, artboard.$id)];
            case 2:
                _a.sent();
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}
function handleMoved() {
    var point;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 2];
                return [4 /*yield*/, effects_1.take(function (action) { return action.type === aerial_common2_2.MOVED && action.itemType === state_1.ARTBOARD; })];
            case 1:
                point = (_a.sent()).point;
                return [3 /*break*/, 0];
            case 2: return [2 /*return*/];
        }
    });
}
function handleResized() {
    var bounds;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.take(function (action) { return action.type === aerial_common2_2.RESIZED && action.itemType === state_1.ARTBOARD; })];
            case 1:
                bounds = (_a.sent()).bounds;
                return [2 /*return*/];
        }
    });
}
function handleScroll() {
    function scrollDelta(windowId, deltaY) {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, effects_1.put(actions_1.artboardScroll(windowId, aerial_common2_1.shiftPoint(panStartScrollPosition, {
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
                        var event_1, artboardId, deltaY, center, newVelocityY, zoom, _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 4];
                                    return [4 /*yield*/, effects_1.take(actions_1.STAGE_TOOL_OVERLAY_MOUSE_PANNING)];
                                case 1:
                                    event_1 = lastPaneEvent = (_c.sent());
                                    artboardId = event_1.artboardId, deltaY = event_1.deltaY, center = event_1.center, newVelocityY = event_1.velocityY;
                                    _a = state_1.getStageTranslate;
                                    _b = state_1.getSelectedWorkspace;
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    zoom = _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).stage]).zoom;
                                    return [4 /*yield*/, scrollDelta(artboardId, deltaY / zoom)];
                                case 3:
                                    _c.sent();
                                    return [3 /*break*/, 0];
                                case 4: return [2 /*return*/];
                            }
                        });
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function () {
                        var _loop_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _loop_4 = function () {
                                        var artboardId, deltaY, velocityY, zoom, _a, _b;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0: return [4 /*yield*/, effects_1.take(actions_1.STAGE_TOOL_OVERLAY_MOUSE_PAN_END)];
                                                case 1:
                                                    _c.sent();
                                                    artboardId = lastPaneEvent.artboardId, deltaY = lastPaneEvent.deltaY, velocityY = lastPaneEvent.velocityY;
                                                    _a = state_1.getStageTranslate;
                                                    _b = state_1.getSelectedWorkspace;
                                                    return [4 /*yield*/, effects_1.select()];
                                                case 2:
                                                    zoom = _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).stage]).zoom;
                                                    return [4 /*yield*/, spring(deltaY, velocityY * VELOCITY_MULTIPLIER, function (deltaY) {
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0: return [4 /*yield*/, scrollDelta(artboardId, deltaY / zoom)];
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
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function handleSyncScroll() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 2];
                return [4 /*yield*/, effects_1.take([actions_1.STAGE_TOOL_OVERLAY_MOUSE_PANNING])];
            case 1:
                _a.sent();
                return [3 /*break*/, 0];
            case 2: return [2 /*return*/];
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
function handleOpenExternalArtboardsRequested() {
    var artboardInfo, state, workspace, lastExistingArtboard, _loop_5, _i, artboardInfo_1, _a, componentId, previewName;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 9];
                return [4 /*yield*/, effects_1.take(actions_1.OPEN_ARTBOARDS_REQUESTED)];
            case 1:
                artboardInfo = (_b.sent()).artboardInfo;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                workspace = state_1.getSelectedWorkspace(state);
                lastExistingArtboard = void 0;
                _loop_5 = function (componentId, previewName) {
                    var existingArtboard;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                existingArtboard = workspace.artboards.find(function (artboard) { return artboard.componentId === componentId && (!previewName || artboard.previewName === previewName); });
                                if (existingArtboard) {
                                    lastExistingArtboard = existingArtboard;
                                    return [2 /*return*/, "continue"];
                                }
                                return [4 /*yield*/, effects_1.put(actions_1.artboardCreated(lastExistingArtboard = state_1.createArtboard({
                                        componentId: componentId,
                                        previewName: previewName
                                    })))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, artboardInfo_1 = artboardInfo;
                _b.label = 3;
            case 3:
                if (!(_i < artboardInfo_1.length)) return [3 /*break*/, 6];
                _a = artboardInfo_1[_i], componentId = _a[0], previewName = _a[1];
                return [5 /*yield**/, _loop_5(componentId, previewName)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                if (!lastExistingArtboard) return [3 /*break*/, 8];
                return [4 /*yield*/, effects_1.put(actions_1.artboardFocused(lastExistingArtboard.$id))];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8: return [3 /*break*/, 0];
            case 9: return [2 /*return*/];
        }
    });
}


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/artboard.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/artboard.ts"); } } })();
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
                return [4 /*yield*/, effects_1.fork(handleScrollInFullScreenMode)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleTextEditorEscaped)];
            case 4:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleEmptyWindowsUrlAdded)];
            case 5:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleLoadedSavedState)];
            case 6:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleCSSDeclarationChanges)];
            case 7:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleWatchWindowResource)];
            case 8:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleFileChanged)];
            case 9:
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
                window_1 = state_1.getSyntheticWindow(state, workspace.stage.fullScreen.artboardId);
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
                    var _a, value, artboardId, declarationId, state, window_4;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (false) return [3 /*break*/, 3];
                                return [4 /*yield*/, effects_1.take(actions_1.CSS_DECLARATION_NAME_CHANGED)];
                            case 1:
                                _a = _b.sent(), value = _a.value, artboardId = _a.artboardId, declarationId = _a.declarationId;
                                return [4 /*yield*/, effects_1.select()];
                            case 2:
                                state = _b.sent();
                                window_4 = state_1.getSyntheticWindow(state, artboardId);
                                return [3 /*break*/, 0];
                            case 3: return [2 /*return*/];
                        }
                    });
                })];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function handleValueChanges() {
                        var _a, name_1, value, artboardId, declarationId, state, window_5, declaration;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 4];
                                    return [4 /*yield*/, effects_1.take(actions_1.CSS_DECLARATION_VALUE_CHANGED)];
                                case 1:
                                    _a = _b.sent(), name_1 = _a.name, value = _a.value, artboardId = _a.artboardId, declarationId = _a.declarationId;
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    state = _b.sent();
                                    window_5 = state_1.getSyntheticWindow(state, artboardId);
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
                        var _a, name_2, value, artboardId, declarationId, state, window_6, declaration;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 4];
                                    return [4 /*yield*/, effects_1.take(actions_1.CSS_DECLARATION_CREATED)];
                                case 1:
                                    _a = _b.sent(), name_2 = _a.name, value = _a.value, artboardId = _a.artboardId, declarationId = _a.declarationId;
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    state = _b.sent();
                                    window_6 = state_1.getSyntheticWindow(state, artboardId);
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
    var deltaTop, deltaLeft, currentWindowId, panStartScrollPosition, lastPaneEvent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                deltaTop = 0;
                deltaLeft = 0;
                return [4 /*yield*/, effects_1.fork(function () {
                        var artboardId, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (false) return [3 /*break*/, 3];
                                    return [4 /*yield*/, effects_1.take(actions_1.STAGE_TOOL_OVERLAY_MOUSE_PAN_START)];
                                case 1:
                                    artboardId = (_b.sent()).artboardId;
                                    _a = state_1.getSyntheticWindow;
                                    return [4 /*yield*/, effects_1.select()];
                                case 2:
                                    panStartScrollPosition = _a.apply(void 0, [_b.sent(), artboardId]).scrollPosition || { left: 0, top: 0 };
                                    return [3 /*break*/, 0];
                                case 3: return [2 /*return*/];
                            }
                        });
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/];
                        });
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
var createDeferredPromise = function () {
    var _resolve;
    var _reject;
    var promise = new Promise(function (resolve, reject) {
        _resolve = resolve;
        _reject = reject;
    });
    return {
        resolve: _resolve,
        reject: _reject,
        promise: promise
    };
};
var WINDOW_SYNC_MS = 1000 / 30;


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/synthetic-browser.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/synthetic-browser.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/sagas/window.ts":
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
var effects_1 = __webpack_require__("./node_modules/redux-saga/es/effects.js");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var redux_saga_1 = __webpack_require__("./node_modules/redux-saga/es/index.js");
function windowSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.fork(handleWindowResized)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.windowSaga = windowSaga;
function handleWindowResized() {
    var resizeChan;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                resizeChan = redux_saga_1.eventChannel(function (emit) {
                    window.addEventListener("resize", emit);
                    return function () { };
                });
                _a.label = 1;
            case 1:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(resizeChan)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.put(actions_1.windowResized(window.innerWidth, window.innerHeight))];
            case 3:
                _a.sent();
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/window.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/sagas/window.ts"); } } })();
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
                return [4 /*yield*/, effects_1.fork(handleMetaClickElement)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleMetaClickComponentCell)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleDeleteKeyPressed)];
            case 4:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleNextWindowPressed)];
            case 5:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handlePrevWindowPressed)];
            case 6:
                _a.sent();
                // yield fork(handleSelectionMoved);
                return [4 /*yield*/, effects_1.fork(handleSelectionStoppedMoving)];
            case 7:
                // yield fork(handleSelectionMoved);
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSelectionKeyDown)];
            case 8:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSelectionKeyUp)];
            case 9:
                _a.sent();
                // yield fork(handleSelectionResized);
                return [4 /*yield*/, effects_1.fork(handleNewLocationPrompt)];
            case 10:
                // yield fork(handleSelectionResized);
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleOpenNewWindowShortcut)];
            case 11:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleCloneSelectedWindowShortcut)];
            case 12:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleSourceClicked)];
            case 13:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleOpenExternalWindowButtonClicked)];
            case 14:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleDNDEnded)];
            case 15:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleComponentsPaneEvents)];
            case 16:
                _a.sent();
                return [4 /*yield*/, effects_1.fork(handleStageContainerResize)];
            case 17:
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
    var artboardId, state, artboard;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take(actions_1.OPEN_EXTERNAL_WINDOW_BUTTON_CLICKED)];
            case 1:
                artboardId = (_a.sent()).artboardId;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                artboard = state_1.getArtboardById(artboardId, state);
                window.open(state_1.getArtboardPreviewUri(artboard, state), "_blank");
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}
function handleMetaClickElement() {
    var event_1, state, targetRef, workspace, node;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 6];
                return [4 /*yield*/, effects_1.take(function (action) { return action.type === actions_1.STAGE_MOUSE_CLICKED && action.sourceEvent.metaKey; })];
            case 1:
                event_1 = _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                targetRef = state_1.getStageToolMouseNodeTargetReference(state, event_1);
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
    var _a, componentId, sourceEvent, state, workspace, component;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take(function (action) { return action.type === actions_1.COMPONENTS_PANE_COMPONENT_CLICKED; })];
            case 1:
                _a = _b.sent(), componentId = _a.componentId, sourceEvent = _a.sourceEvent;
                if (!sourceEvent.metaKey)
                    return [3 /*break*/, 0];
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                workspace = state_1.getSelectedWorkspace(state);
                component = state_1.getAvailableComponent(componentId, workspace);
                return [4 /*yield*/, effects_1.call(utils_1.apiOpenSourceFile, __assign({ uri: component.filePath }, component.location), state)];
            case 3:
                _b.sent();
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
                windowBounds = workspace.stage.fullScreen ? workspace.stage.fullScreen.originalArtboardBounds : origin.bounds;
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
                if (!(_i < _a.length)) return [3 /*break*/, 8];
                _b = _a[_i], type = _b[0], id = _b[1];
                return [4 /*yield*/, effects_1.put(actions_1.workspaceSelectionDeleted(workspace.$id))];
            case 4:
                _c.sent();
                return [4 /*yield*/, effects_1.put(aerial_common2_1.removed(id, type))];
            case 5:
                _c.sent();
                if (!(workspace.stage.fullScreen && workspace.stage.fullScreen.artboardId === id)) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.put(actions_1.fullScreenTargetDeleted())];
            case 6:
                _c.sent();
                _c.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 3];
            case 8: return [3 /*break*/, 0];
            case 9: return [2 /*return*/];
        }
    });
}
// function* handleSelectionMoved() {
//   while(true) {
//     const { point, workspaceId, point: newPoint } = (yield take(RESIZER_MOVED)) as ResizerMoved;
//     const state = (yield select()) as ApplicationState;
//     const workspace = getWorkspaceById(state, workspaceId);
//     const translate = getStageTranslate(workspace.stage);
//     const selectionBounds = getWorkspaceSelectionBounds(workspace);
//     for (const item of getBoundedWorkspaceSelection(workspace)) {
//       const itemBounds = getWorkspaceItemBounds(item, workspace);
//       // skip moving window if in full screen mode
//       if (workspace.stage.fullScreen && workspace.stage.fullScreen.artboardId === item.$id) {
//         continue;
//       }
//       yield put(moved(item.$id, item.$type, scaleInnerBounds(itemBounds, selectionBounds, moveBounds(selectionBounds, newPoint)), workspace.targetCSSSelectors));
//     }
//   }
// }
function handleDNDEnded() {
    var event_2, state, workspace, dropRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 8];
                return [4 /*yield*/, effects_1.take(actions_1.DND_ENDED)];
            case 1:
                event_2 = _a.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                workspace = state_1.getSelectedWorkspace(state);
                dropRef = state_1.getStageToolMouseNodeTargetReference(state, event_2);
                if (!dropRef) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.call(handleDroppedOnElement, dropRef, event_2)];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, effects_1.call(handleDroppedOnEmptySpace, event_2)];
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
        return [2 /*return*/];
    });
}
function handleDroppedOnEmptySpace(event) {
    var _a, pageX, pageY, state, componentId, workspace, availableComponent, screenshot, size, mousePosition;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = event.sourceEvent, pageX = _a.pageX, pageY = _a.pageY;
                return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _b.sent();
                componentId = event.ref[1];
                workspace = state_1.getSelectedWorkspace(state);
                availableComponent = workspace.availableComponents.find(function (component) { return component.$id === componentId; });
                screenshot = availableComponent.screenshots[0];
                size = screenshot ? { width: screenshot.clip.right - screenshot.clip.left, height: screenshot.clip.bottom - screenshot.clip.top } : {
                    width: aerial_browser_sandbox_1.DEFAULT_WINDOW_WIDTH,
                    height: aerial_browser_sandbox_1.DEFAULT_WINDOW_HEIGHT
                };
                mousePosition = state_1.getScaledMouseStagePosition(state, event);
                return [4 /*yield*/, effects_1.put(actions_1.artboardCreated(state_1.createArtboard({
                        componentId: componentId,
                        previewName: null,
                        bounds: __assign({}, mousePosition, { right: mousePosition.left + size.width, bottom: mousePosition.top + size.height })
                    })))];
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
                currentBounds = state_1.getWorkspaceSelectionBounds(workspace);
                keepAspectRatio = sourceEvent.shiftKey;
                keepCenter = sourceEvent.altKey;
                if (keepCenter) {
                    // newBounds = keepBoundsCenter(newBounds, bounds, anchor);
                }
                if (keepAspectRatio) {
                    newBounds = aerial_common2_1.keepBoundsAspectRatio(newBounds, originalBounds, anchor, keepCenter ? { left: 0.5, top: 0.5 } : anchor);
                }
                _i = 0, _b = state_1.getBoundedWorkspaceSelection(workspace);
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
    var state, workspace, itemRef, window_1, originalArtboardBounds, clonedWindow;
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
                window_1 = itemRef[0] === aerial_browser_sandbox_1.SYNTHETIC_WINDOW ? aerial_browser_sandbox_1.getSyntheticWindow(state, itemRef[1]) : aerial_browser_sandbox_1.getSyntheticNodeWindow(state, itemRef[1]);
                originalArtboardBounds = workspace.stage.fullScreen ? workspace.stage.fullScreen.originalArtboardBounds : window_1.bounds;
                return [4 /*yield*/, aerial_common2_1.request(aerial_browser_sandbox_1.openSyntheticWindowRequest({ location: window_1.location, bounds: aerial_common2_1.moveBounds(originalArtboardBounds, {
                            left: originalArtboardBounds.left,
                            top: originalArtboardBounds.bottom + WINDOW_PADDING
                        }) }, aerial_browser_sandbox_1.getSyntheticWindowBrowser(state, window_1.$id).$id))];
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
                bounds = state_1.getWorkspaceSelectionBounds(workspace);
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
    var itemId, state, item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 5];
                return [4 /*yield*/, effects_1.take(actions_1.SOURCE_CLICKED)];
            case 1:
                itemId = (_a.sent()).itemId;
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _a.sent();
                item = aerial_browser_sandbox_1.getSyntheticNodeById(state, itemId);
                if (!(item.source && item.source.uri)) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.call(utils_1.apiOpenSourceFile, item.source, state)];
            case 3:
                _a.sent();
                _a.label = 4;
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
                _i = 0, _b = state_1.getBoundedWorkspaceSelection(workspace);
                _c.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                item = _b[_i];
                // skip moving window if in full screen mode
                if (workspace.stage.fullScreen && workspace.stage.fullScreen.artboardId === item.$id) {
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
// TODO - this would be great, but doesn't work for live editing. 
// function* syncWindowsWithAvailableComponents() {
//   while(true) {
//     yield take(API_COMPONENTS_LOADED);
//     const state: ApplicationState = yield select();
//     const workspace = getWorkspaceById(state, state.selectedWorkspaceId);
//     const availableComponentUris = workspace.availableComponents.map((component) => apiGetComponentPreviewURI(component.$id, state));
//     const browser = getSyntheticBrowser(state, workspace.browserId);
//     const windowUris = browser.windows.map((window) => window.location);
//     const deletes = diffArray(windowUris, availableComponentUris, (a, b) => a === b ? 0 : -1).mutations.filter(mutation => mutation.type === ARRAY_DELETE) as any as ArrayDeleteMutation<string>[];
//     for (const {index} of deletes) {
//       const window = browser.windows[index];
//       window.instance.close();
//     }
//   }
// }
function handleNextWindowPressed() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (false) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.take(actions_1.NEXT_ARTBOARD_SHORTCUT_PRESSED)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.call(shiftSelectedArtboard, 1)];
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
                return [4 /*yield*/, effects_1.take(actions_1.PREV_ARTBOARD_SHORTCUT_PRESSED)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.call(shiftSelectedArtboard, -1)];
            case 2:
                _a.sent();
                return [3 /*break*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}
function shiftSelectedArtboard(indexDelta) {
    var state, workspace, artboard, index, change, newIndex;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                workspace = state_1.getSelectedWorkspace(state);
                artboard = state_1.getWorkspaceLastSelectionOwnerArtboard(state, state.selectedWorkspaceId) || workspace.artboards[workspace.artboards.length - 1];
                if (!artboard) {
                    return [2 /*return*/];
                }
                index = workspace.artboards.indexOf(artboard);
                change = index + indexDelta;
                newIndex = change < 0 ? workspace.artboards.length - 1 : change >= workspace.artboards.length ? 0 : change;
                return [4 /*yield*/, effects_1.put(actions_1.artboardSelectionShifted(workspace.artboards[newIndex].$id))];
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
function handleStageContainerResize() {
    var state, workspace, _a, width, height;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (false) return [3 /*break*/, 4];
                return [4 /*yield*/, effects_1.take([actions_1.LOADED_SAVED_STATE, actions_1.WINDOW_RESIZED])];
            case 1:
                _b.sent();
                return [4 /*yield*/, effects_1.select()];
            case 2:
                state = _b.sent();
                workspace = state_1.getSelectedWorkspace(state);
                if (!workspace.stage.container) {
                    return [3 /*break*/, 0];
                }
                _a = workspace.stage.container.getBoundingClientRect(), width = _a.width, height = _a.height;
                return [4 /*yield*/, effects_1.put(actions_1.stageResized(width, height))];
            case 3:
                _b.sent();
                return [3 /*break*/, 0];
            case 4: return [2 /*return*/];
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
                        onDragStart: function (event) {
                            if (handler.start) {
                                handler.start(_this.props)(event);
                            }
                            _this.props.dispatch(actions_1.dndStarted(handler.getData(_this.props), event));
                        },
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
var slim_dom_1 = __webpack_require__("../slim-dom/index.js");
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
exports.ARTBOARD = "ARTBOARD";
var ARTBOARD_PADDING = 10;
exports.DEFAULT_ARTBOARD_SIZE = {
    width: 1024,
    height: 768
};
/**
 * Utilities
 */
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
exports.filterMatchingTargetSelectors = aerial_common2_1.weakMemo(function (targetCSSSelectors, element, document) { return filterApplicableTargetSelectors(targetCSSSelectors, document).filter(function (rule) { return aerial_browser_sandbox_1.elementMatches(rule.value, element, document); }); });
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
exports.getWorkspaceReference = function (ref, workspace) {
    if (ref[0] === exports.ARTBOARD) {
        return exports.getArtboardById(ref[1], workspace);
    }
    var artboard = exports.getNodeArtboard(ref[1], workspace);
    return artboard && slim_dom_1.getNestedObjectById(ref[1], artboard.document);
};
exports.getSyntheticNodeWorkspace = aerial_common2_1.weakMemo(function (root, nodeId) {
    return exports.getArtboardWorkspace(exports.getNodeArtboard(nodeId, root).$id, root);
});
exports.getBoundedWorkspaceSelection = aerial_common2_1.weakMemo(function (workspace) { return workspace.selectionRefs.map(function (ref) { return exports.getWorkspaceReference(ref, workspace); }).filter(function (item) { return exports.getWorkspaceItemBounds(item, workspace); }); });
exports.getWorkspaceSelectionBounds = aerial_common2_1.weakMemo(function (workspace) { return aerial_common2_1.mergeBounds.apply(void 0, exports.getBoundedWorkspaceSelection(workspace).map(function (boxed) { return exports.getWorkspaceItemBounds(boxed, workspace); })); });
exports.getNodeArtboard = aerial_common2_1.weakMemo(function (nodeId, state) {
    if (state.$type === exports.WORKSPACE) {
        return state.artboards.find(function (artboard) {
            return artboard.document && Boolean(slim_dom_1.getNestedObjectById(nodeId, artboard.document));
        });
    }
    else {
        for (var _i = 0, _a = state.workspaces; _i < _a.length; _i++) {
            var workspace = _a[_i];
            var artboard = exports.getNodeArtboard(nodeId, workspace);
            if (artboard) {
                return artboard;
            }
        }
    }
});
exports.getWorkspaceNode = aerial_common2_1.weakMemo(function (nodeId, state) {
    return state.artboards.map(function (artboard) { return slim_dom_1.getNestedObjectById(nodeId, artboard.document); }).find(Boolean);
});
exports.getComputedNodeBounds = aerial_common2_1.weakMemo(function (nodeId, artboard) {
    var info = artboard.computedDOMInfo;
    return info[nodeId] && info[nodeId].bounds;
});
exports.getWorkspaceItemBounds = aerial_common2_1.weakMemo(function (value, workspace) {
    if (value.$type === exports.ARTBOARD) {
        return value.bounds;
    }
    else {
        var artboard = exports.getNodeArtboard(value.id, workspace);
        return aerial_common2_1.shiftBounds(exports.getComputedNodeBounds(value.id, artboard), artboard.bounds);
    }
});
exports.moveArtboardToBestPosition = function (artboard, state) {
    var workspace = exports.getSelectedWorkspace(state);
    var bounds = workspace.artboards.length ? exports.getArtboardBounds(workspace) : {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    };
    return __assign({}, artboard, { bounds: {
            left: ARTBOARD_PADDING + bounds.right,
            top: ARTBOARD_PADDING + bounds.top,
            right: ARTBOARD_PADDING + bounds.right + exports.DEFAULT_ARTBOARD_SIZE.width,
            bottom: ARTBOARD_PADDING + bounds.top + exports.DEFAULT_ARTBOARD_SIZE.height
        } });
};
exports.getArtboardPreviewUri = function (artboard, state) { return state.apiHost + ("/components/" + artboard.componentId + "/preview") + (artboard.previewName ? "/" + artboard.previewName : ""); };
exports.getStageZoom = function (stage) { return exports.getStageTranslate(stage).zoom; };
exports.getStageTranslate = function (stage) { return stage.translate; };
exports.getWorkspaceById = function (state, id) { return state.workspaces.find(function (workspace) { return workspace.$id === id; }); };
exports.getSelectedWorkspace = function (state) { return state.selectedWorkspaceId && exports.getWorkspaceById(state, state.selectedWorkspaceId); };
exports.getAvailableComponent = function (componentId, workspace) { return workspace.availableComponents.find(function (component) { return component.$id === componentId; }); };
exports.getWorkspaceLastSelectionOwnerArtboard = function (state, workspaceId) {
    if (workspaceId === void 0) { workspaceId = state.selectedWorkspaceId; }
    var workspace = exports.getWorkspaceById(state, workspaceId);
    if (workspace.selectionRefs.length === 0) {
        return null;
    }
    var lastSelectionRef = workspace.selectionRefs[workspace.selectionRefs.length - 1];
    return lastSelectionRef[0] === exports.ARTBOARD ? exports.getArtboardById(lastSelectionRef[1], workspace) : exports.getNodeArtboard(lastSelectionRef[1], workspace);
};
exports.getArtboardById = aerial_common2_1.weakMemo(function (artboardId, state) {
    var workspace;
    if (state.$type === exports.APPLICATION_STATE) {
        var appState = state;
        workspace = exports.getArtboardWorkspace(artboardId, appState);
        if (!workspace) {
            return null;
        }
    }
    else {
        workspace = state;
    }
    return workspace.artboards.find(function (artboard) { return artboard.$id === artboardId; });
});
exports.getArtboardBounds = aerial_common2_1.weakMemo(function (workspace) { return aerial_common2_1.mergeBounds.apply(void 0, workspace.artboards.map(function (artboard) { return artboard.bounds; })); });
exports.getArtboardWorkspace = aerial_common2_1.weakMemo(function (artboardId, state) {
    var appState = state;
    for (var _i = 0, _a = appState.workspaces; _i < _a.length; _i++) {
        var workspace = _a[_i];
        var artboard = exports.getArtboardById(artboardId, workspace);
        if (artboard)
            return workspace;
    }
    return null;
});
exports.updateArtboard = function (state, artboardId, properties) {
    var workspace = exports.getArtboardWorkspace(artboardId, state);
    var artboard = exports.getArtboardById(artboardId, workspace);
    return exports.updateWorkspace(state, workspace.$id, {
        artboards: aerial_common2_1.arrayReplaceIndex(workspace.artboards, workspace.artboards.indexOf(artboard), __assign({}, artboard, properties))
    });
};
exports.updateArtboardSize = function (state, artboardId, width, height) {
    var artboard = exports.getArtboardById(artboardId, state);
    return exports.updateArtboard(state, artboardId, {
        bounds: {
            left: artboard.bounds.left,
            top: artboard.bounds.top,
            right: artboard.bounds.left + width,
            bottom: artboard.bounds.top + height
        }
    });
};
exports.removeArtboard = function (artboardId, state) {
    var workspace = exports.getArtboardWorkspace(artboardId, state);
    var artboard = exports.getArtboardById(artboardId, workspace);
    return exports.updateWorkspace(state, workspace.$id, {
        artboards: aerial_common2_1.arrayRemoveItem(workspace.artboards, artboard)
    });
};
/**
 * Factories
 */
exports.createWorkspace = aerial_common2_1.createStructFactory(exports.WORKSPACE, {
    // null to denote style attribute
    targetCSSSelectors: [],
    artboards: [],
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
        shortcuts_1.createKeyboardShortcut("ctrl+shift+]", actions_1.nextArtboardShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("ctrl+shift+[", actions_1.prevArtboardShortcutPressed()),
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
exports.createArtboard = aerial_common2_1.createStructFactory(exports.ARTBOARD, {
    scrollPosition: {
        left: 0,
        top: 0
    }
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
    var artboard = stage.fullScreen ? exports.getArtboardById(stage.fullScreen.artboardId, workspace) : workspace.artboards.find(function (artboard) { return (aerial_common2_1.pointIntersectsBounds({ left: scaledPageX, top: scaledPageY }, artboard.bounds)); });
    if (!artboard)
        return null;
    var mouseX = scaledPageX - artboard.bounds.left;
    var mouseY = scaledPageY - artboard.bounds.top;
    var computedInfo = artboard.computedDOMInfo || {};
    var intersectingBounds = [];
    var intersectingBoundsMap = new Map();
    for (var $id in computedInfo) {
        var bounds = computedInfo[$id].bounds;
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
        selectedWorkspaceId: selectedWorkspaceId
    });
};
exports.serializeWorkspace = function (workspace) { return ({
    $id: workspace.$id,
    $type: workspace.$type,
    targetCSSSelectors: workspace.targetCSSSelectors,
    selectionRefs: [],
    artboards: workspace.artboards.map(serializeArtboard),
    stage: serializeStage(workspace.stage),
    textEditor: workspace.textEditor,
    library: [],
    availableComponents: []
}); };
var serializeArtboard = function (_a) {
    var $id = _a.$id, $type = _a.$type, componentId = _a.componentId, previewName = _a.previewName, bounds = _a.bounds;
    return ({
        $id: $id,
        $type: $type,
        componentId: componentId,
        previewName: previewName,
        bounds: bounds,
        scrollPosition: {
            left: 0,
            top: 0
        }
    });
};
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